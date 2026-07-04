import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowUpRight, 
  Send, 
  Search,
  Filter,
} from "lucide-react";
import AverLogoImage from "./image.png"; // Updated import
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
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "contact">("home");
  
  const workstationRef = useRef<HTMLDivElement>(null);

  const [assets, setAssets] = useState<CryptoAsset[]>([
    { symbol: "BTC", name: "Bitcoin", price: 64280.95, change: 2.14, history: [63100, 63250, 63400, 63200, 63850, 64280.95] },
    { symbol: "ETH", name: "Ethereum", price: 3492.40, change: -0.85, history: [3540, 3510, 3485, 3460, 3472, 3492.40] },
    { symbol: "AVR", name: "Aver Token", price: 14.25, change: 12.48, history: [12.10, 12.45, 12.90, 13.15, 13.60, 14.25] },
    { symbol: "NYSE-W", name: "NYSE Digital Comp.", price: 194.80, change: 0.65, history: [192.5, 193.1, 193.8, 194.2, 194.0, 194.80] }
  ]);

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

  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(assets[2]);
  const [priceFlash, setPriceFlash] = useState<Record<string, "up" | "down" | null>>({});

  useEffect(() => {
    const currentSelectedSymbol = selectedAsset.symbol;
    const matched = assets.find(a => a.symbol === currentSelectedSymbol);
    if (matched) {
      setSelectedAsset(matched);
    }
  }, [assets]);

  useEffect(() => {
    const priceInterval = setInterval(() => {
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          const changePercent = (Math.random() - 0.46) * 0.38;
          const nextPrice = Math.max(0.01, asset.price * (1 + changePercent / 100));
          const direction = nextPrice > asset.price ? "up" : "down";
          setPriceFlash(prev => ({ ...prev, [asset.symbol]: direction }));
          setTimeout(() => setPriceFlash(prev => ({ ...prev, [asset.symbol]: null })), 900);
          return { ...asset, price: Number(nextPrice.toFixed(2)), change: Number((asset.change + changePercent).toFixed(2)), history: [...asset.history.slice(1), nextPrice] };
        })
      );
      setPhonePrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const coin = next[key as keyof typeof prev];
          const delta = (Math.random() - 0.49) * 0.2;
          next[key as keyof typeof prev] = { price: Number((coin.price * (1 + delta / 100)).toFixed(key === "SHIB" ? 6 : 2)), change: Number((coin.change + delta).toFixed(2)) };
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(priceInterval);
  }, []);

  const handleScrollToWorkstation = () => {
    workstationRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#030303] text-gray-200 font-sans relative overflow-hidden">
      <header className="relative z-50 pt-10 pb-6 px-6 flex flex-col items-center gap-8 bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="w-full flex justify-center" id="brand-logo-panel">
          {/* Replaced Component with your image */}
          <img src={AverLogoImage} alt="Aver Logo" className="h-14 w-auto object-contain" />
        </div>

        <div className="relative flex items-center gap-12">
          <button onClick={() => setActiveTab("home")} className={`text-xs font-bold uppercase pb-2 ${activeTab === "home" ? "text-white" : "text-gray-500"}`}>HOME</button>
          <button onClick={() => setActiveTab("contact")} className={`text-xs font-bold uppercase pb-2 ${activeTab === "contact" ? "text-white" : "text-gray-500"}`}>CONTACT</button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex flex-col gap-12 items-center">
        {/* ... Rest of your component code remains the same ... */}
        {/* Ensure the rest of your JSX follows below exactly as it was */}
      </main>
    </div>
  );
}
