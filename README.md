# CED-DApp-Events

Events example for CED.

## 🛠 Built With

[![Node.js Badge](https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=for-the-badge)](https://nodejs.org/en/)
[![Express Badge](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=for-the-badge)](https://expressjs.com/)
[![EJS Badge](https://img.shields.io/badge/EJS-B4CA65?logo=ejs&logoColor=fff&style=for-the-badge)](https://ejs.co/)
[![Ethers Badge](https://img.shields.io/badge/Ethers-3C3C3D?logo=ethereum&logoColor=fff&style=for-the-badge)](https://docs.ethers.org/v6/)
[![MetaMask Badge](https://img.shields.io/badge/MetaMask-3C3C3D?logo=ethereum&logoColor=fff&style=for-the-badge)](https://metamask.io/)
[![Hardhat Badge](https://img.shields.io/badge/Hardhat-3C3C3D?logo=ethereum&logoColor=fff&style=for-the-badge)](https://hardhat.org/)
[![Solidity Badge](https://img.shields.io/badge/Solidity-363636?logo=solidity&logoColor=fff&style=for-the-badge)](https://soliditylang.org/)

## ⚙️ Run Locally

Clone the project

```bash
git clone https://github.com/Kerala-Blockchain-Academy/ced-dapp-events.git
cd ced-dapp-events
```

Install dependencies

```bash
npm install
```

Create a '.env' and add the following variables

```bash
CHAIN=hoodi
API_KEY=<your-alchemy-api-key>
PRIVATE_KEY=<your-ethereum-private-key>
```

Deploy the contract

```bash
npm run deploy:hoodi
```

Start the application

```bash
npm run dev
```

Start the event listener (new terminal)

```bash
npm run events
```

Open [browser](http://127.0.0.1:8080) for UI
