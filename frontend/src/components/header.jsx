import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import nfuLogo from "@/assets/NFU_logo.png";
const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Contribute", href: "#contribute" },
    { label: "Contact-Us", href: "#footer" }
];
export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    function handleNavClick(e, href) {
        e.preventDefault();
        setMobileMenuOpen(false);
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    return (<header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 p-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src={nfuLogo} alt="NewsForU logo" className="h-15 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (<a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </a>))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>
            {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (<div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (<a key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1" onClick={(e) => handleNavClick(e, link.href)}>
                  {link.label}
                </a>))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
                <Button variant="ghost" size="sm" className="justify-start text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>)}
      </div>
    </header>);
}
