import { useState } from 'react';
import { connectWallet, sendTransaction } from '../lib/ethereum';

export const useEthereumTransaction = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const connectToWallet = async () => {
        setIsLoading(true);
        try {
            const address = await connectWallet();
            setWalletAddress(address);
        } finally {
            setIsLoading(false);
        }
    };

    const sendEther = async (recipientAddress, amount) => {
        setIsLoading(true);
        setTransactionStatus(null);

        try {
            const result = await sendTransaction(recipientAddress, amount);
            setTransactionStatus(result);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        walletAddress,
        transactionStatus,
        isLoading,
        connectToWallet,
        sendEther,
    };
};
