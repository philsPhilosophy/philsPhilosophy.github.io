const generateKeysButton = document.getElementById('generate-keys');
const keysOutput = document.getElementById('keys-output');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');

let privateKey;
let publicKey;

generateKeysButton.addEventListener('click', async () => {
    const keyPair = await generateKeyPair();
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;
    keysOutput.textContent = `Public Key: ${publicKey}\nPrivate Key: ${privateKey}`;
});

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value;
    const signature = await signMessage(privateKey, message);
    sendMessage(publicKey, message, signature);
    messageInput.value = '';
});

async function generateKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: 'ECDH',
            namedCurve: 'P-256'
        },
        true,
        ['deriveKey']
    );
    const privateKey = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
    const publicKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    return {
        privateKey: JSON.stringify(privateKey),
        publicKey: JSON.stringify(publicKey)
    };
}

async function signMessage(privateKeyJwk, message) {
    const key = await crypto.subtle.importKey(
        'jwk',
        JSON.parse(privateKeyJwk),
        {
            name: 'ECDSA',
            namedCurve: 'P-256'
        },
        false,
        ['sign']
    );
    const encoder
