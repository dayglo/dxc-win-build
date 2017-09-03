#!/usr/bin/env node
var _ = require('lodash');
var program = require('commander');
var promisify = require('promisify-node');
var fs = promisify("fs");
var path = require('path');
const util = require('util');

program
	.version('0.0.1')
	.usage("<path to source template> [-o override]")
	.arguments('<template>')
	.action((template)=>{templatePath = template})
	.option('-o, --override [type]', 'which template override to use [overrides/vcenter]', 'overrides/vcenter')
	.parse(process.argv);

var override = program.override;
var overrideFolder = override

var packerTemplate;
var overrides;

fs.readFile(templatePath)
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
			return fs.readFile(overrideFolder + '/' +  overrideType + '.json')
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
	return JSON.stringify(packerTemplate, null, 4)

	// var templateName = path.basename(templatePath, '.json');
	// var templateFolder = path.dirname(templatePath);

	// var newTemplateName = ['dxc' , templateName , override].join('-') + '.json' ;
	// var newTemplateFullPath = templateFolder + '/' + newTemplateName;
	// return fs.writeFile(newTemplateFullPath, JSON.stringify(packerTemplate, null, 4))
	// .then(()=>{
	// 	console.log(newTemplateFullPath)
	// })

})
.then(console.log)
.catch(console.error)