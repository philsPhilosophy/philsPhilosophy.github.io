async function generateECDHKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true,
    ['deriveKey']
  );
  const privateKey = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
  const publicKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  return {
    privateKey: JSON.stringify(privateKey),
    publicKey: JSON.stringify(publicKey),
  };
}

async function deriveSharedSecret(privateKeyJwk, publicKeyJwk) {
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    JSON.parse(privateKeyJwk),
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    false,
    ['deriveKey']
  );
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    JSON.parse(publicKeyJwk),
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    false,
    []
  );
  const sharedSecretKey = await crypto.subtle.deriveKey(
    {
      name: 'ECDH',
      public: publicKey,
    },
    privateKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );
  return sharedSecretKey;
}

async function encryptMessage(sharedSecretKey, message) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    sharedSecretKey,
    data
  );
  return {
    iv: arrayBufferToBase64(iv),
    encryptedData: arrayBufferToBase64(encryptedData),
  };
}

async function decryptMessage(sharedSecretKey, iv, encryptedData) {
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: base64ToArrayBuffer(iv),
    },
    sharedSecretKey,
    base64ToArrayBuffer(encryptedData)
  );
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

function arrayBufferToBase64(buffer) {
  const byteArray = new Uint8Array(buffer);
  const byteString = String.fromCharCode(...byteArray);
  return btoa(byteString);
}

function base64ToArrayBuffer(base64) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
const generateKeysButton = document.getElementById('generate-keys');
const keysOutput = document.getElementById('keys-output');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const recipientPublicKeyInput = document.getElementById('recipient-public-key');
const messagesDiv = document.getElementById('messages');
const decryptButton = document.getElementById('decrypt');

let privateKey;
let publicKey;

generateKeysButton.addEventListener('click', async () => {
  const keyPair = await generateECDHKeyPair();
  privateKey = keyPair.privateKey;
  publicKey = keyPair.publicKey;
  keysOutput.textContent = `Public Key: ${publicKey}\nPrivate Key: ${privateKey}`;
});

messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const recipientPublicKey = recipientPublicKeyInput.value;
  const message = messageInput.value;
  const sharedSecretKey = await deriveSharedSecret(privateKey, recipientPublicKey);
  const { iv, encryptedData } = await encryptMessage(sharedSecretKey, message);
  sendMessage(publicKey, encryptedData, iv);
  messageInput.value = '';
});

decryptButton.addEventListener('click', async () => {
  const messageElements = document.getElementsByClassName('message');
  for (const messageElement of messageElements) {
    const senderPublicKey = messageElement.dataset.senderPublicKey;
    const encryptedMessage = messageElement.dataset.encryptedMessage;
    const iv = messageElement.dataset.iv;

    const sharedSecretKey = await deriveSharedSecret(privateKey, senderPublicKey);
    const decryptedMessage = await decryptMessage(sharedSecretKey, iv, encryptedMessage);

    messageElement.textContent = `From: ${senderPublicKey.substring(0, 8)}... | Message: ${decryptedMessage}`;
  }
});

function sendMessage(senderPublicKey, encryptedMessage, iv) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.dataset.senderPublicKey = senderPublicKey;
  messageElement.dataset.encryptedMessage = encryptedMessage;
  messageElement.dataset.iv = iv;
  messageElement.textContent = `From: ${senderPublicKey.substring(0, 8)}... | Message: ${encryptedMessage.substring(0, 8)}...`;
  messagesDiv.appendChild(messageElement);
}
