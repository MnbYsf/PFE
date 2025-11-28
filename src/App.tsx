import { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { AuthPage } from "./components/AuthPage";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ChatbotPage } from "./components/ChatbotPage";
import { ScanWebsitesPage } from "./components/ScanWebsitesPage";
import { PhishingAnalyzerPage } from "./components/PhishingAnalyzerPage";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState("home");

  const handleSignIn = (userData: User) => {
    setUser(userData);
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />;
      case "chatbot":
        return <ChatbotPage />;
      case "scan":
        return <ScanWebsitesPage />;
      case "phishing":
        return <PhishingAnalyzerPage />;
      case "reports":
        return (
          <div className="glass rounded-2xl p-8 text-center">
            <h2 className="mb-4">Reports</h2>
            <p className="text-white/60">
              View and download your security scan reports and analysis history.
            </p>
            <p className="text-sm text-white/40 mt-4">Coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div className="glass rounded-2xl p-8 text-center">
            <h2 className="mb-4">Settings</h2>
            <p className="text-white/60">
              Manage your account, preferences, and integrations.
            </p>
            <p className="text-sm text-white/40 mt-4">Coming soon...</p>
          </div>
        );
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  if (!user) {
    return (
      <>
        <AuthPage onSignIn={handleSignIn} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
