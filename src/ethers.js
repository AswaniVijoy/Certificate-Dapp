import { Contract, WebSocketProvider, Wallet } from "ethers";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const details = require("../artifacts/details.json");
const Cert = require("../artifacts/contracts/Cert.sol/Cert.json");

let instance;

export const contract = details.contract;
export const abi = Cert.abi;

if (process.env.CHAIN === "sepolia") {
  const provider = new WebSocketProvider(
    `wss://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`,
  );
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  instance = new Contract(contract, abi, wallet);

} else if (process.env.CHAIN === "hoodi") {
  const provider = new WebSocketProvider(
    `wss://eth-hoodi.g.alchemy.com/v2/${process.env.API_KEY}`,
  );
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  instance = new Contract(contract, abi, wallet);
} else {
  const provider = new WebSocketProvider("ws://127.0.0.1:8545");
  const signer = await provider.getSigner(details.deployer);
  instance = new Contract(contract, abi, signer);
}

export default instance;