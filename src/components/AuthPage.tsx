import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Shield, Mail, Lock, User, Building, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface AuthPageProps {
  onSignIn: (user: any) => void;
}

export function AuthPage({ onSignIn }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    rememberMe: false,
    acceptTos: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "" };
    if (password.length < 6) return { strength: 25, label: "Weak" };
    if (password.length < 10) return { strength: 50, label: "Fair" };
    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(password))
      return { strength: 50, label: "Fair" };
    return { strength: 100, label: "Strong" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignUp) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      if (!formData.acceptTos) {
        newErrors.acceptTos = "You must accept the terms of service";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (isSignUp) {
          setShowOnboarding(true);
        } else {
          toast.success("Successfully signed in!");
          onSignIn({
            name: formData.name || "Youssef Mounib",
            email: formData.email,
            avatar: "",
          });
        }
      }, 1500);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Successfully signed in with Google!");
      onSignIn({
        name: "Youssef Mounib",
        email: "youssef.mounib@example.com",
        avatar: "",
      });
    }, 1500);
  };

  const handleOnboardingChoice = (choice: string) => {
    setShowOnboarding(false);
    toast.success(`Welcome! We've set up your experience for ${choice}.`);
    onSignIn({
      name: formData.name,
      email: formData.email,
      avatar: "",
    });
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gradient mb-2">Cyber Guard</h1>
          <p className="text-muted-foreground">
            Bite-size security tools & expert chat
          </p>
        </div>

        {/* Auth Form */}
        <div className="glass rounded-2xl p-8 shadow-xl bg-card">
          <div className="mb-6 text-center">
            <h2 className="mb-2">{isSignUp ? "Create Account" : "Sign In"}</h2>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Join Cyber Guard to protect your digital assets"
                : "Welcome back to Cyber Guard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`pl-10 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`pl-10 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`pl-10 pr-20 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
              {isSignUp && formData.password && (
                <div className="space-y-1">
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength.strength === 100
                          ? "bg-green-500"
                          : passwordStrength.strength >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="company"
                    type="text"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, rememberMe: checked as boolean })
                    }
                  />
                  <Label htmlFor="remember" className="cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-[#6A5AF9] hover:text-[#5B21B6]"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {isSignUp && (
              <div className="flex items-start gap-2">
                <Checkbox
                  id="tos"
                  checked={formData.acceptTos}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, acceptTos: checked as boolean })
                  }
                />
                <Label htmlFor="tos" className="cursor-pointer text-sm">
                  I accept the{" "}
                  <span className="text-[#6A5AF9]">Terms of Service</span> and{" "}
                  <span className="text-[#6A5AF9]">Privacy Policy</span>
                </Label>
              </div>
            )}
            {errors.acceptTos && (
              <p className="text-xs text-red-400">{errors.acceptTos}</p>
            )}

            <Button
              type="submit"
              className="w-full gradient-primary shadow-glow hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 py-1 rounded-full bg-background">
                  Or continue with Google
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <span className="text-primary">Sign in</span>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <span className="text-primary">Sign up</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to Cyber Guard! 🎉</DialogTitle>
            <DialogDescription>
              Help us customize your experience. What best describes you?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            <Button
              onClick={() => handleOnboardingChoice("developers")}
              variant="outline"
              className="justify-start"
            >
              👨‍💻 I'm a Developer
            </Button>
            <Button
              onClick={() => handleOnboardingChoice("site owners")}
              variant="outline"
              className="justify-start"
            >
              🌐 I'm a Site Owner
            </Button>
            <Button
              onClick={() => handleOnboardingChoice("learners")}
              variant="outline"
              className="justify-start"
            >
              📚 I'm a Cybersecurity Learner
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}