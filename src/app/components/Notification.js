"use client"
import { useState, useEffect } from 'react';

export default function Notification({ type, message, isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000); // Auto close after 5 seconds

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className={`
                max-w-sm w-full mx-4 p-6 rounded-lg shadow-xl 
                ${type === 'success' ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}
            `}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {type === 'success' ? (
                            <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <h3 className={`text-lg font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                            {type === 'success' ? 'Success!' : 'Error!'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className={`mt-2 ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                    {message}
                </p>
            </div>
        </div>
    );
}
