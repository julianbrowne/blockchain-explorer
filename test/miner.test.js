
import {Miner} from "../src/js/Miner";

test("Miner mines", async () => { 

    /**
     * Mine a simple block of data looking for a hash beginning with "0"
     * should take 2 attempts
    **/

    let miner = new Miner("aaa", "0", function() {});
    await miner.mine();

    expect(miner.success).toBeTruthy();
    expect(miner.mineAttempts).toEqual(2);
    expect(miner.hash[0]).toEqual("0");

    /**
     * Mine a simple block of data looking for a hash beginning with "1"
     * should take 13 attempts 
    **/

    miner = new Miner("aaa", "1", function() {});
    await miner.mine();

    expect(miner.success).toBeTruthy();
    expect(miner.mineAttempts).toEqual(13);
    expect(miner.hash[0]).toEqual("1");

});
