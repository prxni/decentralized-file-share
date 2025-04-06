# IPFS File Sharing System

## Overview
This project is a decentralized file-sharing system built on **IPFS (InterPlanetary File System)** and **Ethereum blockchain**. It allows users to securely upload, share, and retrieve files using **React**, **Ethers.js**, and **MetaMask**.

## Features
- **Decentralized Storage:** Files are stored on IPFS instead of centralized servers.
- **Blockchain Integration:** Uses Ethereum smart contracts to manage file metadata.
- **Secure Transactions:** Users interact with the system via MetaMask for authentication and transactions.
- **User-friendly Interface:** A React-based frontend for smooth interaction.

## Tech Stack
### Frontend
- **React** (UI framework)
- **Tailwind CSS** (Styling)
- **Ethers.js** (Blockchain interactions)

### Backend & Blockchain
- **Solidity** (Smart contracts)
- **Truffle** (Smart contract development framework)
- **Ganache** (Local Ethereum blockchain for testing)
- **MetaMask** (Ethereum wallet integration)

### Storage
- **IPFS (CLI & Daemon)** (Decentralized file storage)

## Installation
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MetaMask](https://metamask.io/)
- [Ganache](https://trufflesuite.com/ganache/)
- [IPFS](https://docs.ipfs.io/install/)
- Truffle (`npm install -g truffle`)

### Setup
1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-username/ipfs-file-sharing.git
   cd ipfs-file-sharing
   ```
2. **Install Dependencies**
   ```sh
   npm install
   ```
3. **Start IPFS Daemon** (Ensure IPFS is installed)
   ```sh
   ipfs daemon
   ```
4. **Deploy Smart Contracts**
   ```sh
   truffle migrate --network development
   ```
5. **Update Contract Address in FileUpload.jsx**
   - After deploying, note the newly generated contract address from the migration output.
   - Open `client/src/FileUpload.jsx` and update the contract address:
     ```javascript
     const contractAddress = "NEW_CONTRACT_ADDRESS_HERE";
     ```
   - Save the file.
6. **Start the Development Server**
   ```sh
   npm run dev
   ```

## Importing Ganache Accounts to MetaMask
1. Open **Ganache** and navigate to the "Accounts" section.
2. Copy the **private key** of any account by clicking on the key icon.
3. Open **MetaMask**, click on the account avatar, and select **Import Account**.
4. Paste the copied **private key** and click **Import**.
5. Your Ganache account should now be available in MetaMask.

## Usage
1. Connect your MetaMask wallet.
2. Upload a file using the UI.
3. Retrieve and share files using IPFS links.
4. Verify transactions on the blockchain.

## Folder Structure
```
├── build/contracts/  # Compiled smart contracts (JSON artifacts)
├── client/           # React frontend
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── contracts/        # Solidity smart contracts
│   ├── HashStorage.sol
│   ├── Migrations.sol
│   ├── Ownable.sol
├── migrations/       # Truffle migrations
│   ├── 1_initial_migration.js
│   ├── 2_hashstorage.js
├── test/             # Smart contract tests
└── README.md         # Project documentation
```

## Contributing
Feel free to fork this repository, make improvements, and submit a pull request.

## License
This project is licensed under the MIT License.

---
### Notes
- Make sure you have Ganache running before deploying contracts.
- Always restart the IPFS daemon before running the project.
