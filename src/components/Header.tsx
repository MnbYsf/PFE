import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function Header({ user }: HeaderProps) {
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
          <div className="flex items-center gap-3">
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
          </div>
        )}
      </div>
    </div>
  );
}
