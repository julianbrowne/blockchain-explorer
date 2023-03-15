
import {sha256} from "./sha256.js";

const utils = { 

	convertCharToBinary: function(char) { 
		const asciiBinaryTemplate = "00000000";
		if(char === undefined) return asciiBinaryTemplate;
		if(char === '') return asciiBinaryTemplate;
		if(char.length > 1) return asciiBinaryTemplate;
		const charAsBinary = char[0].charCodeAt(0).toString(2);
		return (asciiBinaryTemplate + charAsBinary).slice(-asciiBinaryTemplate.length);
	},

	hash: function(stringToHash) { 
		const message = stringToHash.toString();
		const digest = sha256(message);
		return digest.toString();
	}

};

export {utils};
