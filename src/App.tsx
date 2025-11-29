import React, { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { ChatbotPage } from "./components/ChatbotPage";
import { ChatHeader } from "./components/ChatHeader";
import { Dashboard } from "./components/Dashboard";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardPage, setDashboardPage] = useState("home");

  const handleSignIn = (userData: User) => {
    setUser(userData);
    // Don't automatically switch to dashboard - user can continue chatting or navigate
  };

  const handleLogout = () => {
    setUser(null);
    setShowDashboard(false);
  };

  const handleNavigateToDashboard = () => {
    setShowDashboard(true);
  };

  const handleNavigateFromDashboard = (page: string) => {
    if (page === "chatbot") {
      // If navigating to chatbot from dashboard, show chat page
      setShowDashboard(false);
    } else {
      setDashboardPage(page);
    }
  };

  // Show dashboard if user is logged in and explicitly navigated to it
  if (user && showDashboard) {
    return (
      <>
        <Dashboard 
          user={user} 
          currentPage={dashboardPage} 
          onNavigate={handleNavigateFromDashboard}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  // Default: Show chat page (homepage) with header
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ChatHeader 
        user={user || undefined} 
        onSignIn={handleSignIn}
        onNavigateToDashboard={handleNavigateToDashboard}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-hidden">
        <ChatbotPage />
      </div>
      <Toaster />
    </div>
  );
}
