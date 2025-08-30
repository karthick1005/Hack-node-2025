import React, { useState } from "react";
import { ethers } from "ethers";
import Button from "./Button";

// Replace with your deployed contract ABI
const ESCROW_ABI = [
  "function deposit() external payable",
  "function confirmDelivery() external",
  "function raiseDispute() external",
  "function resolveDispute(bool releaseToSeller) external",
  "function buyer() view returns (address)",
  "function seller() view returns (address)",
  "function arbiter() view returns (address)",
  "function amount() view returns (uint256)",
  "function currentState() view returns (uint8)",
];

const STATE_LABELS = [
  "Awaiting Payment",
  "Awaiting Delivery",
  "Complete",
  "Disputed",
];

export default function EscrowActions({ escrowAddress, userAddress }) {
  const [status, setStatus] = useState("");
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch contract state
  const fetchState = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(escrowAddress, ESCROW_ABI, provider);
      const currentState = await contract.currentState();
      const amt = await contract.amount();
      setState(Number(currentState));
      setAmount(ethers.utils.formatEther(amt));
    } catch (e) {
      setError("Failed to fetch contract state");
    } finally {
      setLoading(false);
    }
  };

  // Deposit funds (buyer)
  const handleDeposit = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(escrowAddress, ESCROW_ABI, signer);
      const tx = await contract.deposit({
        value: ethers.utils.parseEther(amount),
      });
      await tx.wait();
      setStatus("Deposit successful");
      fetchState();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Confirm delivery (buyer)
  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(escrowAddress, ESCROW_ABI, signer);
      const tx = await contract.confirmDelivery();
      await tx.wait();
      setStatus("Delivery confirmed, funds released");
      fetchState();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Raise dispute (buyer or seller)
  const handleDispute = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(escrowAddress, ESCROW_ABI, signer);
      const tx = await contract.raiseDispute();
      await tx.wait();
      setStatus("Dispute raised");
      fetchState();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Resolve dispute (arbiter)
  const handleResolve = async (releaseToSeller) => {
    setLoading(true);
    setError("");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(escrowAddress, ESCROW_ABI, signer);
      const tx = await contract.resolveDispute(releaseToSeller);
      await tx.wait();
      setStatus("Dispute resolved");
      fetchState();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (escrowAddress) fetchState();
  }, [escrowAddress]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto mt-8 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Escrow Actions</h2>
      {escrowAddress ? (
        <>
          <div className="mb-4 flex flex-col gap-1">
            <span className="text-gray-700 font-medium">
              Contract:{" "}
              <span className="font-mono text-xs break-all">
                {escrowAddress}
              </span>
            </span>
            <span className="text-gray-700">
              State:{" "}
              <span className="font-semibold">
                {state !== null ? STATE_LABELS[state] : "-"}
              </span>
            </span>
            <span className="text-gray-700">
              Amount: <span className="font-semibold">{amount} BDAG</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              onClick={handleDeposit}
              disabled={loading || state !== 0}
              variant="primary">
              Deposit
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading || state !== 1}
              variant="success">
              Confirm Delivery
            </Button>
            <Button
              onClick={handleDispute}
              disabled={loading || state !== 1}
              variant="warning">
              Raise Dispute
            </Button>
            <Button
              onClick={() => handleResolve(true)}
              disabled={loading || state !== 3}
              variant="success">
              Release to Seller
            </Button>
            <Button
              onClick={() => handleResolve(false)}
              disabled={loading || state !== 3}
              variant="danger">
              Refund Buyer
            </Button>
          </div>
          {status && <div className="text-green-700 mb-2">{status}</div>}
          {error && <div className="text-red-600 mb-2">{error}</div>}
        </>
      ) : (
        <div className="text-gray-500">
          No escrow contract address provided.
        </div>
      )}
    </div>
  );
}
