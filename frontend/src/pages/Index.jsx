import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SEO from "@/components/SEO";
import { Monitor, Mic, Video, Download, Cloud, Share2, Shield, Zap, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Screen Recorder with Audio & Webcam"
        description="Record your screen, microphone, and webcam in one place. Upload, manage, and share recordings with ScreenCast Pro."
        path="/"
        keywords="screen recorder, webcam recorder, voice recorder, online screen recording, screencast tool"
      />
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Create & Share</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete solution for recording, managing, and sharing your screen
              recordings with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Monitor className="h-6 w-6" />}
              title="Screen Recording"
              description="Capture your entire screen, specific windows, or browser tabs with crystal-clear quality."
            />
            <FeatureCard
              icon={<Mic className="h-6 w-6" />}
              title="Voice Narration"
              description="Add your voice commentary with high-quality microphone capture and noise reduction."
            />
            <FeatureCard
              icon={<Video className="h-6 w-6" />}
              title="Webcam Overlay"
              description="Include your webcam feed for a personal touch in your presentations."
            />
            <FeatureCard
              icon={<Download className="h-6 w-6" />}
              title="Easy Download"
              description="Download your recordings in WebM format ready for sharing or editing."
            />
            <FeatureCard
              icon={<Cloud className="h-6 w-6" />}
              title="Cloud Storage"
              description="Save recordings to the cloud for easy access from anywhere."
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6" />}
              title="Instant Sharing"
              description="Share your recordings with a single click via link or social media."
            />
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose ScreenCast Pro?
              </h2>
              <div className="space-y-6">
                <BenefitItem
                  icon={<Zap className="h-5 w-5" />}
                  title="No Installation Required"
                  description="Works directly in your browser. No downloads, no plugins, no hassle."
                />
                <BenefitItem
                  icon={<Shield className="h-5 w-5" />}
                  title="Privacy First"
                  description="Your recordings are processed locally. We respect your privacy."
                />
                <BenefitItem
                  icon={<Users className="h-5 w-5" />}
                  title="Perfect for Teams"
                  description="Collaborate and share recordings with your team effortlessly."
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card rounded-2xl border border-border p-8 shadow-2xl">
                <div className="aspect-video bg-muted rounded-xl flex items-center justify-center mb-6">
                  <Monitor className="h-16 w-16 text-muted-foreground/30" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded-full w-3/4" />
                  <div className="h-3 bg-muted rounded-full w-1/2" />
                  <div className="h-3 bg-muted rounded-full w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Recording?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of professionals who use ScreenCast Pro to create
            amazing video content.
          </p>
          <a
            href="/record"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg glow-primary"
          >
            Start Recording Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <span className="font-semibold">ScreenCast Pro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 ScreenCast Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const BenefitItem = ({ icon, title, description }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Index;
