import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Video, Menu, X, LogOut, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth.jsx";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/record", label: "Record" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  // Monitor recording state across tabs
  useEffect(() => {
    const checkRecordingStatus = () => {
      const recording = localStorage.getItem("isRecording") === "true";
      setIsRecording(recording);
    };

    // Check initial state
    checkRecordingStatus();

    // Listen to storage changes (e.g., from other tabs)
    window.addEventListener("storage", checkRecordingStatus);

    // Also poll every second to catch local changes
    const interval = setInterval(checkRecordingStatus, 1000);

    return () => {
      window.removeEventListener("storage", checkRecordingStatus);
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      {/* Recording Indicator Banner */}
      {isRecording && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-recording/90 backdrop-blur-sm border-b border-recording text-recording-foreground animate-pulse">
          <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
            <Circle className="h-2 w-2 fill-current animate-pulse" />
            Recording in progress on another tab...
            <Circle className="h-2 w-2 fill-current animate-pulse" />
          </div>
        </div>
      )}

      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 transition-all",
        isRecording && "top-8 md:top-10"
      )}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg group-hover:bg-primary/30 transition-colors" />
                <div className="relative bg-primary rounded-lg p-2">
                  <Video className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <span className="text-xl font-bold">
                ScreenCast<span className="text-primary">Pro</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary py-2",
                      location.pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                  {user ? (
                    <>
                      <span className="text-sm text-muted-foreground py-2">
                        {user.email}
                      </span>
                      <Button variant="ghost" size="sm" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/auth">Sign In</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link to="/auth">Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
