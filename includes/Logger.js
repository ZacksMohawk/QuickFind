const fs = require('fs');

function log(message){
	if (!message){
		message = "";
	}
	console.log(message);
}

module.exports = {
	log: log
}