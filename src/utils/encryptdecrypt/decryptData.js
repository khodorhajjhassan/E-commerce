import crypto from 'crypto'

// Function to decrypt data using AES
export const decryptData = (encryptedData, secretKey) =>{
    const [ivString, encryptedString] = encryptedData.split(':');
    const iv = Buffer.from(ivString, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decrypted = decipher.update(encryptedString, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export default decryptData;