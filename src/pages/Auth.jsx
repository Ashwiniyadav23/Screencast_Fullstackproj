import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useToast } from "@/hooks/use-toast.jsx";
import { Video, Mail, Lock, User, Loader2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (!isLogin) {
      const nameResult = nameSchema.safeParse(fullName);
      if (!nameResult.success) {
        newErrors.name = nameResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        // Trim whitespace from email and password
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        console.log("Login attempt with email:", trimmedEmail);

        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        console.log("Login response:", { data, error });

        if (error) {
          console.error("Login error:", error);
          
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login Failed",
              description: "Invalid email or password. Please check and try again.",
              variant: "destructive",
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email Not Confirmed",
              description: "Please confirm your email before logging in. Check your inbox for a confirmation email.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login Failed",
              description: error.message || "An error occurred during login.",
              variant: "destructive",
            });
          }
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/record");
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        console.log("Signup attempt with email:", trimmedEmail);
        
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            },
          },
        });

        console.log("Signup response:", { data, error });

        if (error) {
          console.error("Signup error:", error);
          
          if (error.message.includes("User already registered")) {
            toast({
              title: "Account Exists",
              description: "An account with this email already exists. Please login instead.",
              variant: "destructive",
            });
            setIsLogin(true);
          } else if (error.message.includes("email rate limit")) {
            toast({
              title: "Too Many Signup Attempts",
              description: "You've tried signing up too many times with this email. Please try again in 1-2 hours or use a different email address.",
              variant: "destructive",
            });
          } else if (error.message.includes("Password")) {
            toast({
              title: "Signup Failed",
              description: "Password must be at least 6 characters.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Signup Failed",
              description: error.message || "Failed to create account.",
              variant: "destructive",
            });
          }
          return;
        }

        // Check if email confirmation is required
        if (data?.user?.identities?.length === 0) {
          toast({
            title: "Account Created!",
            description: "Please check your email to confirm your account before login.",
            variant: "default",
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to ScreenCast Pro!",
          });
          navigate("/record");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4">
        <a href="/" className="flex items-center gap-2 w-fit">
          <Video className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">ScreenCast Pro</span>
        </a>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Sign in to continue to ScreenCast Pro"
                  : "Sign up to start recording"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
