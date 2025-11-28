import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, XCircle, Download, ChevronDown, ChevronUp, ExternalLink, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Vulnerability {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  evidence: string;
  recommendation: string;
  cve?: string;
  expanded?: boolean;
}

export function ScanWebsitesPage() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanDepth, setScanDepth] = useState("quick");
  const [results, setResults] = useState<{
    score: number;
    risk: string;
    vulnerabilities: Vulnerability[];
    summary: string[];
  } | null>(null);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleScan = async () => {
    if (!validateUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setResults(null);

    // Simulate scan progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate scan completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setScanProgress(100);
      
      const mockResults = {
        score: 62,
        risk: "Medium",
        summary: [
          "Missing security headers detected",
          "Outdated JavaScript libraries found",
          "SSL/TLS configuration could be improved",
        ],
        vulnerabilities: [
          {
            id: "1",
            title: "Missing Content Security Policy (CSP)",
            severity: "high" as const,
            description: "The website does not implement a Content Security Policy header, leaving it vulnerable to XSS attacks.",
            evidence: "HTTP Response Headers:\nNo 'Content-Security-Policy' header found",
            recommendation: "Implement a strict CSP header:\nContent-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline';",
            cve: undefined,
          },
          {
            id: "2",
            title: "Outdated jQuery Library",
            severity: "medium" as const,
            description: "The website uses jQuery version 2.1.4 which has known security vulnerabilities.",
            evidence: "Found: jquery-2.1.4.min.js\nKnown CVEs: CVE-2020-11022, CVE-2020-11023",
            recommendation: "Update to jQuery 3.6.0 or later:\nnpm update jquery",
            cve: "CVE-2020-11022",
          },
          {
            id: "3",
            title: "Missing X-Frame-Options Header",
            severity: "medium" as const,
            description: "The X-Frame-Options header is not set, making the site vulnerable to clickjacking attacks.",
            evidence: "HTTP Response Headers:\nNo 'X-Frame-Options' header found",
            recommendation: "Add the following header:\nX-Frame-Options: DENY",
          },
          {
            id: "4",
            title: "TLS 1.0 Enabled",
            severity: "low" as const,
            description: "The server supports TLS 1.0, which is deprecated and considered insecure.",
            evidence: "Supported protocols: TLS 1.0, TLS 1.1, TLS 1.2, TLS 1.3",
            recommendation: "Disable TLS 1.0 and TLS 1.1. Use only TLS 1.2 and TLS 1.3.",
          },
        ],
      };

      setResults(mockResults);
      setIsScanning(false);
      toast.success("Scan complete — 4 issues found");
    }, 3000);
  };

  const toggleVulnerability = (id: string) => {
    if (results) {
      setResults({
        ...results,
        vulnerabilities: results.vulnerabilities.map((vuln) =>
          vuln.id === id ? { ...vuln, expanded: !vuln.expanded } : vuln
        ),
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <XCircle className="w-5 h-5" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5" />;
      case "low":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getRiskScore = (score: number) => {
    if (score >= 80) return { label: "Low", color: "text-green-400" };
    if (score >= 60) return { label: "Medium", color: "text-yellow-400" };
    if (score >= 40) return { label: "High", color: "text-orange-400" };
    return { label: "Critical", color: "text-red-400" };
  };

  const severityCounts = results?.vulnerabilities.reduce(
    (acc, vuln) => {
      acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Scan Input */}
      <div className="glass rounded-2xl p-6 bg-card">
        <h2 className="mb-4">Website Security Scanner</h2>
        <p className="text-muted-foreground mb-6">
          Enter a website URL to scan for vulnerabilities, security headers, outdated dependencies, and misconfigurations.
        </p>

        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="https://example.com"
              className="pl-10 glass border-white/20"
            />
          </div>
          <Select value={scanDepth} onValueChange={setScanDepth}>
            <SelectTrigger className="w-48 glass border-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              <SelectItem value="quick">Quick Scan</SelectItem>
              <SelectItem value="full">Full Scan</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleScan}
            disabled={!url || isScanning}
            className="gradient-primary shadow-glow px-8"
          >
            {isScanning ? "Scanning..." : "Scan Now"}
          </Button>
        </div>

        {isScanning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Scanning in progress...</span>
              <span>{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
        )}

        {!results && !isScanning && (
          <div className="mt-8 text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60 mb-4">Paste a website URL to start scanning</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUrl("https://example.com")}
                className="glass border-white/20"
              >
                example.com
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUrl("https://mywebsite.com")}
                className="glass border-white/20"
              >
                mywebsite.com
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUrl("https://testsite.org")}
                className="glass border-white/20"
              >
                testsite.org
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results && !isScanning && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Security Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <span className="text-4xl">{results.score}</span>
                  <span className="text-white/60 mb-1">/100</span>
                </div>
                <Badge className={`mt-2 ${getSeverityColor(results.risk.toLowerCase())}`}>
                  {getRiskScore(results.score).label} Risk
                </Badge>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Issues Found</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl mb-3">{results.vulnerabilities.length}</div>
                <div className="flex gap-2 flex-wrap">
                  {severityCounts?.critical && (
                    <Badge className={getSeverityColor("critical")}>
                      {severityCounts.critical} Critical
                    </Badge>
                  )}
                  {severityCounts?.high && (
                    <Badge className={getSeverityColor("high")}>
                      {severityCounts.high} High
                    </Badge>
                  )}
                  {severityCounts?.medium && (
                    <Badge className={getSeverityColor("medium")}>
                      {severityCounts.medium} Medium
                    </Badge>
                  )}
                  {severityCounts?.low && (
                    <Badge className={getSeverityColor("low")}>
                      {severityCounts.low} Low
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.summary.slice(0, 3).map((item, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-white/40">•</span>
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>Vulnerability Details</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="glass border-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  PDF Report
                </Button>
                <Button size="sm" variant="outline" className="glass border-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  JSON
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {results.vulnerabilities.map((vuln) => (
                <div
                  key={vuln.id}
                  className="glass-hover border border-white/10 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleVulnerability(vuln.id)}
                    className="w-full p-4 flex items-start gap-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${getSeverityColor(vuln.severity)}`}>
                      {getSeverityIcon(vuln.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="mb-1">{vuln.title}</h4>
                          <p className="text-sm text-white/60">{vuln.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getSeverityColor(vuln.severity)}>
                            {vuln.severity.toUpperCase()}
                          </Badge>
                          {vuln.expanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {vuln.expanded && (
                    <div className="border-t border-white/10 p-4 bg-black/20 space-y-4">
                      <div>
                        <h5 className="mb-2">Evidence</h5>
                        <pre className="bg-black/30 p-3 rounded-lg text-xs text-white/80 overflow-x-auto">
                          {vuln.evidence}
                        </pre>
                      </div>
                      <div>
                        <h5 className="mb-2">Recommended Action</h5>
                        <pre className="bg-black/30 p-3 rounded-lg text-xs text-white/80 overflow-x-auto">
                          {vuln.recommendation}
                        </pre>
                      </div>
                      {vuln.cve && (
                        <div>
                          <a
                            href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${vuln.cve}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-[#6A5AF9] hover:text-[#5B21B6]"
                          >
                            View {vuln.cve} Details
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
