let contract;
let abi;
let message = ethers.hexlify(
  ethers.toUtf8Bytes(
    "Welcome to Certificate DApp. Kindly sign this message to proceed. This procedure does not require any ETH to process.",
  ),
);

window.onload = async () => {
  const res = await fetch("/api/abi");
  const json = await res.json();
  contract = json.contract;
  abi = json.abi;
  console.log(contract);
};

/* Function to Register */
const register = async () => {
  let accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  let sign = await window.ethereum.request({
    method: "personal_sign",
    params: [message, accounts[0]],
  });

  console.log(sign);
  sessionStorage.setItem("dapp-sign", sign);

  alert("Successfully registered!!");
};

/* Function to Login */
const login = async () => {
  let accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  let sign = await window.ethereum.request({
    method: "personal_sign",
    params: [message, accounts[0]],
  });

  if (sign === sessionStorage.getItem("dapp-sign")) {
    window.location.href = "/issue";
  } else {
    alert("You're not authorized!");
  }
};

/* Function to Issue */
const issueCertificate = async () => {
  let accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  let iface = new ethers.Interface(abi);

  let certificateID = document.getElementById("certificateID").value;
  let candidateName = document.getElementById("candidateName").value;
  let courseName = document.getElementById("courseName").value;
  let grade = document.getElementById("grade").value;
  let date = document.getElementById("date").value;

  let data = await iface.encodeFunctionData("issue", [
    certificateID,
    candidateName,
    courseName,
    grade,
    date,
  ]);

  let trx = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: accounts[0],
        to: contract,
        data: data,
        gas: "0x493E0", 
      },
    ],
  });

  waitForReceipt(trx, certificateID);
};

/* Auxilliary Function to wait for Receipt */
async function waitForReceipt(trx, id) {
  let trxReceipt = null;

  while (!trxReceipt) {
    try {
      trxReceipt = await window.ethereum.request({
        method: "eth_getTransactionReceipt",
        params: [trx],
      });

      if (!trxReceipt) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error fetching transaction receipt:", error);
    }
  }

  console.log("Receipt: ", trxReceipt);
  alert(`Certificate is issued for ${id}!`);
}
