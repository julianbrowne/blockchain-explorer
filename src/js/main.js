
/* eslint-disable no-unused-vars */
import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import "../css/style.css";
/* eslint-enable no-unused-vars */

import {config} from "./config";
import {utils} from "./utils";
import * as dom from "./dom";
import {selectors} from "./selectors";
import {Miner} from "./Miner";

function BlockchainExplorer() { 

	this.treeOfHashes = function(blocks) { 

		if(blocks===0 || blocks<0) { 
			return;
		};

		/**
		 * cell update handler
		**/

		function updateHandler(event) { 

			/**
			 * update the hash in row 0 for the changed cell
			**/

			const cell = $(event.currentTarget);
			const newValue = cell.val();
			const data = cell.data();
			const newDigest = utils.hash(newValue);

			const hashCellForMessage = $("#merkle-row-0-digest-" + data.column);
			dom.updateCellValue(hashCellForMessage, newDigest);

			/**
			 * run through all rows 0-n and update hashes
			**/

			const rows = $(".merkle-row").length;

			for(let i=0; i<rows; i++) { 

				const cells = $("[id^=merkle-row-" + i + "-digest-]").length;
				let parentIndex = 0;

				for(let j=0; j<cells; j+=2) { 

					const h1 = $("#merkle-row-" + i  + "-digest-" + j).val();
					const h2 = $("#merkle-row-" + i  + "-digest-" + (j+1)).val();

					const hashInputs = h1 + h2;

					const h = utils.hash(hashInputs);

					console.log(`update: hashing row ${i} / column ${j}`);
					console.log(`update: inputs are:`);
					console.log(`update: ${h1}`);
					console.log(`update: ${h2}`);
					console.log(`update: which hash to:`);
					console.log(`update: ${h}`);
					console.log(`update: will save to row ${i+1} / column ${parentIndex}`);

					const parentCell = $("#merkle-row-" + (i+1) + "-digest-" + parentIndex);
					parentIndex++;

					dom.updateCellValue(parentCell, h);

				};

			};

		};

		// Always have an even number of blocks

		if(blocks%2 !== 0) { 
			blocks++;
		};

		const formGroup = dom.formGroup("merkle-tree");
		const blocksRow = dom.inputGroup();

		/**
		 * Build the bottom row of the tree
		 * which is plain text messages only
		**/

		for(let i=0; i<blocks; i++) { 

			const message = config.text[i];

			const input = dom.inputElement({ 
				id: "merkle-message-" + i,
				val: message,
				data: { 
					originalValue: message,
					column: i
				},
				keyup: updateHandler
			}, "tree-row-0");
			blocksRow.append(input);
		};

		/**
		 * Build the first row 0 of hashes
		 * one for each plain text message
		**/

		const hashesRow = dom.inputGroup();
		let hashCountForRow = 0;
		let rowIndex = 0;
		const hashTree = {};

		hashTree[rowIndex] = [];

		for(let i=0; i<blocks; i++) { 

			const message = config.text[i];
			const h = utils.hash(message);
			hashTree[rowIndex].push(h);

			if(config.debug) { 
				console.log(`merkle: hashing row ${rowIndex} / column ${i}`);
				console.log(`merkle: with message ${message}`);
				console.log(`merkle: which hashes to:`);
				console.log(`merkle: ${h}`);
			}

			const input = dom.inputElement({ 
				id: "merkle-row-" + rowIndex + "-digest-" + i,
				val: h,
				data: { 
					rowIndex: rowIndex,
					originalValue: h,
					column: i
				},
				disabled: true
			});

			if(i===0) { 
				input.addClass("merkle-row");
			};

			hashesRow.append(input);
			hashCountForRow++;
		};

		/**
		 * Build rows 1-n of hashes to the root
		 * one for each pair of hashes from the previous row
		**/

		rowIndex++;

		while((hashCountForRow/2) >= 1) { 

			const row = dom.inputGroup();
			let tempHashCountForRow = 0;

			hashTree[rowIndex] = [];

			for(let i=0, col=0; i<hashCountForRow; i+=2, col++) { 

				/**
				 * get two hashes from the row below this one
				 * and hash them into one super-hash
				**/

				const pair1 = hashTree[rowIndex-1][i];
				const pair2 = hashTree[rowIndex-1][i+1];

				const hashInputs = pair1 + pair2;

				const h = utils.hash(hashInputs);

				hashTree[rowIndex].push(h);

				if(config.debug) { 
					console.log(`merkle: hashing row ${rowIndex} / column ${col}`);
					console.log(`merkle: with hash inputs:`);
					console.log(`merkle: ${pair1}`);
					console.log(`merkle: ${pair2}`);
					console.log(`merkle: which hash to:`);
					console.log(`merkle: ${h}`);
				}

				/**
				 * create element for the super-hash
				**/

				const input = dom.inputElement({ 
					id: "merkle-row-" + rowIndex + "-digest-" + col,
					val: h,
					data: { 
						rowIndex: rowIndex,
						originalValue: h,
						column: col,
					},
					disabled: true,
					class: "text-center"
				});

				if(i===0) { 
					input.addClass("merkle-row");
				};

				row.append(input);

				tempHashCountForRow++;

			};

			hashCountForRow = tempHashCountForRow;
			formGroup.prepend(row);
			rowIndex++;

		};

		/**
		 * Append everything to the DOM
		**/

		formGroup.append(hashesRow).append(blocksRow);

		const container = dom.cardContainer("Merkle Tree", formGroup);
		container.insertAfter(dom.findLocation());

	};

	this.basicHash = function() { 

		const formGroup = dom.formGroup();

		const inputCombo = dom.textHashCombo("Message", { 
			id: selectors.basicHashMessageInputId,
			val: config.initialValue
		});

		formGroup.append(inputCombo);

		const container = dom.cardContainer("Hash Example", formGroup);

		container.insertAfter(dom.findLocation());

	};

	this.chainOfHashes = function(numberOfInputs) { 

		function updateHandler(event) { 

			/**
			 * update hash for this message
			**/

			let cell = $(event.currentTarget);
			const message = cell.val();
			let hashCell = $("#" + selectors.hashChainDigestPrefix + cell.data("index"));
			let hash = "";

			if(cell.data("prev")!==false) { 
				const prevCellHashValue = $("#" + selectors.hashChainDigestPrefix + cell.data("prev")).val();
				hash = utils.hash(prevCellHashValue + message);
			}
			else { 
				hash = utils.hash(message);
			}

			if(config.debug) { 
				console.log(`updating the hash for cell ${cell.data("index")}`);
				console.log(`which has value ${message}`);
				console.log(`the original hash was ${hashCell.data("originalValue")}`);
				console.log(`it is now ${hash}`);
			}

			dom.updateCellValue(hashCell, hash);

			/**
			 * update hash for subsequent messages, if there are any
			**/

			let nextMessage = cell.data("next");

			while(nextMessage!==false) { 

				cell = $("#" + selectors.hashChainMessagePrefix + cell.data("next"));
				const message = cell.val();

				hashCell = $("#" + selectors.hashChainDigestPrefix + cell.data("index"));

				// hash is based on current message if it is the first in the chain
				// or previous hash plus current message otherwise

				if(cell.data("prev")!==false) { 
					const previousHash = $("#" + selectors.hashChainDigestPrefix + cell.data("prev")).val();
					hash = utils.hash(previousHash + message);
					if(config.debug) { 
						console.log(`updating the hash for cell ${cell.data("index")}`);
						console.log(`the message is a combo of:`);
						console.log(`${previousHash}`);
						console.log(`and ${message}`);
						console.log(`which hashes to:`);
						console.log(`${hash}`);
					}
				}
				else { 
					hash = utils.hash(message);
					if(config.debug) { 
						console.log(`updating the hash for cell ${cell.data("index")}`);
						console.log(`the message is ${message}`);
						console.log(`the original hash was ${hashCell.data("originalValue")}`);
						console.log(`it is now ${hash}`);
					}
				}

				// update hash cell with new hash value 

				dom.updateCellValue(hashCell, hash);

				nextMessage = cell.data("next");

			};

		};

		let hash = "";
		let previousHash = "";
		const formGroup = dom.formGroup();

		for(let i=0; i<numberOfInputs; i++) { 

			const itemNumber = i+1;

			const prev = (i===0) ? false : (i-1);
			const next = (i<(numberOfInputs-1)) ? (i + 1) : false;

			const message = config.text[i];

			const g1 = dom.inputCluster("Message " + itemNumber, { 
				id: selectors.hashChainMessagePrefix + i,
				val: message,
				data: { 
					originalValue: message,
					index: i,
					prev: prev,
					next: next
				},
				keyup: updateHandler
			}, "plain-text-message-label");

			const arrow = dom.glyph("bi-arrow-return-right").prop('outerHTML');
			const label = arrow + " hash " + itemNumber;

			if(prev!==false) { 
				hash = utils.hash(previousHash + message);
				if(config.debug) { 
					console.log(`creating original hash for ${i}`);
					console.log(`the message is a combo of:`);
					console.log(`${previousHash}`);
					console.log(`and ${message}`);
					console.log(`which hashes to:`);
					console.log(`${hash}`);
				}
			}
			else { 
				hash = utils.hash(message);
				if(config.debug) { 
					console.log(`creating original hash for ${i}`);
					console.log(`the message is ${message}`);
					console.log(`which hashes to:`);
					console.log(`${hash}`);
				}
			};

			previousHash = hash;

			const g2 = dom.inputCluster(label, { 
				id: selectors.hashChainDigestPrefix + i,
				val: hash,
				data: { 
					index: i,
					originalValue: hash
				},
				disabled: true
			}, "hash-of-message-label");

			formGroup
				.append(g1)
				.append(g2);

		};

		const container = dom.cardContainer("Hash Chain", formGroup);

		container.insertAfter(dom.findLocation());

	};

	this.mining = function() { 

		const formGroup = dom.formGroup();

		/**
		 * handler to keep hashes and top hash in sync
		**/

		let hashDataItems = [];

		function updateHashes() { 

			const topHashElement = $("#" + selectors.minerTopHashId);
			const nonceValue = $("#" + selectors.minerNonceId).val();

			const currentHashDataItems = $("[id^=hash-" + selectors.minerDataItemId + "]").map(function(i, v) { 
				return $(v).val();
			}).toArray();

			currentHashDataItems.push(nonceValue);

			console.log(`items to hash: ${currentHashDataItems}`);
			console.log(`current top hash: ${topHashElement.val()}`);
			console.log(`current nonce: ${nonceValue}`);

			const newTopHash = utils.hash(currentHashDataItems.join(" "));

			console.log(`new top hash: ${newTopHash}`);

			topHashElement.val(newTopHash);

			// todo: swap local to global ..

			console.log(`old items to hash: ${hashDataItems}`);
			hashDataItems = currentHashDataItems;

		};

		/**
		 * bunch of fake data items
		 * with corresponding hashes
		**/

		for(let i=0; i<config.minerDataInputs; i++) { 

			const inputCombo = dom.textHashCombo(`data ${i+1}`, { 
				id: selectors.minerDataItemId + (i+1),
				val: config.text[i]
			});

			inputCombo.onKeyupChain(updateHashes);

			formGroup.append(inputCombo);

			const hash = inputCombo.getHashValue();

			hashDataItems.push(hash);

		};

		// console.log(hashDataItems);

		/**
		 * text input for the nonce value
		**/

		const nonceInputGroup = dom.inputCluster("Nonce Value", { 
			id: selectors.minerNonceId,
			val: "",
			placeholder: "autogenerated nonce to go here"
		}, "miner-data");

		nonceInputGroup.onKeyupChain(updateHashes);

		formGroup.append(nonceInputGroup);

		hashDataItems.push(""); // add the nonce 

		/**
		 * top hash itself
		**/

		formGroup.append(dom.inputCluster("Top Hash", { 
			id: selectors.minerTopHashId,
			val: utils.hash(hashDataItems.join(" ")),
			disabled: true
		}, "miner-data"));

		/**
		 * leading signature '000' etc for the top hash
		 * 
		 * input field takes a limited-length hex string only
		 * 
		**/

		const topHashInputGroup = dom.inputCluster("Hash Target", { 
			id: selectors.minerSignatureId,
			type: "text",
			val: "0".repeat(config.maxTargetHashLength),
			pattern: "[a-fA-F0-9]+",
			maxlength: config.maxTargetHashLength
		}, "miner-data");

		// snip the last character entered if it's not hex

		topHashInputGroup.onKeyupChain(function(event) { 
			const element = $(event.currentTarget);
			const regEx = /^[0-9a-fA-F]+$/;
			if(!regEx.test(element.val())) { 
				element.val(element.val().slice(0, -1));
			}
		});

		// miner button

		function miner() { 

			const blockData = hashDataItems.join(" ");

			const targetHashPrefix = $("#" + selectors.minerSignatureId).val();

			function updateDisplayWithLatestTopHash(hashValue, nonceValue) { 
				$("#" + selectors.minerTopHashId).val(hashValue);
				$("#" + selectors.minerNonceId).val(nonceValue);
			};

			console.log(`block data: ${blockData}`);
			console.log(`target hash: ${targetHashPrefix}`);

			const miner = new Miner(blockData, targetHashPrefix, updateDisplayWithLatestTopHash);

			miner.mine();

		};

		const button = dom.button("mine", "btn-primary");

		button.on("click", miner);

		topHashInputGroup.append(button);

		formGroup.append(topHashInputGroup);

		const container = dom.cardContainer("Mining", formGroup);

		container.insertAfter(dom.findLocation());

	};

}

export default new BlockchainExplorer();
