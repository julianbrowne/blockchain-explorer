
import {utils} from "./utils";

function Miner(blockData, targetHashPrefix, updateDisplayFunction) { 

	console.log("mining");

	const miner = this;

	this.blockData = blockData;
	this.targetHashPrefix = targetHashPrefix;

	this.mineAttempts = 0;
	this.maxAttempts = 250000;
	this.success = null;
	this.hash = null;

	function matchingHash(hash, target) { 
		return (hash.substr(0, target.length) === target);
	};

	function sleep(ms) { 
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	this.mine = async function() { 

		// next mining attempt

		miner.mineAttempts++;

		// generate latest hash

		miner.hash = utils.hash(this.blockData + miner.mineAttempts);

		// update display callback with latest hash

		updateDisplayFunction(miner.hash, miner.mineAttempts);

		// check for match to target

		if(matchingHash(miner.hash, miner.targetHashPrefix)) { 
			miner.success = true;
			return;
		}

		// too many attempts?

		if(miner.mineAttempts > miner.maxAttempts) { 
			miner.success = false;
			return;
		}

		await sleep(1);
		miner.mine();

	};

	this.done = function(successFunction) { 
		miner.success = successFunction;
	};

};

export {Miner};
