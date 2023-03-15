
# Blockchain Explorer

A collection of html widgets to explore hashes, chains of hashes, blockchains of hashes and mining as used in the article [Blockchain and The Third Web](https://www.julianbrowne.com/article/blockchain/).

The code extensively use jQuery to create the dynamic elements and bootstrap to make it look presentable.  
The SHA256 algorithm is taken from https://github.com/emn178/js-sha256  


# Instructions

The `dist` folder contains a bundled/compressed js file called `blockchain-explorer.js` which needs to be included.

	<script type="text/javascript" src="{{path-to-dist}}/blockchain-explorer.js"></script>

This creates a global object called `blockchainExplorer` with four methods. You can see all four methods running in the [test page](https://julianbrowne.github.io/blockchain-explorer/test/)

HTML elements are created at the same point the script is called and inserted after the `<script>` tag

## Basic Hash

	blockchainExplorer.basicHash();

`basicHash()` creates a bootstrap input group with two text fields in it. One contains an editable input field of text (as input to a SHA256 hash function) and the other is a disabled html text input that contains the output from the hash function. The output field is update on every keypress.

## Chain of Hashes

	blockchainExplorer.chainOfHashes(lengthOfChain);

`chainOfHashes()` takes an integer argument which defines the length of the chain of hashes. It then generates a series of bootstrap input groups, similar to the basic hash but with each hash value dependent on both the input value and the hash of the previous value. The output fields are updated on every keypress.

## Tree of Hashes

	blockchainExplorer.treeOfHashes(widthOfTree);

`treeOfHashes()` takes an integer argument which defines the width of the bottom of the inverse tree. e.g. a width of 6 would create a bottom row of 6 text inputs, then 3 hashes, then 2 hashes, then 1 top hash. The tree is updated on every keypress.

## Mining

	blockchainExplorer.mining();

`mining()` builds a short chain of hashes and adds a nonce field, a target top hash field and a button which when clicked will change the nonce until the target top hash is matched. The input fields in the chain are editable as per the chain of hashes example.

