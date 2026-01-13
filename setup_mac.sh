#!/bin/bash

touch ~/.zshrc

QUICKFINDSET=false

while read -r line
do
	if [[ "$line" =~ ^"alias quickfind="* ]]; then
		QUICKFINDSET=true
	fi
done < ~/.zshrc

NEWLINESET=false

if [[ "$QUICKFINDSET" != true ]]; then
	if [[ "$NEWLINESET" != true ]]; then
		echo '' >> ~/.zshrc
		NEWLINESET=true
	fi
	echo "Setting 'quickfind' alias";
	echo "alias quickfind='dt=\$(pwd); cd $(pwd); node --no-warnings QuickFind.js -folderPath \$dt; cd \$dt;'" >> ~/.zshrc
fi

source ~/.zshrc

echo "Setup complete"