import { Router } from "express";
import instance, { contract, abi } from "../ethers.js";
const router = Router();

router.post("/issue", async function (req, res) {
  let body = req.body;
  console.log(body);

  try {
    const trx = await instance.issue(
      body.id,
      body.name,
      body.course,
      body.grade,
      body.date,
    );
    res.status(201).json(trx);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/fetch", async function (req, res) {
  let query = req.query;
  console.log(query);

  try {
    const result = await instance.Certificates(query.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/abi", async function (req, res) {
  try {
    res.status(200).json({ contract, abi });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
router.get("/events", async function (req, res) {
  try {
    const { JsonRpcProvider, Contract } = await import("ethers");
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const details = require("../../artifacts/details.json");
    const provider = new JsonRpcProvider(
  `https://eth-hoodi.g.alchemy.com/v2/${process.env.API_KEY}`
);
   // const provider = new JsonRpcProvider("https://ethereum-hoodi-rpc.publicnode.com");
    const readContract = new Contract(contract, abi, provider);

    const filter = readContract.filters.Issued();
    const logs = await readContract.queryFilter(filter, -1000);

    const events = logs.map((log) => ({
      course: log.args[0],
      id: log.args[1].toString(),
      grade: log.args[2],
      txHash: log.transactionHash,
      block: log.blockNumber,
    }));

    res.status(200).json(events);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
