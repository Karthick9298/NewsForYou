import { Globe, Clock } from "lucide-react";
import rbiImg from "@/assets/feedcard_rbi.jpeg";
import isroImg from "@/assets/feedcard_isro.webp";
import globalImg from "@/assets/feedcard_global.jpg";
const articles = [
    {
        section: "india",
        flag: "🇮🇳",
        image: rbiImg,
        title: "RBI Holds Interest Rates Steady Amid Global Uncertainty",
        summary: "The Reserve Bank maintains repo rate at 6.5% for the eighth consecutive meeting, citing stable inflation outlook...",
        time: "2h ago",
    },
    {
        section: "india",
        flag: "🇮🇳",
        image: isroImg,
        title: "ISRO Announces Mars Mission Update",
        summary: "India's space agency reveals timeline for Mangalyaan-2, promising enhanced scientific capabilities...",
        time: "4h ago",
    },
    {
        section: "world",
        icon: "globe",
        image: globalImg,
        title: "Global Tech Leaders Gather at Davos Summit",
        summary: "AI regulation and climate finance dominate discussions as world leaders seek common ground on key issues...",
        time: "5h ago",
    },
];

const today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
});

export function EmailDigestMockup() {
    return (<div className="relative w-full max-w-md">
      {/* Email client frame */}
      <div className="rounded-xl border border-border bg-card shadow-2xl shadow-primary/5 overflow-hidden">
        {/* Email header */}
        <div className="border-b border-border bg-secondary/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"/>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"/>
              <div className="w-3 h-3 rounded-full bg-green-500/80"/>
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-muted-foreground font-sans">Inbox</span>
            </div>
          </div>
        </div>

        {/* Email content */}
        <div className="p-4">
          {/* Email meta */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-serif font-bold text-sm">N</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">NewsForU</p>
                  <p className="text-xs text-muted-foreground">digest@newsforu.in</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3"/>
              <span>7:00 AM</span>
            </div>
          </div>

          {/* Subject */}
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
            Your Morning Digest — {formattedDate}
          </h3>

          {/* Article cards */}
          <div className="space-y-3">
            {articles.map((article, index) => (<div key={index} className="group rounded-lg border border-border bg-secondary/20 p-3 hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-20 h-16 rounded-md bg-secondary flex-shrink-0 overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover object-top"/>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Section indicator */}
                    <div className="flex items-center gap-1.5 mb-1">
                      {article.section === "india" ? (<span className="text-sm">{article.flag}</span>) : (<Globe className="w-3.5 h-3.5 text-primary"/>)}
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        {article.section === "india" ? "India" : "World"}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h4 className="text-sm font-semibold text-foreground leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h4>
                    
                    {/* Summary */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                </div>
              </div>))}
          </div>

          {/* Footer hint */}
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              + 5 more stories tailored for you
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"/>
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl"/>
    </div>);
}
