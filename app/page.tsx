"use client";

import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import AuthScreen from "./components/AuthScreen";
import OnboardingFlow, {
  type OnboardingResult,
} from "./components/OnboardingFlow";
import HomeScreen from "./components/HomeScreen";

type Phase = "splash" | "auth" | "onboarding" | "home";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("splash");
  const [userName, setUserName] = useState("");
  const [quizPercent, setQuizPercent] = useState<number | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingResult | null>(null);

  function handleSignOut() {
    setUserName("");
    setQuizPercent(null);
    setOnboarding(null);
    setPhase("auth");
  }

  if (phase === "splash") {
    return <SplashScreen onComplete={() => setPhase("auth")} />;
  }

  if (phase === "auth") {
    return (
      <AuthScreen
        onAuthenticated={(name) => {
          setUserName(name);
          setPhase("onboarding");
        }}
      />
    );
  }

  if (phase === "onboarding") {
    return (
      <OnboardingFlow
        onFinish={(result) => {
          setQuizPercent(result.quizPercent);
          setOnboarding(result);
          setPhase("home");
        }}
      />
    );
  }

  return (
    <HomeScreen
      userName={userName}
      quizPercent={quizPercent}
      onboarding={onboarding}
      onSignOut={handleSignOut}
    />
  );
}
