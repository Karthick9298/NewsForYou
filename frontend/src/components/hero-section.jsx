import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailDigestMockup } from "./email-digest-mockup";
import { useNavigate, Link } from "react-router-dom";

export function HeroSection() {
    const navigate = useNavigate();

    return (<section className="min-h-screen flex items-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none"/>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.10),transparent_50%)] pointer-events-none"/>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
        }}/>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mx-auto lg:mx-0">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/>
              <span className="text-sm text-primary font-medium">
                Your news. Your way. Every morning.
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight text-balance">
                Your Daily News,{" "}
                <span className="text-primary">Curated Just For You</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl text-pretty mx-auto lg:mx-0">
                NewsForU fetches the latest Indian and world news every morning, 
                summarises it with AI, and delivers a personalised digest to your 
                inbox — based on what you actually care about.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12 text-base"
                 onClick={() => navigate('/register')} >
                Get Your Free Digest
                <ArrowRight className="ml-2 w-4 h-4"/>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-4 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (<div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {String.fromCharCode(64 + i)}
                  </div>))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">10,000+</span> readers get their digest daily
              </div>
            </div>
          </div>

          {/* Right side - Mockup */}
          <div className="relative flex justify-center lg:justify-center lg:pl-0 lg:pr-8">
            <EmailDigestMockup />
          </div>
        </div>
      </div>
    </section>);
}
