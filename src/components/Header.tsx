import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Settings, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { logout } from "../api/auth";
import { toast } from "sonner";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
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
    <div className="glass border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          Sandbox
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button className="p-2 rounded-lg hover:bg-accent transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="gradient-primary text-white">
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
        )}
      </div>
    </div>
  );
}
