#!/bin/bash

touch ~/.bashrc

QUICKFINDSET=false

while read -r line
do
	if [[ "$line" =~ ^"alias quickfind="* ]]; then
		QUICKFINDSET=true
	fi
done < ~/.bashrc

NEWLINESET=false

if [[ "$QUICKFINDSET" != true ]]; then
	if [[ "$NEWLINESET" != true ]]; then
		echo '' >> ~/.bashrc
		NEWLINESET=true
	fi
	echo "Setting 'quickfind' alias";
	echo "alias quickfind='dt=\$(pwd); cd $(pwd); node --no-warnings QuickFind.js -folderPath \$dt; cd \$dt;'" >> ~/.bashrc
fi

source ~/.bashrc

echo "Setup complete"