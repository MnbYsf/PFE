import { useState } from "react";
import { Upload, FileText, AlertTriangle, CheckCircle, XCircle, Download, Copy, Globe, Link as LinkIcon, Paperclip, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner@2.0.3";

interface AnalysisResult {
  verdict: "phishing" | "suspicious" | "clean";
  confidence: number;
  sender: {
    email: string;
    reputation: string;
    spoofing: boolean;
  };
  domain: {
    age: string;
    reputation: string;
    registrar: string;
  };
  links: Array<{
    url: string;
    status: "dangerous" | "suspicious" | "safe";
    destination: string;
  }>;
  attachments: Array<{
    name: string;
    type: string;
    status: "dangerous" | "safe";
  }>;
  headers: {
    spf: string;
    dkim: string;
    dmarc: string;
  };
  socialEngineering: string[];
  timeline: Array<{
    time: string;
    event: string;
    location: string;
  }>;
}

export function PhishingAnalyzerPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [emailContent, setEmailContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!emailContent.trim()) {
      toast.error("Please provide email content to analyze");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setResult(null);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20;
      });
    }, 400);

    // Simulate analysis completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);

      const mockResult: AnalysisResult = {
        verdict: "phishing",
        confidence: 90,
        sender: {
          email: "support@paypa1-security.com",
          reputation: "Unknown sender",
          spoofing: true,
        },
        domain: {
          age: "3 days",
          reputation: "Newly registered",
          registrar: "NameCheap Inc.",
        },
        links: [
          {
            url: "https://paypa1-security.com/verify",
            status: "dangerous",
            destination: "Unknown IP: 185.234.52.11",
          },
          {
            url: "https://paypal.com",
            status: "suspicious",
            destination: "Redirects to paypa1-security.com",
          },
        ],
        attachments: [
          {
            name: "invoice.pdf.exe",
            type: "Executable disguised as PDF",
            status: "dangerous",
          },
        ],
        headers: {
          spf: "FAIL",
          dkim: "FAIL",
          dmarc: "FAIL",
        },
        socialEngineering: [
          "Urgent action required language",
          "Threats of account suspension",
          "Requests for password reset",
          "Suspicious payment notification",
        ],
        timeline: [
          {
            time: "2025-11-06 14:23:15",
            event: "Email sent",
            location: "Moscow, Russia",
          },
          {
            time: "2025-11-06 14:23:22",
            event: "Received by mail server",
            location: "Frankfurt, Germany",
          },
          {
            time: "2025-11-06 14:23:25",
            event: "Delivered to inbox",
            location: "Your Location",
          },
        ],
      };

      setResult(mockResult);
      setIsAnalyzing(false);
      toast.success("Analysis complete");
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEmailContent(event.target?.result as string);
        toast.success(`File "${file.name}" loaded`);
      };
      reader.readAsText(file);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "phishing":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "suspicious":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "clean":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "dangerous":
        return "bg-red-500/20 text-red-400";
      case "suspicious":
        return "bg-yellow-500/20 text-yellow-400";
      case "safe":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getHeaderStatusColor = (status: string) => {
    return status === "PASS" ? "text-green-400" : "text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="glass rounded-2xl p-6">
        <h2 className="mb-4">Phishing Email Analyzer</h2>
        <p className="text-white/60 mb-6">
          Upload an email file (EML/MSG) or paste the email content and headers to analyze for phishing indicators.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass mb-4">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste Content</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-white/40 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".eml,.msg,.txt"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-white/40" />
                <p className="mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-white/60">
                  EML, MSG, or TXT files accepted
                </p>
              </label>
            </div>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste email content and headers here...&#10;&#10;From: sender@example.com&#10;To: you@example.com&#10;Subject: Urgent: Verify your account&#10;&#10;Email body..."
              className="glass border-white/20 min-h-[200px] font-mono text-sm"
              rows={12}
            />
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleAnalyze}
            disabled={!emailContent || isAnalyzing}
            className="gradient-primary shadow-glow"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Email"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setEmailContent("")}
            className="glass border-white/20"
          >
            Clear
          </Button>
        </div>

        {isAnalyzing && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Analyzing email...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      {/* Results */}
      {result && !isAnalyzing && (
        <>
          {/* Verdict Card */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-xl ${getVerdictColor(result.verdict)}`}>
                  {result.verdict === "phishing" ? (
                    <XCircle className="w-8 h-8" />
                  ) : result.verdict === "suspicious" ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <CheckCircle className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h2 className="mb-2">
                    {result.verdict === "phishing"
                      ? "Likely Phishing"
                      : result.verdict === "suspicious"
                      ? "Suspicious Email"
                      : "Clean Email"}
                  </h2>
                  <p className="text-white/60">
                    Confidence: {result.confidence}%
                  </p>
                  <Badge className={`mt-2 ${getVerdictColor(result.verdict)}`}>
                    {result.verdict.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="glass border-white/20">
                  Mark as Phishing
                </Button>
                <Button size="sm" variant="outline" className="glass border-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Analysis Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sender Analysis */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Sender Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-white/60 mb-1">Email Address</p>
                  <div className="flex items-center justify-between">
                    <code className="text-sm bg-black/20 px-2 py-1 rounded">
                      {result.sender.email}
                    </code>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Reputation</p>
                  <Badge variant="secondary" className="bg-white/10">
                    {result.sender.reputation}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Spoofing Detection</p>
                  <Badge
                    className={
                      result.sender.spoofing
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }
                  >
                    {result.sender.spoofing ? "Spoofing Detected" : "No Spoofing"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Domain Analysis */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Domain Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-white/60 mb-1">Domain Age</p>
                  <Badge
                    className={
                      result.domain.age.includes("days")
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }
                  >
                    {result.domain.age}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Reputation</p>
                  <Badge variant="secondary" className="bg-white/10">
                    {result.domain.reputation}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Registrar</p>
                  <p className="text-sm">{result.domain.registrar}</p>
                </div>
              </CardContent>
            </Card>

            {/* Email Headers */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Authentication Headers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">SPF</span>
                  <Badge className={getHeaderStatusColor(result.headers.spf)}>
                    {result.headers.spf}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">DKIM</span>
                  <Badge className={getHeaderStatusColor(result.headers.dkim)}>
                    {result.headers.dkim}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">DMARC</span>
                  <Badge className={getHeaderStatusColor(result.headers.dmarc)}>
                    {result.headers.dmarc}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Social Engineering Indicators */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Social Engineering Cues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.socialEngineering.map((cue, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-red-400">⚠</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Links Analysis */}
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Links Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.links.map((link, index) => (
                  <div
                    key={index}
                    className="glass-hover p-4 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <code className="text-sm bg-black/20 px-2 py-1 rounded flex-1 mr-4 break-all">
                        {link.url}
                      </code>
                      <Badge className={getStatusColor(link.status)}>
                        {link.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60">
                      Destination: {link.destination}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {result.attachments.length > 0 && (
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="w-5 h-5" />
                  Attachments Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 glass-hover rounded-lg border border-white/10"
                    >
                      <div>
                        <p className="mb-1">{attachment.name}</p>
                        <p className="text-sm text-white/60">{attachment.type}</p>
                      </div>
                      <Badge className={getStatusColor(attachment.status)}>
                        {attachment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Email Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#6A5AF9]" />
                      {index < result.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-white/20 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm">{event.event}</p>
                      <p className="text-xs text-white/60">{event.time}</p>
                      <p className="text-xs text-white/60">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
