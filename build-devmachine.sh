#!/bin/bash -ex
outputfile=dxc-windows10-devmachine.json
rm -f machinetypes/desktop/devmachine/$outputfile
./mergetemplate.js base/vcenter-delta.json -o machinetypes/desktop/devmachine > machinetypes/desktop/devmachine/packer/$outputfile
cd machinetypes/desktop/devmachine/packer

packer build \
	--var-file=../../../../vcenter-credentials.json \
	--var-file=variables.json \
	$outputfile