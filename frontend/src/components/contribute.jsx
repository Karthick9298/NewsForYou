import { Github, GitPullRequest, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ways = [
  {
    icon: GitPullRequest,
    title: "Submit a Pull Request",
    description: "Found a bug or want to add a feature? Fork the repo and open a PR — all contributions are welcome.",
  },
  {
    icon: Star,
    title: "Star the Repo",
    description: "Give us a star on GitHub to help others discover the project and keep us motivated.",
  },
  {
    icon: Github,
    title: "Raise an Issue",
    description: "Have a feature idea or spotted something broken? Open an issue and let's talk about it.",
  },
];

export function Contribute() {
  return (
    <section id="contribute" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.07),transparent_60%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <Github className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm text-primary font-medium">Open Source</span>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Built in the open.{" "}
                <span className="text-primary">Improved together.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                NewsForU is fully open source. Whether you are a developer, designer,
                or just a news enthusiast — you can help make it better for everyone.
                Every line of code is on GitHub and every idea is welcome.
              </p>
            </div>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12 text-base"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <Github className="mr-2 w-4 h-4" />
              View on GitHub
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Right — cards (desktop only) */}
          <div className="hidden lg:block space-y-4">
            {ways.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
