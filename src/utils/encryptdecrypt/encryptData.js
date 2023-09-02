
import CryptoJS from 'crypto-js';

const SECRET_KEY = "gWLq2soEI0wzcqc5vLTuzsix0eclal";

const encrypt = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  return ciphertext;
};

const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export { encrypt, decrypt };