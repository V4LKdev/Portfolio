// Back Button Component
// Reusable navigation button for returning to previous sections
// Consistent styling and hover effects

import React from "react";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

/**
 * Reusable back button component
 * @param onClick - Callback function when button is clicked
 * @param label - Optional custom label (defaults to "Back to Home")
 */
const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = "Back to Home",
}) => {
  return (
    <button
      onClick={onClick}
      className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
