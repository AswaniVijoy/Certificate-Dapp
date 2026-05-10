// import { Router } from "express";
// import instance from "../ethers.js";
// const router = Router();

// /* GET home page. */
// router.get("/", function (req, res) {
//   res.render("index", { title: "Certificate DApp" });
// });

// router.get("/issue", function (req, res) {
//   res.render("issue", { title: "Certificate DApp" });
// });

// router.get("/fetch", async function (req, res) {
//   let query = req.query;
//   console.log(query);

//   try {
//     const result = await instance.Certificates(query.certificateID);
//     console.log(result);
//     res.render("view", {
//       title: "Certificate DApp",
//       id: query.certificateID,
//       name: result[0],
//       course: result[1],
//       grade: result[2],
//       date: result[3],
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });
// router.get("/events", async function (req, res) {
//   try {
//     const { JsonRpcProvider, Contract } = await import("ethers");
//     const { createRequire } = await import("module");
//     const require = createRequire(import.meta.url);
//     const details = require("../../artifacts/details.json");
//     const Cert = require("../../artifacts/contracts/Cert.sol/Cert.json");

//     const provider = new JsonRpcProvider("https://ethereum-hoodi-rpc.publicnode.com");
//     const readContract = new Contract(details.contract, Cert.abi, provider);

//     const filter = readContract.filters.Issued();
//     const logs = await readContract.queryFilter(filter, -1000);

//     const events = logs.map((log) => ({
//       course: log.args[0],
//       id: log.args[1].toString(),
//       grade: log.args[2],
//       txHash: log.transactionHash,
//       block: log.blockNumber,
//     }));

//     res.render("events", { title: "Certificate DApp", events });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });
// export default router;
// import { Router } from "express";
// import instance from "../ethers.js";

// const router = Router();

// /* GET home page */
// router.get("/", function (req, res) {
//   res.render("index", { title: "Certificate DApp" });
// });

// /* GET issue page */
// router.get("/issue", function (req, res) {
//   res.render("issue", { title: "Certificate DApp" });
// });

// /* FETCH certificate */
// router.get("/fetch", async function (req, res) {
//   const query = req.query;

//   try {
//     const result = await instance.Certificates(query.certificateID);

//     res.render("view", {
//       title: "Certificate DApp",
//       id: query.certificateID,
//       name: result[0],
//       course: result[1],
//       grade: result[2],
//       date: result[3],
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// /* EVENTS with FILTERING */
// router.get("/events", async function (req, res) {
//   try {
//     const { JsonRpcProvider, Contract } = await import("ethers");
//     const { createRequire } = await import("module");
//     const require = createRequire(import.meta.url);

//     const details = require("../../artifacts/details.json");
//     const Cert = require("../../artifacts/contracts/Cert.sol/Cert.json");

//     const provider = new JsonRpcProvider(
//       "https://ethereum-hoodi-rpc.publicnode.com"
//     );

//     const readContract = new Contract(details.contract, Cert.abi, provider);

//     const filter = readContract.filters.Issued();
//     const currentBlock = await provider.getBlockNumber();

//     const logs = await readContract.queryFilter(
//       filter,
//       currentBlock - 1000,
//       currentBlock
//     );

//     // ✅ Normalize event data
//     let events = logs.map((log) => ({
//       course: log.args.course,
//       id: log.args.id.toString(),
//       grade: log.args.grade,
//       txHash: log.transactionHash,
//       block: log.blockNumber,
//     }));

//     // ✅ Apply filters (from URL query)
//     const { id, course, grade } = req.query;

//     if (id) {
//       events = events.filter((e) => e.id === id);
//     }

//     if (course) {
//       events = events.filter(
//         (e) => e.course.toLowerCase() === course.toLowerCase()
//       );
//     }

//     if (grade) {
//       events = events.filter(
//         (e) => e.grade.toLowerCase() === grade.toLowerCase()
//       );
//     }

//     // ✅ Render EJS page
//     res.render("events", {
//       title: "Certificate DApp",
//       events,
//       query: req.query,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// export default router;
import { id, Interface } from "ethers";
import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy"); // remove old one
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: chrome-extension: moz-extension: https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: blob:; connect-src 'self' http://localhost:* ws://localhost:* https:; frame-src 'self' https:;"
  );
  next();
});


router.get("/events", async function (req, res) {
  try {
    const { JsonRpcProvider } = await import("ethers");
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);

    const details = require("../../artifacts/details.json");
    const Cert = require("../../artifacts/contracts/Cert.sol/Cert.json");

    const provider = new JsonRpcProvider(
      "https://ethereum-hoodi-rpc.publicnode.com"
    );

    const iface = new Interface(Cert.abi);

    // ✅ Event signature (must match Solidity exactly)
    const eventTopic = id(
      "Issued(uint256,bytes32,string,string)"
    );

    const { id: idQuery, course } = req.query;

    // ✅ Build topics safely (no invalid null positioning issues)
    const topics = [
      eventTopic,
      idQuery
        ? "0x" + BigInt(idQuery).toString(16).padStart(64, "0")
        : null,
      course ? id(course) : null,
    ];

    const currentBlock = await provider.getBlockNumber();

    const logs = await provider.getLogs({
      address: details.contract,
      fromBlock: Math.max(currentBlock - 1000, 0),
      toBlock: "latest",
      topics,
    });

    const events = logs.map((log) => {
      const parsed = iface.parseLog(log);

      return {
          id: parsed.args[0].toString(),     // uint256
          courseHash: parsed.args[1],        // bytes32
          course: parsed.args[2],            // string ✅
          grade: parsed.args[3],             // string ✅
          txHash: log.transactionHash,
          block: log.blockNumber,
        };
    });

    return res.render("events", {
      title: "Certificate DApp",
      events,
      query: req.query,
    });

  } catch (error) {
    console.log("Event fetch error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/", (req, res) => {
  res.render("index", { title: "Certificate DApp" });
});

router.get("/issue", (req, res) => {
  res.render("issue", { title: "Certificate DApp" });
});

router.get("/fetch", async (req, res) => {
  const { certificateID } = req.query;

  try {
    const instance = (await import("../ethers.js")).default;
    const result = await instance.Certificates(certificateID);

    res.render("view", {
      title: "Certificate DApp",
      id: certificateID,
      name: result[0],
      course: result[1],
      grade: result[2],
      date: result[3],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});
export default router;
