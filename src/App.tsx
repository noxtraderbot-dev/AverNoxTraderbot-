import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowUpRight, 
  Send, 
  Check,
  Copy,
  Activity,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  PhoneCall,
  Search,
  Filter,
  Info,
  ChevronUp,
  TrendingDown
} from "lucide-react";
import AverLogo from "./components/AverLogo";
import InteractiveChart from "./components/InteractiveChart";

// Secure verified Telegram link
const TELEGRAM_LINK = "https://t.me/AverTradingBot";

interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  history: number[];
}

interface PhoneAssetDetail {
  price: number;
  change: number;
}

export default function App() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "contact">("home");
  
  // Ref for smooth scrolling to workstation
  const workstationRef = useRef<HTMLDivElement>(null);

  // Real-time trading assets state for the Pro Workstation
  const [assets, setAssets] = useState<CryptoAsset[]>([
    { symbol: "BTC", name: "Bitcoin", price: 64280.95, change: 2.14, history: [63100, 63250, 63400, 63200, 63850, 64280.95] },
    { symbol: "ETH", name: "Ethereum", price: 3492.40, change: -0.85, history: [3540, 3510, 3485, 3460, 3472, 3492.40] },
    { symbol: "AVR", name: "Aver Token", price: 14.25, change: 12.48, history: [12.10, 12.45, 12.90, 13.15, 13.60, 14.25] },
    { symbol: "NYSE-W", name: "NYSE Digital Comp.", price: 194.80, change: 0.65, history: [192.5, 193.1, 193.8, 194.2, 194.0, 194.80] }
  ]);

  // Phone screen market simulated prices
  const [phonePrices, setPhonePrices] = useState<Record<string, PhoneAssetDetail>>({
    BNB: { price: 425.00, change: 12.02 },
    LUNA: { price: 56.76, change: 10.17 },
    ADA: { price: 1.15, change: -8.52 },
    BTC: { price: 41460.01, change: 9.09 },
    ETH: { price: 3005.13, change: 5.85 },
    SOL: { price: 116.38, change: -10.38 },
    SHIB: { price: 0.000022, change: 9.69 },
    MANA: { price: 3.03, change: 13.49 }
  });

  // Selected asset state for deep trading terminal workstation
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(assets[2]);

  // Flash ticks to indicate dynamic price updates
  const [priceFlash, setPriceFlash] = useState<Record<string, "up" | "down" | null>>({});

  // Update selected asset references on live ticks
  useEffect(() => {
    const currentSelectedSymbol = selectedAsset.symbol;
    const matched = assets.find(a => a.symbol === currentSelectedSymbol);
    if (matched) {
      setSelectedAsset(matched);
    }
  }, [assets]);

  // Simulating high frequency ticker variations
  useEffect(() => {
    const priceInterval = setInterval(() => {
      // Workstation prices
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          const changePercent = (Math.random() - 0.46) * 0.38; // slight upward bias
          const nextPrice = Math.max(0.01, asset.price * (1 + changePercent / 100));
          const direction = nextPrice > asset.price ? "up" : "down";
          
          setPriceFlash(prev => ({ ...prev, [asset.symbol]: direction }));
          setTimeout(() => {
            setPriceFlash(prev => ({ ...prev, [asset.symbol]: null }));
          }, 900);

          const newHistory = [...asset.history.slice(1), nextPrice];
          const calculatedChange = asset.change + changePercent;

          return {
            ...asset,
            price: Number(nextPrice.toFixed(2)),
            change: Number(calculatedChange.toFixed(2)),
            history: newHistory
          };
        })
      );

      // Phone screen prices
      setPhonePrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const coin = next[key as keyof typeof prev];
          const delta = (Math.random() - 0.49) * 0.2;
          const newPrice = Number((coin.price * (1 + delta / 100)).toFixed(key === "SHIB" ? 6 : 2));
          next[key as keyof typeof prev] = {
            price: newPrice,
            change: Number((coin.change + delta).toFixed(2))
          };
        });
        return next;
      });
    }, 4000);

    return () => {
      clearInterval(priceInterval);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(TELEGRAM_LINK);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleScrollToWorkstation = () => {
    workstationRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#030303] text-gray-200 font-sans selection:bg-emerald-500 selection:text-black antialiased relative overflow-hidden">
      
      {/* GLOBAL GRAPHIC BACKGROUND ACCENTS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Abstract dial decorative watch face outline seen in Image 6 & 7 */}
        <div className="absolute top-[340px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] border border-zinc-900/35 rounded-full flex items-center justify-center opacity-70">
          <div className="w-[580px] h-[580px] border border-dashed border-zinc-900/40 rounded-full flex items-center justify-center">
            <div className="w-[420px] h-[420px] border border-zinc-900/30 rounded-full flex items-center justify-center">
              <div className="w-[280px] h-[280px] border border-dashed border-zinc-900/35 rounded-full" />
            </div>
          </div>
        </div>

        {/* Diagonal accent slash seen in background of phone screens */}
        <div className="absolute top-1/4 -right-1/4 w-[1000px] h-[300px] bg-emerald-950/[0.04] blur-[120px] rounded-full rotate-12" />
        <div className="absolute bottom-1/3 -left-1/4 w-[800px] h-[250px] bg-emerald-900/[0.03] blur-[140px] rounded-full -rotate-12" />
      </div>

      {/* STICKY ACCENT TOP GLOW */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent z-40" />

      {/* HIGH-FIDELITY BRAND HEADER */}
      <header className="relative z-50 pt-10 pb-6 px-6 flex flex-col items-center gap-8 bg-gradient-to-b from-black via-black/80 to-transparent">
        
        {/* Real centered high-resolution branding logo with metadata details */}
        <div className="w-full flex justify-center" id="brand-logo-panel">
          <AverLogo size="md" withText={true} layout="vertical" />
        </div>

        {/* Clean, exact layout navigation tabs with thick white indicator seen in Image 6 */}
        <div className="relative flex items-center gap-12" id="navigation-tabs-bar">
          <button 
            onClick={() => setActiveTab("home")}
            className={`text-xs font-sans font-bold tracking-[0.25em] uppercase transition-all duration-300 pb-2 relative ${
              activeTab === "home" ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
            id="nav-tab-home"
          >
            HOME
            {activeTab === "home" && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 inset-x-0 h-[3px] bg-white rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>

          <button 
            onClick={() => setActiveTab("contact")}
            className={`text-xs font-sans font-bold tracking-[0.25em] uppercase transition-all duration-300 pb-2 relative ${
              activeTab === "contact" ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
            id="nav-tab-contact"
          >
            CONTACT
            {activeTab === "contact" && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 inset-x-0 h-[3px] bg-white rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        </div>
      </header>

      {/* VIEW CONDITIONAL RENDERING STAGE */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex flex-col gap-12 items-center">
        
        <AnimatePresence mode="wait">
          {activeTab === "home" ? (
            <motion.section 
              key="home-tab-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
              id="home-view-container"
            >
              
              {/* DUAL OVERLAPPING SMARTPHONES MOCKUP PANEL (Image 6 & 7) */}
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 items-center justify-center py-6 relative" id="dual-phone-mockups">
                
                {/* Decorative dial background overlay directly behind smartphones */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 z-0">
                  <svg className="w-96 h-96 text-zinc-900/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                    <circle cx="50" cy="50" r="45" strokeDasharray="3 2" />
                    <circle cx="50" cy="50" r="35" />
                    <line x1="50" y1="5" x2="50" y2="95" />
                    <line x1="5" y1="50" x2="95" y2="50" />
                  </svg>
                </div>

                {/* Left Phone: "Markets" screen */}
                <div className="flex justify-center md:justify-end z-10">
                  <div className="w-[300px] h-[580px] bg-black rounded-[42px] border-[10px] border-zinc-900/95 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-4 flex flex-col text-left overflow-hidden relative">
                    
                    {/* Speaker/Camera notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-zinc-900 rounded-full z-30 flex items-center justify-center">
                      <div className="w-12 h-1 bg-zinc-800 rounded-full" />
                    </div>

                    <div className="flex flex-col h-full justify-between pt-4">
                      {/* Markets Header */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-sans text-gray-400 font-bold px-1 mt-1">
                          <span>Markets</span>
                          <div className="flex items-center gap-2">
                            <Search className="w-3.5 h-3.5 text-gray-500" />
                            <Filter className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                        </div>

                        {/* Markets Tab selector */}
                        <div className="flex gap-4 mt-3 border-b border-zinc-900/80 pb-2 px-1">
                          <span className="text-[10px] font-bold text-white border-b-2 border-emerald-500 pb-1 uppercase tracking-wide">All</span>
                          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Favorites</span>
                          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Hot 🔥</span>
                        </div>
                      </div>

                      {/* Markets list scroll area */}
                      <div className="flex-1 overflow-y-auto no-scrollbar py-2 flex flex-col gap-2.5 mt-2">
                        {Object.entries(phonePrices).map(([symbol, val]) => {
                          const detail = val as PhoneAssetDetail;
                          const isUp = detail.change >= 0;
                          return (
                            <div 
                              key={symbol}
                              className="flex items-center justify-between py-1.5 border-b border-zinc-950/40 last:border-0 hover:bg-zinc-950/20 px-1 rounded transition-all"
                            >
                              {/* Left icon and brand info */}
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                                  <span className="text-[9px] font-mono text-emerald-400 font-bold">{symbol.slice(0, 2)}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-bold text-gray-200">{symbol}</span>
                                  <span className="text-[8px] text-gray-500 font-mono capitalize">
                                    {symbol === "BTC" ? "Bitcoin" : symbol === "ETH" ? "Ethereum" : symbol === "AVR" ? "Aver Token" : symbol === "BNB" ? "Binance" : symbol === "LUNA" ? "Terra" : symbol === "ADA" ? "Cardano" : symbol === "SOL" ? "Solana" : symbol === "SHIB" ? "Shiba" : "Decentraland"}
                                  </span>
                                </div>
                              </div>

                              {/* Center Sparkline SVG */}
                              <div className="w-14 h-5 opacity-60">
                                <svg className="w-full h-full" viewBox="0 0 50 15">
                                  <path 
                                    d={isUp ? "M0 12 L10 10 L20 13 L30 6 L40 8 L50 2" : "M0 2 L10 6 L20 4 L30 11 L40 9 L50 13"}
                                    fill="none"
                                    stroke={isUp ? "#10B981" : "#EF4444"}
                                    strokeWidth="1.2"
                                  />
                                </svg>
                              </div>

                              {/* Right values */}
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-mono font-bold text-gray-300">
                                  ${detail.price.toLocaleString()}
                                </span>
                                <span className={`text-[8px] font-mono font-semibold ${isUp ? "text-emerald-500" : "text-red-500"}`}>
                                  {isUp ? "+" : ""}{detail.change}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Phone navigation bar bar */}
                      <div className="h-1 bg-zinc-800 w-24 mx-auto rounded-full mt-3 mb-1" />
                    </div>

                  </div>
                </div>

                {/* Right Phone: "Global Metrics" screen */}
                <div className="flex justify-center md:justify-start z-10 md:-translate-y-4">
                  <div className="w-[300px] h-[580px] bg-black rounded-[42px] border-[10px] border-zinc-900/95 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-4 flex flex-col text-left overflow-hidden relative">
                    
                    {/* Speaker/Camera notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-zinc-900 rounded-full z-30 flex items-center justify-center">
                      <div className="w-12 h-1 bg-zinc-800 rounded-full" />
                    </div>

                    <div className="flex flex-col h-full justify-between pt-4">
                      
                      {/* Global Metrics Header */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-sans text-gray-400 font-bold px-1 mt-1">
                          <span className="text-[10px] text-gray-500">&lt;</span>
                          <span>Global Metrics</span>
                        </div>

                        {/* Overview values blocks */}
                        <div className="grid grid-cols-2 gap-3 mt-4 px-1">
                          <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-900/50">
                            <span className="text-[7px] font-mono text-gray-500 uppercase tracking-wider block">Market Cap (USD)</span>
                            <span className="text-[11px] font-mono font-bold text-gray-200 block mt-0.5">$1,899,964,238,792</span>
                          </div>
                          <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-900/50">
                            <span className="text-[7px] font-mono text-gray-500 uppercase tracking-wider block">24h Volume (USD)</span>
                            <span className="text-[11px] font-mono font-bold text-gray-200 block mt-0.5">$94,154,889,896</span>
                          </div>
                        </div>

                        {/* Ratio stats */}
                        <div className="grid grid-cols-2 gap-3 mt-3 px-1">
                          <div className="flex justify-between items-center bg-zinc-950/40 p-2 rounded-md border border-zinc-900/30">
                            <span className="text-[8px] font-sans text-gray-400">BTC Dominance</span>
                            <span className="text-[9px] font-mono font-bold text-emerald-400">41.34%</span>
                          </div>
                          <div className="flex justify-between items-center bg-zinc-950/40 p-2 rounded-md border border-zinc-900/30">
                            <span className="text-[8px] font-sans text-gray-400">ETH Dominance</span>
                            <span className="text-[9px] font-mono font-bold text-emerald-400">18.89%</span>
                          </div>
                        </div>

                        {/* Registry block */}
                        <div className="grid grid-cols-2 gap-3 mt-3 px-1 text-[8px] text-gray-500 border-b border-zinc-900/85 pb-2.5">
                          <div className="flex justify-between px-1">
                            <span>Cryptocurrencies:</span>
                            <span className="text-gray-300 font-mono font-bold">17,342</span>
                          </div>
                          <div className="flex justify-between px-1">
                            <span>Market Pairs:</span>
                            <span className="text-gray-300 font-mono font-bold">53,798</span>
                          </div>
                        </div>
                      </div>

                      {/* Gas pricing blocks */}
                      <div className="px-1 mt-2 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider block px-1">Live ETH Gas Rate</span>
                          
                          <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                            <div className="bg-zinc-950 p-1 px-2 rounded-md text-center border border-zinc-900/40">
                              <span className="text-[7px] text-gray-500 block">Slow</span>
                              <span className="text-[9px] font-mono font-bold text-gray-300">57 Gwei</span>
                            </div>
                            <div className="bg-zinc-950 p-1 px-2 rounded-md text-center border border-zinc-900/40">
                              <span className="text-[7px] text-gray-500 block">Standard</span>
                              <span className="text-[9px] font-mono font-bold text-gray-300">58 Gwei</span>
                            </div>
                            <div className="bg-zinc-950 p-1 px-2 rounded-md text-center border border-zinc-900/40">
                              <span className="text-[7px] text-gray-500 block">Fast</span>
                              <span className="text-[9px] font-mono font-bold text-emerald-400">58 Gwei</span>
                            </div>
                          </div>
                          
                          <span className="text-[6px] font-mono text-gray-600 block text-center mt-1.5">
                            ⛽ ETH Gas Powered by Etherscan API
                          </span>
                        </div>

                        {/* Bottom Candlestick Chart Mockup on phone screen */}
                        <div className="h-28 bg-[#070707] rounded-xl border border-zinc-900/80 p-2 mt-4 flex flex-col justify-between">
                          <span className="text-[7px] font-mono text-gray-500 uppercase">Interactive Matching Telemetry</span>
                          <div className="h-16 flex items-end justify-between px-1 gap-1 relative overflow-hidden">
                            {/* Horizontal guide lines */}
                            <div className="absolute inset-x-0 top-1/4 border-b border-zinc-900/60 pointer-events-none" />
                            <div className="absolute inset-x-0 top-2/4 border-b border-zinc-900/60 pointer-events-none" />
                            <div className="absolute inset-x-0 top-3/4 border-b border-zinc-900/60 pointer-events-none" />

                            {/* Simulated Candles */}
                            {[
                              { high: 80, low: 20, open: 60, close: 40 },
                              { high: 90, low: 40, open: 50, close: 80 },
                              { high: 70, low: 30, open: 65, close: 45 },
                              { high: 85, low: 50, open: 55, close: 75 },
                              { high: 95, low: 60, open: 70, close: 90 },
                              { high: 60, low: 10, open: 50, close: 25 },
                              { high: 75, low: 30, open: 40, close: 65 }
                            ].map((c, i) => {
                              const isGreen = c.close >= c.open;
                              return (
                                <div key={i} className="flex-1 flex flex-col items-center h-full relative justify-end">
                                  {/* Wick */}
                                  <div 
                                    className={`absolute w-[1px] ${isGreen ? "bg-emerald-500" : "bg-red-500"}`} 
                                    style={{ height: `${c.high - c.low}%`, bottom: `${c.low}%` }}
                                  />
                                  {/* Body */}
                                  <div 
                                    className={`w-2.5 z-10 rounded-sm ${isGreen ? "bg-emerald-500" : "bg-red-500"}`} 
                                    style={{ 
                                      height: `${Math.abs(c.close - c.open)}%`, 
                                      bottom: `${Math.min(c.open, c.close)}%` 
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-[6px] font-mono text-gray-600 px-1 pt-1 border-t border-zinc-900">
                            <span>1H</span>
                            <span>24H</span>
                            <span>7D</span>
                            <span>30D</span>
                            <span>90D</span>
                            <span>1Y</span>
                            <span>All</span>
                          </div>
                        </div>
                      </div>

                      {/* Phone navigation bar bar */}
                      <div className="h-1 bg-zinc-800 w-24 mx-auto rounded-full mt-3 mb-1" />
                    </div>

                  </div>
                </div>

              </div>

              {/* CENTER DISPLAY SLOGAN & CTA (Image 7 & 8) */}
              <div className="flex flex-col items-center text-center mt-12 max-w-2xl gap-5" id="slogan-badge-panel">
                
                {/* Beautiful highlighted block badge "Invest In Crypto Now" */}
                <div className="bg-white text-black font-sans font-black text-[11px] tracking-[0.25em] uppercase px-6 py-2 select-none" id="invest-now-badge">
                  Invest In Crypto Now
                </div>

                {/* Exact display title matching design */}
                <h2 className="text-4xl sm:text-6xl font-sans font-bold tracking-tight text-white leading-[1.1] px-4" id="home-display-title">
                  Your Digital Wallet, <br />Your World.
                </h2>

                {/* Exact double-border thick styled START TRADING CTA button */}
                <div className="pt-6" id="start-trading-btn-wrapper">
                  <button 
                    onClick={handleScrollToWorkstation}
                    className="border-2 border-white bg-black hover:bg-white hover:text-black text-white font-sans font-bold text-xs tracking-[0.25em] uppercase px-16 py-4.5 transition-all duration-300 transform active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.06)]"
                    id="start-trading-home-btn"
                  >
                    START TRADING
                  </button>
                </div>
              </div>

              {/* PLATFORM MISSION STATEMENT (Image 8 & 5) */}
              <div className="w-full max-w-2xl text-center flex flex-col gap-4 mt-24 pt-12 border-t border-zinc-900/65" id="mission-statement-panel">
                <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight" id="mission-title">
                  Unlock Your Financial Freedom
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-sans font-medium" id="mission-description">
                  We are a cutting-edge cryptocurrency trading platform designed to empower individuals and institutions to securely and efficiently participate in the digital asset market.
                </p>
              </div>

              {/* THREE HIGH-FIDELITY MARKETING FEATURES LIST (Image 4 & 5) */}
              <div className="w-full max-w-md flex flex-col gap-12 mt-20 pb-16" id="features-marketing-list">
                
                {/* Feature 1: Advanced Trading Tools */}
                <div className="flex flex-col items-center text-center gap-4 group" id="feat-item-1">
                  <div className="w-16 h-16 text-white transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 20V10M12 20V4M6 20V14" strokeLinecap="round" />
                      <path d="M4 14L10 8L16 12L22 4" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="22" cy="4" r="1.5" fill="currentColor" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-sans font-bold tracking-wide text-white uppercase mt-1">
                    Advanced Trading Tools
                  </h4>
                </div>

                {/* Feature 2: Secured Trading */}
                <div className="flex flex-col items-center text-center gap-4 group" id="feat-item-2">
                  <div className="w-16 h-16 text-white transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="11" r="2.5" />
                      <path d="M12 13.5V16" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-sans font-bold tracking-wide text-white uppercase mt-1">
                    Secured Trading
                  </h4>
                </div>

                {/* Feature 3: Easy Payments */}
                <div className="flex flex-col items-center text-center gap-4 group" id="feat-item-3">
                  <div className="w-16 h-16 text-white transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="6" width="18" height="12" rx="2" />
                      <path d="M3 10h18" />
                      <path d="M7 14h.01M11 14h2" />
                      <path d="M7 4h12a2 2 0 0 1 2 2v8" className="opacity-40" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-sans font-bold tracking-wide text-white uppercase mt-1">
                    Easy Payments
                  </h4>
                </div>

              </div>

              {/* INTEGRATED MATCHING WORKSTATION ANCHOR ELEMENT */}
              <div ref={workstationRef} className="w-full border-t border-zinc-900 pt-16 mt-16" id="pro-matching-terminal">
                
                <div className="flex flex-col items-center text-center gap-3 mb-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-950/95 border border-zinc-900 rounded-lg text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-[0.2em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Aver Pro Live Workstation
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-sans font-extrabold text-white tracking-tight uppercase">
                    Consolidated Live Matching Engine
                  </h2>
                  <p className="text-xs text-gray-500 max-w-md leading-relaxed font-mono uppercase tracking-wider">
                    Select assets, execute real transactions via Dark Pool, and manage automated Aver bots below.
                  </p>
                </div>

                {/* WORKSTATION GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="workstation-assets-bar">
                  {assets.map((asset) => {
                    const isUp = asset.change >= 0;
                    const isSelected = selectedAsset.symbol === asset.symbol;

                    return (
                      <motion.button 
                        key={asset.symbol}
                        onClick={() => setSelectedAsset(asset)}
                        className={`bg-[#0A0A0A] border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between text-left min-h-[140px] cursor-pointer`}
                        id={`asset-card-${asset.symbol.toLowerCase()}`}
                        animate={priceFlash[asset.symbol] ? {
                          scale: [1, 1.03, isSelected ? 1.01 : 1],
                          borderColor: priceFlash[asset.symbol] === "up" 
                            ? [isSelected ? "rgba(16,185,129,0.8)" : "rgba(39,39,42,0.8)", "rgba(16,185,129,1)", isSelected ? "rgba(16,185,129,0.8)" : "rgba(24,24,27,0.8)"]
                            : [isSelected ? "rgba(16,185,129,0.8)" : "rgba(39,39,42,0.8)", "rgba(239,68,68,1)", isSelected ? "rgba(16,185,129,0.8)" : "rgba(24,24,27,0.8)"],
                          boxShadow: priceFlash[asset.symbol] === "up"
                            ? [isSelected ? "0 0 20px rgba(16,185,129,0.08)" : "0 0 0px rgba(0,0,0,0)", "0 0 25px rgba(16,185,129,0.4)", isSelected ? "0 0 20px rgba(16,185,129,0.08)" : "0 0 0px rgba(0,0,0,0)"]
                            : [isSelected ? "0 0 20px rgba(16,185,129,0.08)" : "0 0 0px rgba(0,0,0,0)", "0 0 25px rgba(239,68,68,0.4)", isSelected ? "0 0 20px rgba(16,185,129,0.08)" : "0 0 0px rgba(0,0,0,0)"]
                        } : {
                          scale: isSelected ? 1.01 : 1,
                          borderColor: isSelected ? "rgba(16,185,129,0.8)" : "rgba(24,24,27,0.8)",
                          boxShadow: isSelected ? "0 0 20px rgba(16,185,129,0.08)" : "0 0 0px rgba(0,0,0,0)"
                        }}
                        whileHover={{
                          borderColor: isSelected ? "rgba(16,185,129,0.95)" : "rgba(63,63,70,0.8)",
                          scale: isSelected ? 1.02 : 1.01
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut"
                        }}
                      >
                        <div className="w-full">
                          <div className="flex justify-between items-start w-full">
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold tracking-wider uppercase ${
                              isSelected 
                                ? "bg-emerald-500 text-black border-emerald-500" 
                                : "bg-emerald-950/45 text-emerald-400 border-emerald-900/30"
                            }`}>
                              {asset.symbol}
                            </span>
                            <span className={`text-[9px] font-mono font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                              {isUp ? "+" : ""}{asset.change}%
                            </span>
                          </div>

                          <h3 className="text-xs font-semibold text-gray-400 mt-2.5 tracking-wide">
                            {asset.name}
                          </h3>

                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-base font-mono font-bold text-white tracking-tight">
                              ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-[8px] font-mono text-gray-600">USD</span>
                          </div>
                        </div>

                        {/* Interactive glow sparkline background */}
                        <div className="h-6 mt-3 w-full opacity-40">
                          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path
                              d={asset.history.reduce((acc, val, idx) => {
                                const x = (idx / (asset.history.length - 1)) * 100;
                                const min = Math.min(...asset.history);
                                const max = Math.max(...asset.history);
                                const range = max - min || 1;
                                const y = 18 - ((val - min) / range) * 16;
                                return acc + `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                              }, "")}
                              fill="none"
                              stroke={isUp ? "#10B981" : "#EF4444"}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* SECONDARY MATCHING LAYER */}
                <div className="grid grid-cols-1 gap-6" id="workstation-primary-blocks">
                  <div className="w-full h-full">
                    <InteractiveChart asset={selectedAsset} />
                  </div>
                </div>

              </div>

            </motion.section>
          ) : (
            <motion.section 
              key="contact-tab-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center justify-center py-12 gap-12"
              id="contact-view-container"
            >
              
              {/* SUPPORT ICON (Image 3) */}
              <div className="flex flex-col items-center gap-4 group" id="contact-support-badge">
                
                {/* Slanted receiver clock custom-drawn support graphic */}
                <div className="relative w-32 h-32 flex items-center justify-center" id="support-clock-svg-frame">
                  {/* Subtle breathing accent circular aura */}
                  <div className="absolute inset-2 rounded-full bg-white/5 blur-md" />
                  
                  <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {/* Circle representing the outer clock dial */}
                    <circle cx="50" cy="50" r="42" strokeDasharray="5 3" strokeLinecap="round" />
                    
                    {/* Clock arrow head */}
                    <path d="M 50,4 L 50,14 L 56,8 Z" fill="currentColor" />
                    
                    {/* Dial markings */}
                    <line x1="50" y1="8" x2="50" y2="12" />
                    <line x1="92" y1="50" x2="88" y2="50" />
                    <line x1="50" y1="92" x2="50" y2="88" />
                    <line x1="8" y1="50" x2="12" y2="50" />

                    {/* Classic slanted solid telephone receiver icon */}
                    <path 
                      d="M 28,68 C 36,78 54,78 62,68 L 58,58 C 53,62 45,62 40,58 L 32,62 Z" 
                      fill="currentColor" 
                      className="opacity-95" 
                    />
                    <path d="M 22,58 L 32,62 L 28,72 L 18,68 Z" fill="currentColor" />
                    <path d="M 58,58 L 68,62 L 64,72 L 54,68 Z" fill="currentColor" />

                    {/* Bold 24 in the middle */}
                    <text 
                      x="50" 
                      y="46" 
                      fontSize="20" 
                      fontFamily="sans-serif" 
                      fontWeight="900" 
                      textAnchor="middle" 
                      fill="currentColor"
                    >
                      24
                    </text>
                  </svg>
                </div>

                <h4 className="text-xl font-sans font-bold tracking-widest text-white uppercase mt-4" id="support-title">
                  Customer Support
                </h4>
              </div>

              {/* ACTION PORTAL BLOCK (Image 2) */}
              <div className="flex flex-col items-center text-center max-w-xl gap-4" id="support-cta-panel">
                <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-white leading-tight uppercase tracking-tight" id="support-cta-title">
                  Trade Crypto Today
                </h2>
                <p className="text-gray-400 text-sm sm:text-base font-sans font-medium" id="support-cta-subtitle">
                  Diversify your portfolio with crypto
                </p>

                {/* Double-border custom block button 'GET IN TOUCH' */}
                <div className="pt-8" id="get-in-touch-btn-wrapper">
                  <button 
                    onClick={() => setShowRedirectModal(true)}
                    className="border-2 border-white bg-black hover:bg-white hover:text-black text-white font-sans font-bold text-xs tracking-[0.25em] uppercase px-16 py-4.5 transition-all duration-300 transform active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.06)]"
                    id="get-in-touch-contact-btn"
                  >
                    GET IN TOUCH
                  </button>
                </div>
              </div>

            </motion.section>
          )}
        </AnimatePresence>

      </main>

      {/* INSTITUTIONAL FOOTER */}
      <footer className="relative z-30 border-t border-zinc-900/90 bg-black py-12 px-6 text-center text-xs text-gray-600 font-sans" id="app-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p id="footer-copyright-text">
            &copy; {new Date().getFullYear()} Aver Trading Bot. All rights reserved. SEC-v.1.1
          </p>
          <div className="flex gap-6 text-gray-500 font-medium" id="footer-links">
            <a href="#" className="hover:text-white transition-colors">Term of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Security Disclosure</a>
          </div>
        </div>
      </footer>

      {/* SECURE DIRECT INTERACTIVE TELEGRAM HANDSHAKE OVERLAY (Iframe-Safe) */}
      <AnimatePresence>
        {showRedirectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRedirectModal(false)}
            />

            {/* High-Fidelity Dialog modal */}
            <motion.div 
              className="relative w-full max-w-md bg-[#0D0D0D] border border-zinc-900 rounded-2xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.95)] z-10 flex flex-col items-center text-center gap-5 overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* Green ambient visual glow overlay */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-10 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

              <div className="p-4 rounded-full bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Send className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h3 className="text-lg font-sans font-bold text-white tracking-tight">Establishing Secure Handshake</h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                  You are opening the secure Aver Telegram trading portal. To align with our institutional security guidelines, ensure you are using the official Telegram application.
                </p>
              </div>

              {/* Secure parameters information */}
              <div className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-3 text-left flex flex-col gap-1.5 text-[11px] font-mono text-gray-500">
                <div className="flex justify-between">
                  <span>Routing Target:</span>
                  <span className="text-emerald-400 font-semibold">@AverTradingBot</span>
                </div>
                <div className="flex justify-between">
                  <span>SSL Encryption:</span>
                  <span className="text-white">Active (NYSE-V4)</span>
                </div>
                <div className="flex justify-between">
                  <span>Handshake Path:</span>
                  <span className="text-white">Secure Redirection Gateway</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full pt-2">
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowRedirectModal(false)}
                  className="w-full py-3 bg-white hover:bg-emerald-400 text-black font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-300 text-center flex items-center justify-center gap-2"
                >
                  <span>Connect Ledger Node</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setShowRedirectModal(false)}
                  className="w-full py-2.5 bg-transparent hover:bg-zinc-900 text-gray-500 hover:text-gray-300 text-[10px] font-mono tracking-widest uppercase transition-all duration-200 rounded-xl"
                >
                  Cancel Connection
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
