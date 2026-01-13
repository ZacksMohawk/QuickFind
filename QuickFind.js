global.appType = "QuickFind";
global.version = "0.0.1";

const fs = require('fs');
const prompt = require('prompt-sync')({});
const { execSync } = require("child_process");
const Logger = require('./includes/Logger');

Logger.log();
Logger.log(fs.readFileSync('AppLogo.txt', 'utf8').replace('[version]', 'QuickFind v' + version));
Logger.log();


let folderPath = __dirname;
if (process.argv.indexOf("-configPath") != -1){
	folderPath = process.argv[process.argv.indexOf("-folderPath") + 1];
}


function showSearchTypeChoices(){
	let searchTypeChoices = {
		"Filename" : showFilenameChoices,
		"Text in file" : showTextInFileChoices
	}

	let searchTypeKeys = Object.keys(searchTypeChoices);

	Logger.log("Please choose a search type\n");
	for (let index = 0; index < searchTypeKeys.length; index++){
		Logger.log("\t" + (index + 1) + ". " + searchTypeKeys[index].replaceAll(".json", ""));
	}

	Logger.log('');
	let searchTypeChoiceIndex = prompt(searchTypeKeys.length > 1 ? 'Choose (1-' + searchTypeKeys.length + '): ' : 'Choose: ');
	if (searchTypeChoiceIndex == null || searchTypeChoiceIndex == ''){
		process.exit(0);
	}
	searchTypeChoiceIndex = parseInt(searchTypeChoiceIndex.trim());
	if (Number.isNaN(searchTypeChoiceIndex) || searchTypeChoiceIndex < 1 || searchTypeChoiceIndex > searchTypeKeys.length){
		Logger.log("Invalid choice.");
		process.exit(0);
	}
	let nextFunction = searchTypeChoices[searchTypeKeys[searchTypeChoiceIndex - 1]];

	nextFunction();
}

function showFilenameChoices(){
	showMatchingTypeChoices({
		"Full match" : fileSearchFullMatch,
		"Partial match" : fileSearchPartialMatch
	});
}

function showTextInFileChoices(){
	showMatchingTypeChoices({
		"Full match" : textSearchFullMatch,
		"Partial match" : textSearchPartialMatch
	});
}

function showMatchingTypeChoices(matchingTypeChoices){
	let matchingTypeKeys = Object.keys(matchingTypeChoices);

	Logger.log("Please choose a matching type\n");
	for (let index = 0; index < matchingTypeKeys.length; index++){
		Logger.log("\t" + (index + 1) + ". " + matchingTypeKeys[index].replaceAll(".json", ""));
	}

	Logger.log('');
	let matchingTypeChoiceIndex = prompt(matchingTypeKeys.length > 1 ? 'Choose (1-' + matchingTypeKeys.length + '): ' : 'Choose: ');
	if (matchingTypeChoiceIndex == null || matchingTypeChoiceIndex == ''){
		process.exit(0);
	}
	matchingTypeChoiceIndex = parseInt(matchingTypeChoiceIndex.trim());
	if (Number.isNaN(matchingTypeChoiceIndex) || matchingTypeChoiceIndex < 1 || matchingTypeChoiceIndex > matchingTypeKeys.length){
		Logger.log("Invalid choice.");
		process.exit(0);
	}
	let nextFunction = matchingTypeChoices[matchingTypeKeys[matchingTypeChoiceIndex - 1]];

	nextFunction();
}

function fileSearchFullMatch(){
	getSearchInput("find '" + folderPath + "' -print | grep -w", displayFileResults);
}

function fileSearchPartialMatch(){
	getSearchInput("find '" + folderPath + "' -print | grep", displayFileResults);
}

function textSearchFullMatch(){
	getSearchInput("grep -rinw '" + folderPath + "' -e", displayTextResults);
}

function textSearchPartialMatch(){
	getSearchInput("grep -rin '" + folderPath + "' -e", displayTextResults);
}

function getSearchInput(searchCommand, displayFunction){
	Logger.log();
	let searchTerm = prompt('Enter search term: ');
	let completeSearchCommand = searchCommand + " '" + searchTerm + "'";
	try {
		let resultString = execSync(completeSearchCommand).toString();
		let resultsArray = resultString.split("\n");
		displayFunction(resultsArray);
	}
	catch (error){
		Logger.log("\n👎 No results\n");
		process.exit(0);
	}
}

function displayFileResults(resultsArray){
	Logger.log();
	Logger.log("Please choose a result to view (leave blank to abort)\n");

	for (let index = 0; index < resultsArray.length; index++){
		if (!resultsArray[index]){
			resultsArray.splice(index, 1);
			index--;
			continue;
		}
		Logger.log("\t" + (index + 1) + ". " + resultsArray[index]);
	}

	Logger.log('');
	let resultChoiceIndex = prompt(resultsArray.length > 1 ? 'Choose (1-' + resultsArray.length + '): ' : 'Choose: ');
	if (resultChoiceIndex == null || resultChoiceIndex == ''){
		process.exit(0);
	}
	resultChoiceIndex = parseInt(resultChoiceIndex.trim());
	if (Number.isNaN(resultChoiceIndex) || resultChoiceIndex < 1 || resultChoiceIndex > resultsArray.length){
		Logger.log("Invalid choice.");
		process.exit(0);
	}
	let chosenResult = resultsArray[resultChoiceIndex - 1];

	Logger.log("\nOpening file...\n");

	execSync("open " + chosenResult);
}

function displayTextResults(resultsArray){
	Logger.log();
	Logger.log("Please choose a result to view (leave blank to abort)\n");

	let locationArray = [];

	for (let index = 0; index < resultsArray.length; index++){
		let result = resultsArray[index];
		if (!result){
			resultsArray.splice(index, 1);
			index--;
			continue;
		}
		let splitResult = result.split(":");
		locationArray.push(splitResult[0]);

		// TODO Show partial location in different colour text
		Logger.log("\t" + (index + 1) + ". " + splitResult[2].trim());
	}

	Logger.log('');
	let resultChoiceIndex = prompt(resultsArray.length > 1 ? 'Choose (1-' + resultsArray.length + '): ' : 'Choose: ');
	if (resultChoiceIndex == null || resultChoiceIndex == ''){
		process.exit(0);
	}
	resultChoiceIndex = parseInt(resultChoiceIndex.trim());
	if (Number.isNaN(resultChoiceIndex) || resultChoiceIndex < 1 || resultChoiceIndex > resultsArray.length){
		Logger.log("Invalid choice.");
		process.exit(0);
	}
	let chosenResult = locationArray[resultChoiceIndex - 1];

	Logger.log("\nOpening file...\n");

	execSync("open " + chosenResult);
}

showSearchTypeChoices();