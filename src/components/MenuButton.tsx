
import React, { useState } from 'react';

interface MenuButtonProps {
  label: string;
  hoverLabel: string;
  onClick: () => void;
  className?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, hoverLabel, onClick, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`px-6 py-3 bg-amber-500/20 border-2 border-amber-500/50 rounded-lg text-amber-100 font-semibold hover:bg-amber-500/30 hover:border-amber-500/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transform hover:scale-105 ${className}`}
    >
      <span className="transition-all duration-300">
        {isHovered ? hoverLabel : label}
      </span>
    </button>
  );
};

export default MenuButton;
