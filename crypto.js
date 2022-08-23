// source: https://stackoverflow.com/questions/62948516/using-native-javascript-subtlecrypto-to-encrypt-using-rsa

export async function encodeText(key, text) {
    try {
        const pub = await importPublicKey(key);
        const encrypted = await encryptRSA(pub, new TextEncoder().encode(text));
        const encryptedBase64 = window.btoa(ab2str(encrypted));
        return encryptedBase64.replace(/(.{64})/g, "$1\n"); 
    }
    catch(error) {
      console.log(error);
    }
}

async function importPublicKey(spkiPem) {       
    return await window.crypto.subtle.importKey(
        "spki",
        getSpkiDer(spkiPem),
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );
}

async function encryptRSA(key, plaintext) {
    let encrypted = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        key,
        plaintext
    );
    return encrypted;
}

function getSpkiDer(spkiPem){
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    var pemContents = spkiPem.substring(pemHeader.length, spkiPem.length - pemFooter.length);
    var binaryDerString = window.atob(pemContents);
    return str2ab(binaryDerString); 
}

//
// Helper
//

// https://stackoverflow.com/a/11058858
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
    
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}