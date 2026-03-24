import { UserCircle, Cpu, Mail, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: UserCircle,
    step: "01",
    title: "Tell Us What You Care About",
    description:
      "Pick your topics — politics, tech, sports, markets, science and more. Set the categories once and we remember your preferences forever.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Reads the Web For You",
    description:
      "Every morning our engine scans hundreds of trusted Indian and global sources, filters the noise, and summarises only the stories that match your interests.",
  },
  {
    icon: Mail,
    step: "03",
    title: "Digest Lands in Your Inbox",
    description:
      "By 7 AM you get a clean, scannable email — headlines, one-line summaries, and a read-more link. No app to open, no algorithm to fight.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Subtle background tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.05),transparent_70%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Simple as 1 – 2 – 3</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            How <span className="text-primary">NewsForU</span> Works
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From raw headlines to your personalised digest in three effortless steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative group">
                {/* Connector arrow — hidden on last item and mobile */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-8 left-[calc(100%-1rem)] z-10 items-center">
                    <ArrowRight className="w-5 h-5 text-primary/40" />
                  </div>
                )}

                <div className="rounded-xl border border-border bg-card p-6 space-y-4 h-full hover:border-primary/30 transition-colors">
                  {/* Step number + icon */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-serif text-3xl font-bold text-primary/20 leading-none">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-foreground">
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
    </section>
  );
}
