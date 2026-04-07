import { useState } from 'react';
import { Newspaper } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * ArticleCard — grid card showing thumbnail, title, description, and metadata.
 *
 * @param {object}   article  - NewsArticle document from the API
 * @param {function} onClick  - Called with the article when the card is clicked
 */
function ArticleCard({ article, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onClick(article)}
      className="group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail */}
      {article.imageUrl && !imageError ? (
        <div className="aspect-video overflow-hidden shrink-0 relative bg-muted">
          {/* Skeleton shown while image is loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={article.imageUrl}
            alt={article.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
          <Newspaper className="w-10 h-10 text-primary/30" />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {article.title}
        </h3>
        {article.briefDescription && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
            {article.briefDescription}
          </p>
        )}
        <div className="mt-auto space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {article.publishedBy && (
              <span className="font-medium text-foreground/70 truncate">{article.publishedBy}</span>
            )}
            {article.publishedBy && article.publishedAt && <span>·</span>}
            {article.publishedAt && (
              <span className="shrink-0">{formatDate(article.publishedAt)}</span>
            )}
          </div>
          {article.author && (
            <p className="text-xs text-muted-foreground truncate">by {article.author}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;
