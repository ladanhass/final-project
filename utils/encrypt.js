//Imports crypto for encryption and decryption
const crypto = require("crypto");
//Load varibles needed from .env file
require("dotenv").config();

//Defines algorithm used for encryption and decryption
const algo = "aes-128-cbc";
// Loads iv and key from .env 
const key = Buffer.from(process.env.KEY, "hex");
const iv = Buffer.from(process.env.IV, "hex");


function encrypt(text) {
  //Creates a cipher using aes-128-cbc algorithm
  const cipher = crypto.createCipheriv(algo, key, iv);
  //Encrypts text and returns as hexadecimal
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(text, "utf-8")), // Encrypts text
    cipher.final(),// Completes encryption
  ]);
  return encrypted.toString("hex");
}
function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(algo, key, iv);
    //Decrypts  text and returns as string
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "hex")),
    decipher.final(),// Completes decryption
  ]);
  return decrypted.toString("utf-8");
}
//Exports the encrypt and decrypt functions
module.exports = { encrypt, decrypt };
