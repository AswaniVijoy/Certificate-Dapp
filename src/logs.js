import "dotenv/config";
import { Interface, WebSocketProvider, id } from "ethers";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// ✅ Load contract details
const details = require("../artifacts/details.json");
const Cert = require("../artifacts/contracts/Cert.sol/Cert.json");

// ✅ Setup provider (WebSocket for real-time reliability)
let provider;

if (process.env.CHAIN === "sepolia") {
  provider = new WebSocketProvider(
    `wss://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`
  );
} else if (process.env.CHAIN === "hoodi") {
  provider = new WebSocketProvider(
    `wss://eth-hoodi.g.alchemy.com/v2/${process.env.API_KEY}`
  );
} else {
  provider = new WebSocketProvider("ws://127.0.0.1:8545");
}

// ✅ Event signature (correct)
const eventTopic = id("Issued(string,uint256,string)");

// ❌ DO NOT filter course here (not indexed)
// const courseTopic = id("Certified Ethereum Developer"); ❌

// ✅ Interface to decode logs
const iface = new Interface(Cert.abi);

// ✅ Get latest block
const currentBlock = await provider.getBlockNumber();

// ✅ Fetch logs (ONLY using event topic)
const logs = await provider.getLogs({
  fromBlock: currentBlock - 5,
  toBlock: "latest",
  address: details.contract,
  topics: [eventTopic], // only event signature
});

// ✅ Decode + filter manually
logs.forEach((log) => {
  const parsed = iface.parseLog(log);

  // 🔥 Apply filtering here (correct place)
  if (parsed.args.course === "Certified Ethereum Developer") {
    console.log("Filtered Event **********");
    console.log("course:", parsed.args.course);
    console.log("id:", parsed.args.id.toString());
    console.log("grade:", parsed.args.grade);
    console.log("tx:", log.transactionHash);
    console.log("************************");
  }
});

// exit script
process.exit(0);