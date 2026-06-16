import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ALL_INTERESTS } from '@/lib/constants';
import { api } from '@/lib/api';

/**
 * Modal dialog for viewing and updating user interests.
 *
 * Props:
 *  - open          boolean
 *  - currentInterests  string[]  — interests already saved on the user
 *  - onClose       () => void
 *  - onSaved       (newInterests: string[]) => void  — called after a successful save
 */
export default function InterestsDialog({ open, currentInterests, onClose, onSaved }) {
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync local selection whenever the dialog opens or the user's interests change
  useEffect(() => {
    if (open) {
      setSelected(currentInterests ?? []);
      setError('');
    }
  }, [open, currentInterests]);

  function toggleInterest(id) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  async function handleSave() {
    setError('');
    if (selected.length < 1) {
      setError('Please select at least 1 interest.');
      return;
    }
    setIsSaving(true);
    try {
      const data = await api.post('/api/auth/register/interests', { interests: selected });
      onSaved?.(data.interests ?? selected);
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Update your interests</DialogTitle>
          <DialogDescription>Pick 1 to 4 topics to personalize your feed.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2.5">
          {ALL_INTERESTS.map(({ id, label, icon: Icon, color, iconColor, border }) => {
            const isSelected = selected.includes(id);
            const isDisabled = !isSelected && selected.length >= 4;
            return (
              <button
                key={id}
                type="button"
                disabled={isDisabled}
                onClick={() => toggleInterest(id)}
                className={`relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200
                  ${isSelected ? `bg-gradient-to-br ${color} ${border} border` : 'border-border/60 bg-background/40 hover:border-border hover:bg-background/80'}
                  ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                    ${isSelected ? 'bg-white/10' : 'bg-muted'}`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isSelected ? iconColor : 'text-muted-foreground'}`} />
                </div>
                <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </span>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || selected.length < 1}
            className="gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save interests'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
