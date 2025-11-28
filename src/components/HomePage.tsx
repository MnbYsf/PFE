import { Shield, MessageSquare, Mail, TrendingUp, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const stats = [
    {
      title: "Total Scans",
      value: "24",
      change: "+12%",
      icon: Shield,
      color: "text-blue-400",
    },
    {
      title: "Threats Detected",
      value: "7",
      change: "+3",
      icon: Activity,
      color: "text-red-400",
    },
    {
      title: "Emails Analyzed",
      value: "156",
      change: "+28%",
      icon: Mail,
      color: "text-purple-400",
    },
    {
      title: "Chat Sessions",
      value: "42",
      change: "+15%",
      icon: MessageSquare,
      color: "text-green-400",
    },
  ];

  const recentScans = [
    {
      url: "example.com",
      date: "2 hours ago",
      status: "medium",
      issues: 3,
    },
    {
      url: "mywebsite.org",
      date: "5 hours ago",
      status: "low",
      issues: 1,
    },
    {
      url: "testsite.io",
      date: "Yesterday",
      status: "high",
      issues: 8,
    },
  ];

  const recentActivity = [
    {
      type: "scan",
      title: "Website scan completed",
      subtitle: "example.com - 3 issues found",
      time: "2 hours ago",
    },
    {
      type: "chat",
      title: "Chatbot conversation",
      subtitle: "Discussed XSS prevention",
      time: "3 hours ago",
    },
    {
      type: "phishing",
      title: "Phishing email analyzed",
      subtitle: "Detected suspicious email",
      time: "5 hours ago",
    },
    {
      type: "scan",
      title: "Website scan completed",
      subtitle: "mywebsite.org - 1 issue found",
      time: "6 hours ago",
    },
  ];

  const quickActions = [
    {
      title: "Chat with Expert",
      description: "Ask cybersecurity questions",
      icon: MessageSquare,
      action: () => onNavigate("chatbot"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Scan Website",
      description: "Check for vulnerabilities",
      icon: Shield,
      action: () => onNavigate("scan"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Analyze Phishing",
      description: "Detect suspicious emails",
      icon: Mail,
      action: () => onNavigate("phishing"),
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "low":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass rounded-2xl p-8 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Welcome to Cyber Guard</h1>
            <p className="text-muted-foreground">
              Quick scans, expert chat, safer websites.
            </p>
          </div>
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-600 dark:text-green-400">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-3xl mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="glass glass-hover rounded-2xl p-6 text-left hover:border-primary/20 transition-all group bg-card"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-glow`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="mb-2 group-hover:text-primary transition-colors">
                  {action.title}
                </h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scans */}
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Recent Scans
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onNavigate("reports")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentScans.map((scan, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 glass-hover rounded-lg border cursor-pointer"
                  onClick={() => onNavigate("scan")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="mb-1">{scan.url}</p>
                      <p className="text-xs text-muted-foreground">{scan.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(scan.status)}>
                      {scan.issues} {scan.issues === 1 ? "issue" : "issues"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "scan"
                          ? "bg-blue-400"
                          : activity.type === "chat"
                          ? "bg-purple-400"
                          : "bg-orange-400"
                      }`}
                    />
                    {index < recentActivity.length - 1 && (
                      <div className="w-px h-full bg-white/10 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm mb-1">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Tips */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 glass-hover rounded-lg border">
              <h5 className="mb-2">🔒 Enable 2FA</h5>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your accounts with two-factor
                authentication.
              </p>
            </div>
            <div className="p-4 glass-hover rounded-lg border">
              <h5 className="mb-2">🔄 Regular Updates</h5>
              <p className="text-sm text-muted-foreground">
                Keep your software and dependencies up to date to patch known
                vulnerabilities.
              </p>
            </div>
            <div className="p-4 glass-hover rounded-lg border">
              <h5 className="mb-2">🛡️ Use HTTPS</h5>
              <p className="text-sm text-muted-foreground">
                Ensure all your websites use HTTPS with valid SSL certificates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
