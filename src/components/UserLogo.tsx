import { motion } from "motion/react";

interface UserLogoProps {
  size?: number;
  className?: string;
  glowColor?: string;
  id?: string;
}

export default function UserLogo({ 
  size = 160, 
  className = "",
  glowColor = "rgba(16, 185, 129, 0.25)",
  id = "user-logo-component-wrapper"
}: UserLogoProps) {
  return (
    <motion.div 
      className={`relative flex items-center justify-center shrink-0 select-none ${className}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ 
        scale: { type: "spring", stiffness: 300, damping: 20 },
        opacity: { duration: 0.6, ease: "easeOut" }
      }}
      id={id}
    >
      {/* Premium ambient pulsing radial background aura */}
      <motion.div 
        className="absolute rounded-full pointer-events-none blur-2xl opacity-80"
        style={{ 
          width: size * 1.35, 
          height: size * 1.35,
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 0.85, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Second inner tighter high-contrast ring glow */}
      <div 
        className="absolute rounded-full pointer-events-none border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
        style={{
          width: size * 1.02,
          height: size * 1.02,
        }}
      />

      {/* High-resolution Logo Image */}
      <img
        src="/src/assets/images/aver_logo_1783101602567.jpg"
        alt="Aver Trading Bot Logo"
        referrerPolicy="no-referrer"
        className="relative z-10 rounded-full border border-zinc-800/80 object-cover shadow-[0_0_30px_rgba(0,0,0,0.8)]"
        style={{
          width: size,
          height: size,
        }}
        id="user-logo-img-element"
      />
    </motion.div>
  );
}
