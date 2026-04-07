import { ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * ArticleModal — full-detail overlay for a selected news article.
 *
 * @param {object|null} article  - Article to display, or null when closed
 * @param {boolean}     open     - Controlled open state
 * @param {function}    onClose  - Called when the dialog should close
 */
function ArticleModal({ article, open, onClose }) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug pr-6">
            {article.title}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-1">
              {article.publishedBy && (
                <span className="font-medium">{article.publishedBy}</span>
              )}
              {article.author && <span>· by {article.author}</span>}
              {article.publishedAt && <span>· {formatDate(article.publishedAt)}</span>}
            </div>
          </DialogDescription>
        </DialogHeader>

        {article.imageUrl && (
          <div className="rounded-xl overflow-hidden -mx-1">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto object-cover"
              onError={(e) => { e.target.parentElement.classList.add('hidden'); }}
            />
          </div>
        )}

        <div className="space-y-3">
          {article.briefDescription && (
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {article.briefDescription}
            </p>
          )}
          {article.detailDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {/* Strip NewsAPI's "[+N chars]" truncation marker */}
              {article.detailDescription.replace(/\s*\[\+\d+ chars\]$/, '')}
            </p>
          )}
          {!article.briefDescription && !article.detailDescription && (
            <p className="text-sm text-muted-foreground">No description available.</p>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Read full article
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ArticleModal;
