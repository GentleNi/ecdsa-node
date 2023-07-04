import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import server from "./server";

const privateKeys = [
  "01d05ffbe92969d222ec4b30263b5fa2795c398c5e1b6164eacb5c7d5537a320",
  "fd6025bb479eefbf5563c8f4aca62f8f935e811d9f2a562659d070363203be47",
  "4ea678434a9a036fa3fb00d5113ff93c9e2dd89116d98d509f1694c322591d57"
]

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey}) {
  async function onChange(evt) {
    // const priKey = toHex(secp.utils.randomPrivateKey());
    // console.log(priKey);
    // console.log(toHex(secp.getPublicKey(priKey)));

    const newPrivateKey = evt.target.value;
    setPrivateKey(newPrivateKey);
    const publicKey = toHex(secp.getPublicKey(newPrivateKey));
    setAddress(publicKey);   

    if (publicKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type private"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <div>Address: {address.slice(0, 10)}...</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
