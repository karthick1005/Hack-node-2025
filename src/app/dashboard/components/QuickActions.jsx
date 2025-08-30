// src/app/dashboard/components/QuickActions.jsx
import React from "react";
import { CreditCard, Eye, Lock, Settings } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      icon: Eye,
      label: "View Details",
      bgColor: "bg-gray-600",
      hoverColor: "hover:bg-gray-700",
    },
    {
      icon: Lock,
      label: "Lock Card",
      bgColor: "bg-gray-600",
      hoverColor: "hover:bg-gray-700",
    },
    {
      icon: Settings,
      label: "Card Settings",
      bgColor: "bg-gray-600",
      hoverColor: "hover:bg-gray-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Make Payment button */}
      <button
        onClick={() => (window.location.href = "/transaction")}
        className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors flex flex-col items-center space-y-2">
        <CreditCard className="h-6 w-6" />
        <span className="text-sm font-medium">Make Payment</span>
      </button>
      {/* Render the rest of the actions */}
      {actions.map((action, index) => (
        <button
          key={index}
          className={`${action.bgColor} ${action.hoverColor} text-white p-4 rounded-lg transition-colors flex flex-col items-center space-y-2`}>
          <action.icon className="h-6 w-6" />
          <span className="text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
