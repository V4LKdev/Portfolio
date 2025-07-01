import { useEffect, useState } from "react";
import { OnboardingPreferences } from "../lib/cookies";

export function useLoginOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const completed = OnboardingPreferences.getCompleted();
    setShowOnboarding(!completed);
  }, []);

  const completeOnboarding = () => {
    OnboardingPreferences.setCompleted(true);
    setShowOnboarding(false);
  };

  return { showOnboarding, completeOnboarding };
}
