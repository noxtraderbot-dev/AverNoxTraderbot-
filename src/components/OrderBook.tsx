import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

interface OrderBookProps {
  assetPrice: number;
  symbol: string;
}

interface BookRow {
  price: number;
  amount: number;
  total: number;
  flash: boolean;
}

export default function OrderBook({ assetPrice, symbol }: OrderBookProps) {
  const [asks, setAsks] = useState<BookRow[]>([]);
  const [bids, setBids] = useState<BookRow[]>([]);

  // Initialize and simulate dynamic order book depth changes
  useEffect(() => {
    const generateInitialData = () => {
      const generatedAsks: BookRow[] = [];
      const generatedBids: BookRow[] = [];

      // Generate asks starting slightly above the current asset price
      for (let i = 4; i >= 1; i--) {
        const p = assetPrice * (1 + (i * 0.0006));
        const a = Math.random() * 2.5 + 0.1;
        generatedAsks.push({
          price: Number(p.toFixed(2)),
          amount: Number(a.toFixed(3)),
          total: Number((p * a).toFixed(2)),
          flash: false,
        });
      }

      // Generate bids starting slightly below the current asset price
      for (let i = 1; i <= 4; i++) {
        const p = assetPrice * (1 - (i * 0.0006));
        const a = Math.random() * 2.5 + 0.1;
        generatedBids.push({
          price: Number(p.toFixed(2)),
          amount: Number(a.toFixed(3)),
          total: Number((p * a).toFixed(2)),
          flash: false,
        });
      }

      setAsks(generatedAsks);
      setBids(generatedBids);
    };

    generateInitialData();
  }, [assetPrice]);

  // Minor fluctuations to simulate high-frequency trading
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick random ask and bid to modify slightly
      setAsks((prevAsks) =>
        prevAsks.map((row, idx) => {
          if (idx === Math.floor(Math.random() * prevAsks.length)) {
            const nextAmount = Math.max(0.01, row.amount + (Math.random() - 0.5) * 0.15);
            return {
              ...row,
              amount: Number(nextAmount.toFixed(3)),
              total: Number((row.price * nextAmount).toFixed(2)),
              flash: true,
            };
          }
          return { ...row, flash: false };
        })
      );

      setBids((prevBids) =>
        prevBids.map((row, idx) => {
          if (idx === Math.floor(Math.random() * prevBids.length)) {
            const nextAmount = Math.max(0.01, row.amount + (Math.random() - 0.5) * 0.15);
            return {
              ...row,
              amount: Number(nextAmount.toFixed(3)),
              total: Number((row.price * nextAmount).toFixed(2)),
              flash: true,
            };
          }
          return { ...row, flash: false };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const spread = asks.length > 0 && bids.length > 0 ? asks[asks.length - 1].price - bids[0].price : 0;
  const spreadPercent = bids.length > 0 ? (spread / bids[0].price) * 100 : 0;

  return (
    <div className="bg-[#0D0D0D] border border-zinc-900 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-full shadow-[0_0_50px_rgba(0,0,0,0.8)] font-mono text-[10px] sm:text-[11px] text-gray-400">
      
      {/* Top ambient highlight line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />

      {/* Title */}
      <div className="flex justify-between items-center pb-3 border-b border-zinc-900/80 mb-3">
        <span className="font-mono text-[10px] tracking-[0.25em] text-emerald-400 font-bold uppercase">
          Consolidated Order Book
        </span>
        <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-bold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>MATCHING STREAM</span>
        </div>
      </div>

      {/* Grid columns Header */}
      <div className="grid grid-cols-3 text-left py-1 text-gray-500 uppercase tracking-wider text-[9px]">
        <span>Price (USD)</span>
        <span className="text-right">Size ({symbol})</span>
        <span className="text-right">Aggregate (USD)</span>
      </div>

      {/* ASKS (SELLS) - RED LINES */}
      <div className="flex flex-col gap-1 py-1.5 border-b border-zinc-900/40">
        {asks.map((ask, idx) => (
          <div 
            key={idx}
            className={`grid grid-cols-3 text-left py-0.5 relative transition-colors duration-200 ${
              ask.flash ? "bg-red-500/10 text-red-300" : "hover:bg-zinc-950/40"
            }`}
          >
            {/* Visual depth bar in background */}
            <div 
              className="absolute right-0 top-0 bottom-0 bg-red-950/10 pointer-events-none" 
              style={{ width: `${Math.min(100, (ask.amount / 3) * 100)}%` }}
            />
            <span className="text-red-400 font-semibold">{ask.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="text-right z-10 text-gray-300 font-medium">{ask.amount.toFixed(3)}</span>
            <span className="text-right z-10 text-gray-500">${ask.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        ))}
      </div>

      {/* SPREAD INDICATOR ROW */}
      <div className="bg-zinc-950/70 py-2 px-3 border border-zinc-900/60 rounded-lg my-2.5 flex justify-between items-center text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 uppercase tracking-widest text-[8px]">SPREAD:</span>
          <span className="text-white font-bold">${spread.toFixed(2)}</span>
        </div>
        <div className="text-gray-500 text-[9px]">
          ({spreadPercent.toFixed(4)}%)
        </div>
      </div>

      {/* BIDS (BUYS) - GREEN LINES */}
      <div className="flex flex-col gap-1 py-1.5 border-t border-zinc-900/40">
        {bids.map((bid, idx) => (
          <div 
            key={idx}
            className={`grid grid-cols-3 text-left py-0.5 relative transition-colors duration-200 ${
              bid.flash ? "bg-emerald-500/10 text-emerald-300" : "hover:bg-zinc-950/40"
            }`}
          >
            {/* Visual depth bar in background */}
            <div 
              className="absolute right-0 top-0 bottom-0 bg-emerald-950/10 pointer-events-none" 
              style={{ width: `${Math.min(100, (bid.amount / 3) * 100)}%` }}
            />
            <span className="text-emerald-400 font-semibold">{bid.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="text-right z-10 text-gray-300 font-medium">{bid.amount.toFixed(3)}</span>
            <span className="text-right z-10 text-gray-500">${bid.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
