import { useState, useEffect  } from "react";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import HashStorage from "../../build/contracts/HashStorage.json";

const contractAddress = "0x26440a6Bec4D945920Cf2E2Dbc4D86a99dd71902"; // Replace this

const ipfs = create({ host: "localhost", port: "5001", protocol: "http" });

const UploadFile = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");
    const [ipfsHash, setIpfsHash] = useState("");

    // Simulated upload progress
    useEffect(() => {
        if (isUploading) {
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
            if (prev >= 100) {
                setIsUploading(false);
                clearInterval(interval);
                return 100;
            }
            return prev + 5;
            });
        }, 200);

        return () => clearInterval(interval);
        }
    }, [isUploading]);

    const handleAddressChange = (e) => {
        setWalletAddress(e.target.value);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setIsUploading(true);
        setUploadProgress(0);

        const droppedFile = e.dataTransfer.files[0];
        if (!droppedFile) return;
        setFile(droppedFile);
        setStatus("Uploading file to IPFS...");

        try {
        const added = await ipfs.add(droppedFile);
        setIpfsHash(added.path);
        setStatus(`File uploaded to IPFS: ${added.path}`);
        await uploadToBlockchain(added.path);
        } catch (error) {
        console.error("IPFS upload error:", error);
        setStatus("IPFS upload failed.");
        }
    };

    const handleUploadClick = () => {
        setIsUploading(true);
        setUploadProgress(0);
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.onchange = async (e) => {
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
        fileInput.click();
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

    const appStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#3498db",
        backgroundImage: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
        fontFamily: '"Poppins", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        padding: "20px",
        transition: "all 0.3s ease",
        margin: 0,
        border: "none",
        outline: "none",
    };

    const headerStyle = {
        fontSize: "2.5rem",
        color: "#ffffff",
        marginBottom: "30px",
        textAlign: "center",
        fontWeight: "600",
        textShadow: "0 2px 5px rgba(0,0,0,0.2)",
        letterSpacing: "0.5px",
    };

    const buttonBarStyle = {
        display: "flex",
        marginBottom: "25px",
        gap: "15px",
    };

    const buttonStyle = {
        backgroundColor: "rgba(41, 128, 185, 0.8)",
        color: "#ffffff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontWeight: "500",
    };

    const buttonHoverStyle = {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
        backgroundColor: "rgba(41, 128, 185, 1)",
    };

    const cardStyle = {
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
        width: "100%",
        maxWidth: "800px",
        textAlign: "center",
        transition: "all 0.3s ease",
        border: "none",
    };

    const inputContainerStyle = {
        position: "relative",
        marginBottom: "25px",
    };

    const inputStyle = {
        width: "100%",
        padding: "12px 15px",
        border: "1px solid #e1e1e1",
        borderRadius: "6px",
        fontSize: "1rem",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        fontFamily: "inherit",
    };

    const inputFocusStyle = {
        borderColor: "#3498db",
        boxShadow: "0 2px 10px rgba(52, 152, 219, 0.2)",
        outline: "none",
    };

    const sectionTitleStyle = {
        color: "#3498db",
        fontSize: "1.8rem",
        margin: "10px 0 25px",
        fontWeight: "600",
        position: "relative",
        display: "inline-block",
    };

    const sectionTitleAfterStyle = {
        content: '""',
        position: "absolute",
        bottom: "-8px",
        left: "50%",
        width: "50px",
        height: "3px",
        backgroundColor: "#3498db",
        transform: "translateX(-50%)",
        borderRadius: "2px",
    };

    const uploadAreaStyle = {
        border: isDragging ? "2px solid #8fe5d9" : "2px dashed #8fe5d9",
        borderRadius: "8px",
        padding: "40px",
        marginTop: "15px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDragging ? "rgba(143, 229, 217, 0.1)" : "transparent",
        transition: "all 0.2s ease",
        cursor: "pointer",
    };

    const fileIconStyle = {
        width: "70px",
        height: "70px",
        marginBottom: "15px",
        color: "#8fe5d9",
        transition: "all 0.3s ease",
        transform: isDragging ? "scale(1.1)" : "scale(1)",
    };

    const hintTextStyle = {
        color: "#888",
        marginTop: "10px",
        fontSize: "0.9rem",
    };

    const progressContainerStyle = {
        width: "100%",
        height: "10px",
        backgroundColor: "#e0e0e0",
        borderRadius: "5px",
        margin: "20px 0",
        overflow: "hidden",
        display: isUploading ? "block" : "none",
        border: "none",
    };

    const progressBarStyle = {
        height: "100%",
        width: `${uploadProgress}%`,
        backgroundColor: "#4caf50",
        borderRadius: "5px",
        transition: "width 0.2s ease",
        border: "none",
    };

    const progressTextStyle = {
        color: "#4caf50",
        fontWeight: "600",
        display: isUploading ? "block" : "none",
    };

    const statusTextStyle = {
        color: "#3498db",
        marginTop: "10px",
        fontSize: "0.9rem",
    };

    const ipfsLinkStyle = {
        color: "#3498db",
        textDecoration: "none",
        fontWeight: "500",
    };

    // Remove outline and border from the whole document
    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";

        return () => {
        document.body.style.margin = "";
        document.body.style.padding = "";
        document.body.style.overflow = "";
        };
    }, []);

    return (
        <div style={appStyle}>
        <h1 style={headerStyle}>Secure File Sharing Over Blockchain</h1>

        <div style={buttonBarStyle}>
            <button
            style={{ ...buttonStyle, ":hover": buttonHoverStyle }}
            onMouseOver={(e) =>
                Object.assign(e.currentTarget.style, buttonHoverStyle)
            }
            onMouseOut={(e) => {
                for (const key in buttonHoverStyle) {
                e.currentTarget.style[key] = buttonStyle[key] || "";
                }
            }}
            >
            <span>⬆️</span> Upload
            </button>
            <button
            style={{ ...buttonStyle, ":hover": buttonHoverStyle }}
            onMouseOver={(e) =>
                Object.assign(e.currentTarget.style, buttonHoverStyle)
            }
            onMouseOut={(e) => {
                for (const key in buttonHoverStyle) {
                e.currentTarget.style[key] = buttonStyle[key] || "";
                }
            }}
            >
            <span>🔍</span> Search
            </button>
        </div>

        <div style={cardStyle}>
            <div style={inputContainerStyle}>
            <input
                type="text"
                placeholder="Provide Address"
                value={walletAddress}
                onChange={handleAddressChange}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => {
                for (const key in inputFocusStyle) {
                    e.target.style[key] = inputStyle[key] || "";
                }
                }}
            />
            </div>

            <div>
            <h2 style={sectionTitleStyle}>
                File Upload
                <div style={sectionTitleAfterStyle}></div>
            </h2>

            <div
                style={uploadAreaStyle}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
            >
                {ipfsHash ? (
                <>
                    <svg
                    style={fileIconStyle}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M14 2V8H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                    <p style={{ fontWeight: "500", color: "#555" }}>
                    File Uploaded Successfully!
                    </p>
                    <p style={statusTextStyle}>
                    IPFS Hash:{" "}
                    <a
                        href={`http://localhost:8080/ipfs/${ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={ipfsLinkStyle}
                    >
                        {ipfsHash}
                    </a>
                    </p>
                </>
                ) : (
                <>
                    <svg
                    style={fileIconStyle}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M14 2V8H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {!isUploading && (
                        <path
                        d="M12 18V12M12 12L9 15M12 12L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />
                    )}
                    </svg>

                    <p style={{ fontWeight: "500", color: "#555" }}>
                    {isUploading ? "Uploading..." : "Click here or drag files"}
                    </p>
                </>
                )}

                <div style={progressContainerStyle}>
                <div style={progressBarStyle}></div>
                </div>

                <p style={progressTextStyle}>{uploadProgress}% Uploaded</p>

                {!isUploading && !ipfsHash && (
                <p style={hintTextStyle}>
                    Supported formats: PDF, DOCX, JPG, PNG
                </p>
                )}
            </div>

            {/* Status Messages */}
            <p style={statusTextStyle}>{status}</p>
            </div>
        </div>
        </div>
    );
};

export default UploadFile;
