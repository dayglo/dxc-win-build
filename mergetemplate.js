#!/usr/bin/env node
var _ = require('lodash');
var program = require('commander');
var promisify = require('promisify-node');
var fsp = promisify("fs");

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

// console.log('Opening template ' + templateValue + '.json')
// if (override){console.log('  -Using override ' + override)}

fsp.readFile('./base/lib/packer-windows/' + templateValue + '.json' )
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
	return Promise.all(
		overrideTypes.map((overrideType)=>{
			return fsp.readFile(overrideFolder + '/' +  overrideType + '.json')
			.then(JSON.parse)
			.then((overrideTypeData)=>{
				if (packerTemplate[overrideType]) {
					if (Array.isArray(overrideTypeData)) {
						overrideTypeData.forEach((element)=>{
							packerTemplate[overrideType].push(element)
						})
					} else {
						packerTemplate[overrideType] = _.merge(packerTemplate[overrideType],overrideTypeData)
					}
				} else {
					packerTemplate[overrideType] = overrideTypeData
				}
			})
		})
	)
})
.then(()=>{

	var templateName = ['dxc' , templateValue , override].join('-') + '.json' 
	var templateFullPath = './base/lib/packer-windows/' + templateName
	return fs.writeFile(templateFullPath, JSON.stringify(packerTemplate, null, 4))
	.then(()=>{
		console.log(templateFullPath)
	})

})
.catch(console.error)