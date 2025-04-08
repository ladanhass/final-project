const crypto = require('crypto');
require("dotenv").config();

//genertates a random iv and key 
// const key = crypto.randomBytes(16).toString('hex');
// const iv = crypto.randomBytes(16).toString('hex');

//defines algorithm 
const algo = 'aes-128-cbc';
//loads iv and key from .env 
const key= Buffer.from(process.env.KEY, 'hex');
const iv = Buffer.from(process.env.IV, 'hex');

function encrypt(text){
    const cipher = crypto.createCipheriv(algo, key, iv );
    const encrypted = Buffer.concat([cipher.update(Buffer.from(text,
         'utf-8')),
         cipher.final()
        ]);
    return encrypted.toString('hex');
}
function decrypt(encryptedText){
    const decipher = crypto.createDecipheriv(algo, key, iv );
    const decrypted =Buffer.concat([decipher.update(Buffer.from(encryptedText,
        'hex')), decipher.final()
        ]);
    return decrypted.toString('utf-8');
}
// const orginal = "hello is this encrpted and decrpted "
//  const encryptedText = encrypt(orginal);
// console.log(encryptedText);
// const decryptedText = decrypt(encryptedText);
// console.log(decryptedText);

 module.exports = { encrypt, decrypt};




