import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Cpu, Play, Square, Settings2, ShieldCheck, Zap } from "lucide-react";

export default function BotCommander() {
  const [botActive, setBotActive] = useState(true);
  const [route, setRoute] = useState<"Direct-NYSE" | "Dark-Pool" | "Institutional">("Direct-NYSE");
  const [profitMargin, setProfitMargin] = useState<number>(1.25);
  const [tradesCount, setTradesCount] = useState<number>(48209);
  const [checksum, setChecksum] = useState<string>("0x8F9A...B2C");

  // Dynamically update metrics based on bot configurations
  const aprMultiplier = route === "Direct-NYSE" ? 1.45 : route === "Institutional" ? 1.25 : 0.95;
  const simulatedApr = (profitMargin * 12.8 * aprMultiplier).toFixed(2);

  useEffect(() => {
    if (!botActive) return;

    // Simulate high frequency trading increment counter
    const counterInterval = setInterval(() => {
      setTradesCount(prev => prev + Math.floor(Math.random() * 3 + 1));
      
      // Update checksum signature periodically to mimic NYSE security validation
      const hex = "0123456789ABCDEF";
      let out = "0x";
      for (let i = 0; i < 4; i++) out += hex[Math.floor(Math.random() * 16)];
      out += "...";
      for (let i = 0; i < 3; i++) out += hex[Math.floor(Math.random() * 16)];
      setChecksum(out);
    }, 4500);

    return () => clearInterval(counterInterval);
  }, [botActive]);

  return (
    <div className="bg-[#0D0D0D] border border-zinc-900 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* Top neon line accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div>
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-mono tracking-[0.25em] text-emerald-400 font-bold uppercase">
              Bot Control Center
            </h3>
          </div>
          
          <span className={`px-2.5 py-1 text-[8px] font-mono font-bold uppercase border rounded-md flex items-center gap-1.5 transition-all ${
            botActive 
              ? "bg-emerald-950/45 text-emerald-400 border-emerald-900/50" 
              : "bg-zinc-950 text-gray-500 border-zinc-900"
          }`}>
            <span className={`w-1 h-1 rounded-full ${botActive ? "bg-emerald-400 animate-ping" : "bg-gray-600"}`} />
            {botActive ? "ACTIVE & MATCHING" : "STANDBY ENGINE"}
          </span>
        </div>

        {/* Master Bot Toggle Controls */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            onClick={() => setBotActive(true)}
            className={`py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 ${
              botActive
                ? "bg-[#0A2F1D]/80 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                : "bg-[#080808] border border-zinc-900 text-gray-400 hover:text-white"
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>START BOT</span>
          </button>
          <button
            onClick={() => setBotActive(false)}
            className={`py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 ${
              !botActive
                ? "bg-[#271515] text-red-400 border border-red-900/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                : "bg-[#080808] border border-zinc-900 text-gray-400 hover:text-white"
            }`}
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP BOT</span>
          </button>
        </div>

        {/* Selected Route Option Buttons */}
        <div className="flex flex-col gap-2 mt-5 text-left">
          <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
            NYSE Execution Routing Path
          </label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {([
              { id: "Direct-NYSE", name: "Wall St. Mainframe" },
              { id: "Dark-Pool", name: "NYSE Dark Pool" },
              { id: "Institutional", name: "Cross Bridge" }
            ] as const).map((r) => (
              <button
                key={r.id}
                onClick={() => setRoute(r.id)}
                className={`py-2 px-1 text-[9px] font-mono tracking-wider text-center border rounded-lg transition-colors ${
                  route === r.id
                    ? "bg-emerald-950/45 border-emerald-900/60 text-emerald-400 font-bold"
                    : "bg-zinc-950 border-zinc-900/80 text-gray-500 hover:text-white"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic target profit slider */}
        <div className="flex flex-col gap-3 mt-5 text-left">
          <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest">
            <span className="text-gray-500">Margin Target Spread</span>
            <span className="text-emerald-400 font-bold">{profitMargin.toFixed(2)}% target</span>
          </div>
          <input
            type="range"
            min="0.25"
            max="5.0"
            step="0.25"
            value={profitMargin}
            onChange={(e) => setProfitMargin(Number(e.target.value))}
            className="w-full accent-emerald-500 bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[8px] font-mono text-gray-600">
            <span>0.25% (Scalp)</span>
            <span>2.5%</span>
            <span>5.0% Max (Institutional Risk)</span>
          </div>
        </div>
      </div>

      {/* METRICS DISCLOSURE BLOCK */}
      <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-4 mt-6 flex flex-col gap-2 text-xs font-mono">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Simulated Bot Yield:</span>
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-extrabold text-sm">{simulatedApr}% APR</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Block Trades Handled:</span>
          <span className="text-gray-300 font-semibold">{tradesCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-b border-zinc-900/50 pb-2">
          <span className="text-gray-500">NYSE Core Validation:</span>
          <span className="text-emerald-400/80 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            SECURED
          </span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-gray-500">Security Checksum:</span>
          <span className="text-gray-400 font-bold uppercase tracking-wider">{checksum}</span>
        </div>
      </div>

    </div>
  );
}
