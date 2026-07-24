"use client";

import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import AuthScreen from "./components/AuthScreen";
import OnboardingFlow from "./components/OnboardingFlow";
import HomeScreen from "./components/HomeScreen";

type Phase = "splash" | "auth" | "onboarding" | "home";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("splash");
  const [userName, setUserName] = useState("");
  const [quizPercent, setQuizPercent] = useState<number | null>(null);

  function handleSignOut() {
    setUserName("");
    setQuizPercent(null);
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
          setQuizPercent(result ? result.percent : null);
          setPhase("home");
        }}
      />
    );
  }

  return (
    <HomeScreen
      userName={userName}
      quizPercent={quizPercent}
      onSignOut={handleSignOut}
    />
  );
}
