import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomiclabs/hardhat-waffle";
import dotenv from "dotenv";

dotenv.config();

const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;

if (!WALLET_PRIVATE_KEY) {
  throw new Error("Missing WALLET_PRIVATE_KEY environment");
}

if (!BSCSCAN_API_KEY) {
  throw new Error("Missing BSCSCAN_API_KEY environment");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        // Toggles whether the optimizer is on or off.
        // It's good to keep it off for development
        // and turn on for when getting ready to launch.
        enabled: true,
        // The number of runs specifies roughly how often
        // the deployed code will be executed across the
        // life-time of the contract.
        runs: 300,
      },
    },
  },
  networks: {
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [WALLET_PRIVATE_KEY],
    },
    bsc: {
      url: "https://bsc.publicnode.com",
      accounts: [WALLET_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: BSCSCAN_API_KEY,
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
