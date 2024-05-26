# Voting App Smart Contract

This repository contains the smart contract for a decentralized voting application, built using Hardhat. The contract is written in Solidity and deployed on various Ethereum testnets.

## Features

- **Decentralized Voting**: Secure and transparent voting process managed on the blockchain.
- **Multiple Network Deployment**: Deploy the contract on different testnets including BSC Testnet.

## Prerequisites

- Node.js (v14 or above)
- npm or yarn
- Hardhat

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/VTAkbay/voting-hardhat.git
   cd voting-hardhat
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file based on `.env.example` and update the environment variables as needed.

## Deployment

### Deploy to BSC Testnet

1. Ensure your `.env` file contains the correct BSC Testnet settings.
2. Deploy the contract:
   ```bash
   npm run deploy:bsctestnet
   ```

## Testing

Run the tests using Hardhat:

```bash
npm test
```

## Acknowledgements

- [Hardhat](https://hardhat.org/)
- [Solidity](https://soliditylang.org/)
- [Ethereum](https://ethereum.org/)
- [Chai](https://www.chaijs.com/)

## License

This project is licensed under the MIT License.

## Contact

For any questions or suggestions, feel free to open an issue or contact the project maintainer.
