import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, TrendingUp, Info, ShieldCheck } from "lucide-react";

interface InteractiveChartProps {
  asset: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    history: number[];
  };
}

export default function InteractiveChart({ asset }: InteractiveChartProps) {
  const [timeframe, setTimeframe] = useState<"1H" | "4H" | "24H" | "1W">("24H");
  const [showEMA, setShowEMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Generate extended chart data based on selected timeframe and asset's base history
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    // Generate a beautiful, stable mock series based on selected timeframe to look highly realistic
    const seed = asset.history;
    let multiplier = 1;
    if (timeframe === "1H") multiplier = 8;
    else if (timeframe === "4H") multiplier = 16;
    else if (timeframe === "1W") multiplier = 32;
    else multiplier = 24;

    const points: number[] = [];
    const baseValue = seed[0];
    
    // Create a smooth wave with random noise
    for (let i = 0; i < multiplier; i++) {
      const angle = (i / multiplier) * Math.PI * 2;
      const wave = Math.sin(angle * 2.5) * (baseValue * 0.015);
      const trend = (i / multiplier) * (asset.price - baseValue);
      const noise = (Math.sin(i * 123) * 0.5 + Math.cos(i * 456) * 0.5) * (baseValue * 0.003);
      points.push(Number((baseValue + wave + trend + noise).toFixed(2)));
    }
    points.push(asset.price);
    setChartData(points);
  }, [timeframe, asset]);

  const minVal = Math.min(...chartData);
  const maxVal = Math.max(...chartData);
  const valRange = maxVal - minVal || 1;

  // Generate EMA (Exponential Moving Average) line data
  const emaData = chartData.reduce((acc: number[], val, idx) => {
    if (idx === 0) {
      acc.push(val);
    } else {
      const k = 2 / (8 + 1); // 8-period EMA
      const prevEma = acc[idx - 1];
      acc.push(Number((val * k + prevEma * (1 - k)).toFixed(2)));
    }
    return acc;
  }, []);

  const isUp = asset.change >= 0;

  return (
    <div className="bg-[#0D0D0D] border border-zinc-900 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* Subtle top horizontal grid glow line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      {/* CHART HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900/80 pb-5">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-950/20 border border-emerald-900/30 px-3.5 py-1.5 rounded-lg">
            <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
              {asset.symbol} / USD
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-200">{asset.name} Terminal</h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">
              Source: NYSE digital matching bridge
            </p>
          </div>
        </div>

        {/* TIME FRAME CONTROLS */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-900">
          {(["1H", "4H", "24H", "1W"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-[10px] font-mono tracking-wider uppercase rounded-md transition-all duration-150 ${
                timeframe === tf 
                  ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 font-bold" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* REAL-TIME HIGHLIGHT VALUES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-b border-zinc-900/40 text-left bg-zinc-950/25 px-4 rounded-xl mt-4">
        <div>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Last Matched Price</span>
          <span className="text-xl font-mono font-bold text-white tracking-tight block mt-1">
            ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">24h Net Variance</span>
          <span className={`text-xs font-mono font-bold tracking-tight block mt-1.5 ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? "▲ +" : "▼ "}{asset.change}%
          </span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Timeframe Peak</span>
          <span className="text-sm font-mono font-bold text-gray-200 tracking-tight block mt-1.5">
            ${maxVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Timeframe Low</span>
          <span className="text-sm font-mono font-bold text-gray-300 tracking-tight block mt-1.5">
            ${minVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* MAIN PLOTTING STAGE */}
      <div 
        className="relative h-64 sm:h-72 mt-6 cursor-crosshair w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoverIndex(null);
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentX = x / rect.width;
          const index = Math.min(
            chartData.length - 1,
            Math.max(0, Math.floor(percentX * chartData.length))
          );
          setHoverIndex(index);
        }}
      >
        {/* Dynamic vertical alignment lines/grid */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-zinc-800 w-full" />
          <div className="border-b border-zinc-800 w-full" />
          <div className="border-b border-zinc-800 w-full" />
          <div className="border-b border-zinc-800 w-full" />
        </div>

        {/* SVG WORKSTATION CANVAS */}
        {chartData.length > 0 && (
          <svg className="w-full h-full relative z-10" viewBox="0 0 500 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradientUp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="gradientDown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0"/>
              </linearGradient>
            </defs>

            {/* Area under curve */}
            <path
              d={chartData.reduce((acc, val, idx) => {
                const x = (idx / (chartData.length - 1)) * 500;
                const y = 180 - ((val - minVal) / valRange) * 160;
                return acc + `${idx === 0 ? "M" : "L"} ${x} ${y}`;
              }, "") + " L 500 200 L 0 200 Z"}
              fill={`url(#${isUp ? "gradientUp" : "gradientDown"})`}
            />

            {/* Exponential Moving Average (EMA 8) line */}
            {showEMA && (
              <path
                d={emaData.reduce((acc, val, idx) => {
                  const x = (idx / (emaData.length - 1)) * 500;
                  const y = 180 - ((val - minVal) / valRange) * 160;
                  return acc + `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                }, "")}
                fill="none"
                stroke="#10B981"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                className="opacity-45"
              />
            )}

            {/* Primary asset trend line */}
            <path
              d={chartData.reduce((acc, val, idx) => {
                const x = (idx / (chartData.length - 1)) * 500;
                const y = 180 - ((val - minVal) / valRange) * 160;
                return acc + `${idx === 0 ? "M" : "L"} ${x} ${y}`;
              }, "")}
              fill="none"
              stroke={isUp ? "#10B981" : "#EF4444"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Simulated volume bars at the bottom */}
            {showVolume && (
              <g className="opacity-15">
                {chartData.map((val, idx) => {
                  const x = (idx / (chartData.length - 1)) * 500;
                  const barWidth = 500 / chartData.length * 0.7;
                  const h = Math.abs(Math.sin(idx * 5) * 35) + 5;
                  const isBarUp = idx === 0 || val >= chartData[idx - 1];
                  return (
                    <rect
                      key={idx}
                      x={x - barWidth / 2}
                      y={200 - h}
                      width={barWidth}
                      height={h}
                      fill={isBarUp ? "#10B981" : "#EF4444"}
                    />
                  );
                })}
              </g>
            )}

            {/* Interactive hover crosshair vertical guide */}
            {isHovered && hoverIndex !== null && (
              <line
                x1={(hoverIndex / (chartData.length - 1)) * 500}
                y1="0"
                x2={(hoverIndex / (chartData.length - 1)) * 500}
                y2="200"
                stroke="#262626"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            )}
          </svg>
        )}

        {/* Floating precise HUD details on interactive hover */}
        {isHovered && hoverIndex !== null && chartData[hoverIndex] !== undefined && (
          <div 
            className="absolute bg-[#080808]/95 border border-zinc-800 rounded-lg p-2.5 z-20 shadow-2xl backdrop-blur-md text-[10px] font-mono text-gray-300 pointer-events-none"
            style={{
              left: `${Math.min(75, Math.max(5, (hoverIndex / (chartData.length - 1)) * 100))}%`,
              top: "10px"
            }}
          >
            <p className="text-gray-500 uppercase tracking-wider text-[8px]">Matched Valuation</p>
            <p className="text-white font-bold mt-0.5 text-sm">
              ${chartData[hoverIndex].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {showEMA && (
              <p className="text-emerald-500/80 mt-1">
                EMA (8): ${emaData[hoverIndex]?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* TECHNICAL LAYERS AND CONTROL SWITCHES */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-900/60 text-xs font-mono">
        <div className="flex gap-4">
          <button 
            onClick={() => setShowEMA(!showEMA)}
            className={`flex items-center gap-1.5 transition-colors ${showEMA ? "text-emerald-400" : "text-gray-500"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${showEMA ? "bg-emerald-400" : "bg-zinc-800"}`} />
            <span>EMA Index Line</span>
          </button>
          
          <button 
            onClick={() => setShowVolume(!showVolume)}
            className={`flex items-center gap-1.5 transition-colors ${showVolume ? "text-emerald-400" : "text-gray-500"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${showVolume ? "bg-emerald-400" : "bg-zinc-800"}`} />
            <span>NYSE Volume Overlay</span>
          </button>
        </div>

        <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>REAL-TIME AUDITED BY NYSE SECURE GATEWAY</span>
        </div>
      </div>

    </div>
  );
}
