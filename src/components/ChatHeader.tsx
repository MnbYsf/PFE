import { Button } from "./ui/button";
import { Shield, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { AuthDialog } from "./AuthDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { logout } from "../api/auth";
import { toast } from "sonner";

interface ChatHeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSignIn?: (user: any) => void;
  onNavigateToDashboard?: () => void;
  onLogout?: () => void;
}

export function ChatHeader({ user, onSignIn, onNavigateToDashboard, onLogout }: ChatHeaderProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const handleSignIn = (userData: any) => {
    if (onSignIn) {
      onSignIn(userData);
    }
    setShowAuthDialog(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully signed out!");
      if (onLogout) {
        onLogout();
      }
    } catch (err) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <>
      <div className="w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl gradient-primary shadow-glow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Cyber Guard
              </span>
            </div>

            {/* Auth Buttons or User Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={onNavigateToDashboard}
                    className="text-sm"
                  >
                    Dashboard
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="text-sm hidden sm:block text-muted-foreground">
                          {user.name}
                        </span>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="gradient-primary text-white text-xs">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setAuthMode("signin");
                      setShowAuthDialog(true);
                    }}
                    className="text-sm"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      setAuthMode("signup");
                      setShowAuthDialog(true);
                    }}
                    className="gradient-primary shadow-glow hover:opacity-90 text-sm"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AuthDialog 
              mode={authMode}
              onSignIn={handleSignIn}
              onModeChange={setAuthMode}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

