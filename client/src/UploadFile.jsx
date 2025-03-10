import { useState } from "react";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import HashStorage from "../../build/contracts/HashStorage.json";

const contractAddress = "0x26440a6Bec4D945920Cf2E2Dbc4D86a99dd71902"; // Replace this

const ipfs = create({ host: "localhost", port: "5001", protocol: "http" });

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");
    const [ipfsHash, setIpfsHash] = useState("");

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        setStatus("Uploading file to IPFS...");

        try {
            const added = await ipfs.add(selectedFile);
            setIpfsHash(added.path);
            setStatus(`File uploaded to IPFS: ${added.path}`);
            await uploadToBlockchain(added.path);
        } catch (error) {
            console.error("IPFS upload error:", error);
            setStatus("IPFS upload failed.");
        }
    };

    const uploadToBlockchain = async (hash) => {
        try {
            if (!window.ethereum) throw new Error("MetaMask not detected!");

            console.log("Connecting to MetaMask...");
            const provider = new ethers.BrowserProvider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();
            const contract = new ethers.Contract(contractAddress, HashStorage.abi, signer);
            console.log("Storing hash on blockchain...");
            const tx = await contract.add(
                hash,                                         // ✅ IPFS Hash
                ethers.keccak256(ethers.toUtf8Bytes(hash)),  // ✅ File Hash (Keccak256)
                Math.floor(Date.now() / 1000),               // ✅ Convert milliseconds to seconds
                userAddress,                                 // ✅ Recipient (Uploader)
                userAddress                                  // ✅ Authorized (if required)
            );
            await tx.wait();
            console.log("Transaction successful:", tx.hash);
            setStatus("File successfully stored on blockchain!");
        } catch (error) {
        console.error("Blockchain upload failed:", error);
        setStatus("Failed to store file on blockchain.");
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload File to IPFS & Blockchain</h2>
            <input type="file" onChange={handleFileChange} />
            <p>{status}</p>
            {ipfsHash && (
                <p>
                    File stored at:{" "}
                    <a href={`http://localhost:8080/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer">
                        View on IPFS
                    </a>
                </p>
            )}
        </div>
    );
};

export default UploadFile;
