#!/usr/bin/env node

var program = require('commander');
var promisify = require('promisify-node');
var fs = promisify("fs");

program
	.version('0.0.1')
	.arguments('<template>')
	.action((template)=>{templateValue = template})
	.option('-o, --override [type]', 'which template override to use [vcenter]', 'vcenter')
	.parse(process.argv);

var override = program.override;

var packerTemplate;
var overrides;

console.log('Opening template ' + templateValue + '.json')
if (override){console.log('  -Using override ' + override)}

fs.open('./base/lib/packer-windows/' + templateValue + '.json' , 'r')
.then(JSON.parse)
.then((packerTemplateJSON)=>{
	packerTemplate = packerTemplateJSON
	return fs.readdir('./base/fragments/' + override)
})
.then((fileList)=>{
	return new Promise (
		fileList.filter((file)=>{
			var match = file.match(/\.json$/)
			if (match) return match[0]
		})
	)
})
.then(console.log)
.catch(console.error)