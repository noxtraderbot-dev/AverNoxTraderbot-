import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DollarSign, ShieldAlert, CheckCircle2, TrendingUp, Info } from "lucide-react";

interface OrderTerminalProps {
  asset: {
    symbol: string;
    name: string;
    price: number;
    change: number;
  };
  onExecuteTrade: (tradeText: string) => void;
}

export default function OrderTerminal({ asset, onExecuteTrade }: OrderTerminalProps) {
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState<string>("0.5");
  const [leverage, setLeverage] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const [lastExecuted, setLastExecuted] = useState<any>(null);

  // Math constants for calculation
  const calculatedTotal = Number(amount) ? Number(amount) * asset.price : 0;
  const marginRequired = calculatedTotal / leverage;
  const nyseClearingFee = calculatedTotal * 0.0002; // 0.02% institutional rate
  const dynamicTotal = marginRequired + nyseClearingFee;

  const handleExecute = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    setIsSubmitting(true);
    
    // Simulate high-speed NYSE gateway matchmaking latency
    setTimeout(() => {
      setIsSubmitting(false);
      setTradeSuccess(true);
      
      const executedDetails = {
        type: orderType,
        symbol: asset.symbol,
        amount: Number(amount),
        price: asset.price,
        total: calculatedTotal.toFixed(2),
        fee: nyseClearingFee.toFixed(2),
        margin: marginRequired.toFixed(2),
        leverage: leverage,
        time: new Date().toTimeString().split(" ")[0]
      };

      setLastExecuted(executedDetails);

      // Trigger callback to push event into the live terminal activity tracker
      onExecuteTrade(
        `[NYSE Matcher] ${orderType} ORDER FILLED: Successfully executed block trade of ${amount} ${asset.symbol} at $${asset.price.toLocaleString()} via NYSE dark pool (Leverage ${leverage}x).`
      );

    }, 1200);
  };

  const resetTerminal = () => {
    setTradeSuccess(false);
    setLastExecuted(null);
  };

  return (
    <div className="bg-[#0D0D0D] border border-zinc-900 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* Glow highlight strip */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <AnimatePresence mode="wait">
        {!tradeSuccess ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-5 h-full justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                <h3 className="text-sm font-mono tracking-[0.25em] text-emerald-400 font-bold uppercase">
                  Institutional Order Entry
                </h3>
                <span className="text-[9px] font-mono text-gray-500 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-900">
                  ROUTE: DARK POOL #12
                </span>
              </div>

              {/* Order Type Toggle buttons (Buy / Sell) */}
              <div className="grid grid-cols-2 gap-2 mt-5">
                <button
                  onClick={() => setOrderType("BUY")}
                  className={`py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest transition-all ${
                    orderType === "BUY"
                      ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      : "bg-[#080808] border border-zinc-900 text-gray-400 hover:text-white"
                  }`}
                >
                  BUY / LONG
                </button>
                <button
                  onClick={() => setOrderType("SELL")}
                  className={`py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest transition-all ${
                    orderType === "SELL"
                      ? "bg-red-500 text-black shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                      : "bg-[#080808] border border-zinc-900 text-gray-400 hover:text-white"
                  }`}
                >
                  SELL / SHORT
                </button>
              </div>

              {/* Amount Inputs */}
              <div className="flex flex-col gap-2 mt-5 text-left">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  Transaction Amount ({asset.symbol})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#080808] border border-zinc-900 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm font-mono font-bold text-white tracking-wide focus:outline-none focus:ring-0 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-400 font-bold">
                    {asset.symbol}
                  </span>
                </div>
              </div>

              {/* Institutional Leverage Slider */}
              <div className="flex flex-col gap-3 mt-5 text-left">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                  <span className="text-gray-500">Margin Leverage</span>
                  <span className="text-emerald-400 font-bold">{leverage}x Leverage</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-gray-600">
                  <span>1x (Spot)</span>
                  <span>5x</span>
                  <span>10x Max (Institutional Only)</span>
                </div>
              </div>

              {/* NYSE Transaction Fee Matrix */}
              <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-4 mt-6 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nominal Block Value:</span>
                  <span className="text-gray-300 font-semibold">${calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Collateral Required:</span>
                  <span className="text-gray-300 font-semibold">${marginRequired.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/50 pb-2">
                  <span className="text-gray-500 flex items-center gap-1">
                    NYSE Clearing Fee:
                    <Info className="w-3 h-3 text-gray-500 hover:text-white cursor-help" />
                  </span>
                  <span className="text-emerald-400 font-bold">${nyseClearingFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-400 font-bold">Total Custody Lock:</span>
                  <span className="text-white font-bold">${dynamicTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={isSubmitting || !amount}
              className={`w-full py-4 mt-6 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-zinc-900 text-gray-500 cursor-not-allowed border border-zinc-800"
                  : orderType === "BUY"
                  ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                  : "bg-red-500 hover:bg-red-400 text-black shadow-[0_0_30px_rgba(239,68,68,0.15)]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                  <span>AUTHORIZING TRADING LINK...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>EXECUTE {orderType} ORDER</span>
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success-receipt"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center text-center gap-5 py-6 h-full"
          >
            <div className="p-4 rounded-full bg-emerald-950/30 border border-emerald-900/60 text-emerald-400 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <h4 className="text-lg font-display font-bold text-white">Order Successfully Cleared</h4>
              <p className="text-[10px] font-mono text-emerald-400 mt-1 uppercase tracking-widest">
                NYSE Execution ID: #TX-{Math.floor(Math.random() * 89999 + 10000)}
              </p>
            </div>

            {/* Receipt Table */}
            <div className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-left font-mono text-[11px] flex flex-col gap-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Action Path:</span>
                <span className={lastExecuted?.type === "BUY" ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                  {lastExecuted?.type} / LONG
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Asset Token:</span>
                <span className="text-white">{lastExecuted?.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Clearing Price:</span>
                <span className="text-white">${lastExecuted?.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-900/50 pt-2 mt-1">
                <span className="text-gray-400">Total Cleared Value:</span>
                <span className="text-emerald-400 font-bold">${lastExecuted?.total} USD</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full mt-4">
              <button
                onClick={resetTerminal}
                className="w-full py-3 bg-[#080808] hover:bg-zinc-900 text-gray-300 font-mono text-[10px] tracking-widest uppercase rounded-xl border border-zinc-800 transition-colors"
              >
                Launch New Order
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
