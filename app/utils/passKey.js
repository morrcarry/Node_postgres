const ethers = require('ethers');

function passKey() {
  const { privateKey } = ethers.Wallet.createRandom();
  const wallet = new ethers.Wallet(privateKey);
  const pubKey = wallet.signingKey.publicKey;
  return { privateKey, pubKey };
}

module.exports = passKey;
