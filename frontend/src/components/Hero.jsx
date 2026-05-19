import { Link } from "react-router-dom";
import { ArrowRight, Monitor, Mic, Video, Play, Sparkles, Zap, Shield, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-float opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-float opacity-60" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse opacity-30" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-16 animate-bounce-in opacity-70" style={{ animationDelay: "1s" }}>
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Monitor className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="absolute top-48 right-20 animate-bounce-in opacity-70" style={{ animationDelay: "1.5s" }}>
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Video className="h-5 w-5 text-accent" />
          </div>
        </div>
        <div className="absolute bottom-32 left-32 animate-bounce-in opacity-70" style={{ animationDelay: "2s" }}>
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Mic className="h-4 w-4 text-green-500" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Enhanced Badge with Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-strong text-primary text-sm font-medium animate-fade-in">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              New: AI-powered editing tools
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Star className="h-3 w-3 mr-1" />
                4.9/5 Rating
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Users className="h-3 w-3 mr-1" />
                10K+ Users
              </Badge>
            </div>
          </div>

          {/* Enhanced Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 animate-slide-up leading-none">
            <span className="inline-block">Record</span>{" "}
            <span className="inline-block">Your</span>{" "}
            <span className="inline-block">Screen</span>
            <br />
            <span className="gradient-text animate-gradient bg-gradient-to-r from-primary via-accent to-primary bg-clip-text">
              Like a Pro
            </span>
          </h1>

          {/* Enhanced Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            Create stunning screen recordings with{" "}
            <span className="text-primary font-semibold">advanced editing tools</span>,{" "}
            <span className="text-accent font-semibold">instant cloud storage</span>, and{" "}
            <span className="text-green-600 font-semibold">seamless sharing</span>.
            Perfect for tutorials, presentations, and demos.
          </p>

          {/* Enhanced CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="lg" className="h-16 px-12 text-lg glow-primary group">
              <Link to="/record">
                <Zap className="h-6 w-6 mr-2 group-hover:animate-bounce" />
                Start Recording Now
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="lg" className="h-16 px-8 text-lg">
                <Link to="/dashboard">
                  <Play className="h-5 w-5 mr-2" />
                  View Dashboard
                </Link>
              </Button>
              <div className="text-sm text-muted-foreground">
                <div className="font-medium">Free to start</div>
                <div>No credit card required</div>
              </div>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <FeatureCard
              icon={<Monitor className="h-7 w-7" />}
              title="HD Screen Capture"
              description="Record in crystal-clear HD quality with 60fps support"
              color="primary"
            />
            <FeatureCard
              icon={<Mic className="h-7 w-7" />}
              title="Audio Recording"
              description="Capture multiple audio sources with noise cancellation"
              color="accent"
            />
            <FeatureCard
              icon={<Video className="h-7 w-7" />}
              title="Webcam Overlay"
              description="Add professional webcam overlays with custom positioning"
              color="green"
            />
            <FeatureCard
              icon={<Shield className="h-7 w-7" />}
              title="Secure Storage"
              description="End-to-end encrypted cloud storage with instant access"
              color="blue"
            />
          </div>

          {/* Social Proof */}
          <div className="mt-20 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <p className="text-sm text-muted-foreground mb-6">Trusted by creators worldwide</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-2xl font-bold">10K+</div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-2xl font-bold">50M+</div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-2xl font-bold">4.9★</div>
            </div>
            <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground mt-2">
              <div>ACTIVE USERS</div>
              <div>RECORDINGS MADE</div>
              <div>USER RATING</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary group-hover:bg-primary/20 border-primary/20",
    accent: "bg-accent/10 text-accent group-hover:bg-accent/20 border-accent/20",
    green: "bg-green-500/10 text-green-600 group-hover:bg-green-500/20 border-green-500/20",
    blue: "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20 border-blue-500/20",
  };

  return (
    <div className="group p-8 rounded-3xl glass-strong hover-lift hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-300 border ${colorClasses[color]}`}>
        {icon}
      </div>
      
      <h3 className="relative text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="relative text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default Hero;
