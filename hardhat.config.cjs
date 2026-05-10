require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "hoodi",
  networks: {
    local: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
     hoodi: {
      url: `https://eth-hoodi.g.alchemy.com/v2/UiCANatOqd8nWW5f791tf`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
