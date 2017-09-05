#!/usr/bin/env node
var _ = require('lodash');
var program = require('commander');
var promisify = require('promisify-node');
var fs = promisify("fs");
var path = require('path');
const util = require('util');

// usage 

// Put a Packmanfile in a folder with packer templates.

// Packmanfile[.json|yml]
// includes
//    name, snippets, required inputs.

// drop it in a packer repo and run packman <template> .
// or store it in .packman and refer by name
// packman <template> [packmanfilename]

function collect (val, memo) {
    memo.push(val);
    return memo;
}

var packmanFile;

program
	.version('0.0.1')
	.usage("[packmanfile]")
	.arguments('[packmanfile]')
	.action((packmanfile)=>{packmanFile = packmanfile})
	.option('-p, --packmanfile [file]', 'which packmanfile to use', collect, [])
	.parse(process.argv);


if (!packmanFile) {
	packmanFile = "./Packmanfile"
}

fs.readFile(packmanFile)
.then(JSON.parse).catch((e)=>{console.log("could not open the specified packmanfile: " + e) ; process.exit(1)})
.then((packmanFile)=>{

	_.forIn(packmanFile.templates ,(vars,template)=>{

		fs.readFile(template)
		.then(JSON.parse).catch((e)=>{console.log("could not open the specified template: " + e) ; process.exit(2)})
		.then((packerTemplate)=>{

			_.forIn(packmanFile.includes ,(data,section)=>{
				if (section == "variables") {
					_.merge(packerTemplate.variables , packmanFile.includes.variables)
				} else {	
					packerTemplate[section].push(packmanFile.includes[section])
				}
			})

			return packerTemplate
		})
		.then((packerTemplate)=>{
			return JSON.stringify(packerTemplate, null, 4)
		})
		.then(console.log)
		.catch(console.error)

	});
})





