import { useState } from "react";
import { Github, Twitter, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import nfuLogo from "@/assets/NFU_logo.png";

export function Footer() {
  const [form, setForm] = useState({ email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire to backend
    setSent(true);
    setForm({ email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <footer id = "footer"className="border-t border-border bg-card/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.04),transparent_60%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Col 1 — brand */}
          <div className="space-y-5">
            <a href="/" className="inline-block">
              <img src={nfuLogo} alt="NewsForU" className="h-8 w-auto" />
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your personalised morning news digest, powered by AI. Stay informed
              without the noise.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@newsforu.in"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 — contact form */}
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-3">
                <Mail className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary font-medium">Contact Us</span>
              </div>
              <h4 className="font-serif text-lg font-semibold text-foreground">
                Get in touch
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Questions, feedback, or just want to say hi? We read every message.
              </p>
            </div>

            {sent ? (
              <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary font-medium">
                ✓ Message sent — we'll get back to you soon!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Your message…"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-9"
                >
                  Send Message
                  <Send className="ml-2 w-3.5 h-3.5" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NewsForU. Open source under the MIT License.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ♥ for curious minds everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
