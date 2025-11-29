import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { HomePage } from "./HomePage";
import { ChatbotPage } from "./ChatbotPage";
import { ScanWebsitesPage } from "./ScanWebsitesPage";
import { PhishingAnalyzerPage } from "./PhishingAnalyzerPage";

interface DashboardProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function Dashboard({ user, currentPage, onNavigate, onLogout }: DashboardProps) {
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={onNavigate} />;
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
        return <HomePage onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

