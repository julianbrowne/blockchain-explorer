
import {utils} from "../src/js/utils";

test("sha256", () => { 
    const inputMessage = "password";
    const hash = utils.hash(inputMessage);
    expect(hash).toEqual("5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
});

test("ascii character to binary string", () => { 
    const inputCharacter = "a";
    const binString = utils.convertCharToBinary(inputCharacter);
    expect(binString).toEqual("01100001");
});
