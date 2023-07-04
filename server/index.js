const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const {
  toHex,
  utf8ToBytes,
  hexToBytes,
} = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04866567d24aea3432c9e6174e7ab52d1d74db92cf3f892da27cce2258e164d62dffc7da8cfb0fa0f8da537dd52dcf45a12b28145f1d1a5519ed24b3bff732d7d3": 100,
  "042d83c8fc4d4760c1d38a411232c4e285d19c72a3c4b5910ee46fa90a534e24d530ca0ef8ad54f7b1bb6060347deeb24c7a2dd76328120f54d86a30fd28ccf728": 50,
  "04680734f689149a8f1e86befb37d3435986b317a81f9da206f38fcc45c3f33369b5386997c43703224704a07bb1740b140cbddb9f32c69be376d0b87fade2967a": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature, recoveryBit } = req.body;
  const { recipient, amount } = message;
  const messageHash = toHex(keccak256(utf8ToBytes(JSON.stringify(message))));
  const publicKey2 = secp.recoverPublicKey(
    messageHash,
    hexToBytes(signature),
    recoveryBit
  );
  const sender = toHex(publicKey2);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
