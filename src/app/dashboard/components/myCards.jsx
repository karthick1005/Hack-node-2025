import React from "react";
import { Calendar, ArrowUpRight, Wallet, CreditCard } from "lucide-react";
import Card from "./Card";
import Button from "./Button";

const UnifiedCard = ({
  type,
  name,
  number,
  balance,
  limit,
  expires,
  lastUsed,
  status,
  icon: Icon,
  bgColor = "from-blue-500 via-blue-600 to-blue-700", // Changed to ensure blue gradient
  textColor = "text-white",
  iconBg,
  iconColor,
  usageCount,
  locations,
  onDetailsClick,
  onMenuClick,
}) => {
  // Check if it's a payment card (has card number)
  const isPaymentCard = !!number;

  // Calculate usage percentage for payment cards
  const usagePercentage = limit ? Math.min((balance / limit) * 100, 100) : 0;

  // Format currency with clean formatting
  const formatAmount = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount?.toLocaleString("en-IN") || "0"}`;
  };

  // Get one of three gradient colors based on card data
  const getCardGradient = () => {
    const gradients = [
      "from-purple-500 via-purple-600 to-indigo-700", // Purple gradient like first card
      "from-gray-800 via-gray-900 to-black", // Dark gradient like second card
      "from-teal-400 via-blue-500 to-blue-600", // Teal-blue gradient like third card
    ];

    // Use card name or number to determine gradient consistently
    const seed = (name || number || "").length;
    return gradients[seed % 3];
  };

  return (
    <div className="w-full">
      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl  ">
        {/* Single gradient background - one of three colors */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getCardGradient()}`}
        >
          {/* Subtle overlay patterns for depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 " />
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full translate-y-16 -translate-x-16" />

          {/* Card texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.3)_1px,_transparent_0)] bg-[length:24px_24px]" />
        </div>

        <div className="relative h-full p-4 flex flex-col justify-between text-white">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {/* Payment card chip OR service icon */}
              {isPaymentCard ? (
                <div className="w-8 h-5 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded shadow-sm border border-yellow-500/20">
                  <div className="w-full h-full bg-gradient-to-tr from-yellow-300/60 to-transparent rounded grid grid-cols-3 gap-px p-0.5">
                    <div className="bg-yellow-400/40 rounded-sm"></div>
                    <div className="bg-yellow-400/40 rounded-sm"></div>
                    <div className="bg-yellow-400/40 rounded-sm"></div>
                    <div className="bg-yellow-400/40 rounded-sm"></div>
                    <div className="bg-yellow-400/40 rounded-sm"></div>
                    <div className="bg-yellow-400/40 rounded-sm"></div>
                  </div>
                </div>
              ) : (
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    iconBg || "bg-white/20"
                  }`}
                >
                  {Icon && (
                    <Icon className={`w-4 h-4 ${iconColor || "text-white"}`} />
                  )}
                </div>
              )}

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-semibold text-white tracking-wide">
                    {name}
                  </h3>
                  {status && (
                    <div className="w-1 h-1 rounded-full bg-blue-300" />
                  )}
                </div>
                <p className="text-[10px] text-white/80 font-medium uppercase tracking-wider">
                  {type}
                </p>
              </div>
            </div>

            {/* VISA logo for payment cards OR menu for service cards */}
            <div className="flex items-center">
              {isPaymentCard ? (
                <div className="text-right">
                  <div className="text-white/90 font-bold text-sm tracking-wider font-serif">
                    VISA
                  </div>
                  {Icon && (
                    <Icon className="w-3 h-3 text-white/70 ml-auto mt-0.5" />
                  )}
                </div>
              ) : (
                onMenuClick && (
                  <button
                    onClick={onMenuClick}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                  >
                    <div className="w-1 h-1 bg-white/70 rounded-full mb-0.5"></div>
                    <div className="w-1 h-1 bg-white/70 rounded-full mb-0.5"></div>
                    <div className="w-1 h-1 bg-white/70 rounded-full"></div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Card number section for payment cards OR usage info for service cards */}
          <div className="flex items-center justify-center my-2">
            {isPaymentCard ? (
              <p className="text-sm font-mono tracking-[0.3em] text-gray-300 font-medium">
                •••• •••• •••• {number}
              </p>
            ) : (
              <div className="text-center">
                {usageCount && (
                  <p className="text-xs text-white/70 mb-1">
                    Used {usageCount} times
                  </p>
                )}
                {locations && locations.length > 0 && (
                  <p className="text-xs text-white/80">
                    Last: {locations[locations.length - 1]}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Balance and limit section */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-white/70 uppercase tracking-wider font-medium mb-0.5">
                  {isPaymentCard ? "Available Balance" : "Balance"}
                </p>
                <p className="text-base font-bold text-white tracking-tight">
                  {formatAmount(balance)}
                </p>
              </div>

              {limit && isPaymentCard && (
                <div className="text-right">
                  <p className="text-[10px] text-white/70 uppercase tracking-wider font-medium mb-0.5">
                    Credit Limit
                  </p>
                  <p className="text-sm font-semibold text-white/95">
                    {formatAmount(limit)}
                  </p>
                </div>
              )}
            </div>

            {/* Usage bar for payment cards with limits */}
            {limit && isPaymentCard && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/70 font-medium">
                    Usage
                  </span>
                  <span className="text-[10px] text-white/90 font-semibold">
                    {usagePercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 transition-all duration-700 rounded-full"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer with cardholder info OR service info */}
          <div className="flex items-end justify-between pt-2">
            <div className="flex items-end gap-4">
              {isPaymentCard ? (
                <>
                  {expires && (
                    <div className="text-left">
                      <p className="text-[9px] text-white/60 uppercase tracking-wider font-medium">
                        Valid Thru
                      </p>
                      <p className="text-xs text-white/95 font-medium font-mono">
                        {expires}
                      </p>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-[9px] text-white/60 uppercase tracking-wider font-medium">
                      Cardholder
                    </p>
                    <p className="text-xs text-white/95 font-medium">
                      A. CITIZEN
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-left">
                  <p className="text-[9px] text-white/60 uppercase tracking-wider font-medium">
                    Status
                  </p>
                  <p className="text-xs text-white/95 font-medium capitalize">
                    {status || "Active"}
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={onDetailsClick}
              className="group/btn bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 border border-white/30 cursor-pointer hover:border-white/50"
            >
              <span className="flex items-center gap-1">
                Details
                <ArrowUpRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </span>
            </Button>
          </div>

          {/* Last used info at the very bottom */}
          {lastUsed && (
            <div className="pt-1">
              <p className="text-[9px] text-white/60">Last used {lastUsed}</p>
            </div>
          )}
        </div>

        {/* Holographic shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
      </Card>
    </div>
  );
};

export default UnifiedCard;
