"use client";
// components/singleCardDetails.jsx
import React from "react";
import { MoreHorizontal } from "lucide-react";
import Card from "./Card";
import Button from "./Button";
import Badge from "./Badge";
import { useRouter } from "next/navigation";

const SingleCardDetails = ({
  name,
  type,
  points,
  nextReward,
  balance,
  expires,
  status,
  lastUsed,
  icon: Icon,
  bgColor = "bg-green-50",
  iconColor = "text-green-600",
  onDetailsClick,
  onMenuClick,
}) => {
  const router = useRouter();

  const handleMakePayment = () => {
    try {
      router.push("/transaction");
      console.log("Navigating to transaction page");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{type}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onMenuClick}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 mb-3">
        {points && (
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Points</span>
            <span className="font-semibold text-gray-900">{points}</span>
          </div>
        )}
        {nextReward && (
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Next Reward</span>
            <span className="font-semibold text-gray-900">{nextReward}</span>
          </div>
        )}
        {balance && (
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Balance</span>
            <span className="font-semibold text-gray-900">₹{balance}</span>
          </div>
        )}
        {status && (
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Status</span>
            <Badge variant="success">{status}</Badge>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        {expires && <span>Expires: {expires}</span>}
        <Button variant="ghost" size="sm" onClick={onDetailsClick}>
          Details
        </Button>
      </div>

      {lastUsed && (
        <p className="text-xs text-gray-500 mt-2">Last used: {lastUsed}</p>
      )}

      <div className="mt-4">
        <button
          onClick={() => router.push("/transaction")}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
          Make Payment
        </button>
      </div>
    </Card>
  );
};

export default SingleCardDetails;
