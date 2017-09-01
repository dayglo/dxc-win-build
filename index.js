#!/usr/bin/env node
var _ = require('lodash');
var program = require('commander');
var promisify = require('promisify-node');
var fs = promisify("fs");

program
	.version('0.0.1')
	.usage("<template name> [-o override]")
	.arguments('<template>')
	.action((template)=>{templateValue = template})
	.option('-o, --override [type]', 'which template override to use [vcenter]', 'vcenter')
	.parse(process.argv);

var override = program.override;
var overrideFolder = './base/fragments/' + override

var packerTemplate;
var overrides;

console.log('Opening template ' + templateValue + '.json')
if (override){console.log('  -Using override ' + override)}

fs.readFile('./base/lib/packer-windows/' + templateValue + '.json' )
.then(JSON.parse)
.then((packerTemplateJSON)=>{
	packerTemplate = packerTemplateJSON
	return fs.readdir(overrideFolder)
})
.then((fileList)=>{
	return Promise.resolve(
		fileList
		.filter((file)=>{
			var match = file.match(/\.json$/)
			if (match) return match[0]
		})
		.map((file)=>{
			var re = /^(.+?)(?:\.([^.]+))?$/;
			return (re.exec(file)[1])
		})
	)
})
.then((overrideTypes)=>{

	overrideTypes.forEach((overRideType)=>{
		fs.readFile(overrideFolder + overRideType + '.json' )
		.then((data)=>{
			packerTemplate[overRideType] = data;
			debugger
		})
	})

	return packerTemplate
})
.then(JSON.stringify)
.then(console.log)
.catch(console.error)