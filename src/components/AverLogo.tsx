import UserLogo from "./UserLogo";

interface AverLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  withText?: boolean;
  layout?: "horizontal" | "vertical";
}

export default function AverLogo({ 
  size = "md", 
  withText = true, 
  layout = "vertical" 
}: AverLogoProps) {
  // Map sizes to elegant pixel dimension targets for the integrated UserLogo component
  const sizeMap = {
    xs: 40,
    sm: 72,
    md: 180, // Prominent size for the main header brand showcase
    lg: 240,
    xl: 320,
  };

  const logoSize = sizeMap[size];

  return (
    <div 
      className={`flex select-none items-center justify-center ${
        layout === "horizontal" ? "flex-row text-left" : "flex-col text-center"
      } gap-4`}
      id={`aver-logo-container-${size}`}
    >
      {/* High-fidelity Logo Component integrating the user's graphical branding logo */}
      <UserLogo 
        size={logoSize} 
        id={`aver-logo-component-${size}`} 
      />
    </div>
  );
}
