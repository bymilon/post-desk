import React, { useState, useEffect } from 'react';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot, 
  InputOTPSeparator 
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Lock, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';

export function PinAuth({ 
  children, 
  onBackToPublic 
}: { 
  children: React.ReactNode; 
  onBackToPublic?: () => void;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // start true to prevent flash
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // Hardcoded required PIN logic or default. Can use Vite env.
  const requiredPin = import.meta.env.VITE_ACCESS_PIN || '123456';

  useEffect(() => {
    setMounted(true);
    const storedAuth = localStorage.getItem('app-pin-auth');
    if (storedAuth !== requiredPin) {
      setIsAuthenticated(false);
    }

    // Comprehensive check for demo env/mode
    const isDemoMode = 
      import.meta.env.MODE === 'demo' || 
      import.meta.env.VITE_APP_MODE === 'demo' || 
      import.meta.env.VITE_DEMO === 'true' ||
      import.meta.env.VITE_APP_ENV === 'demo' ||
      window.location.search.includes('demo=true') ||
      window.location.hostname.includes('demo') ||
      window.location.pathname.includes('/demo');
    setIsDemo(isDemoMode);
  }, [requiredPin]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === requiredPin) {
      localStorage.setItem('app-pin-auth', pin);
      setError(false);
      setIsAuthenticated(true);
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleComplete = (value: string) => {
    if (value === requiredPin) {
      localStorage.setItem('app-pin-auth', value);
      setError(false);
      setIsAuthenticated(true);
    } else {
      setPin('');
      setError(true);
    }
  };

  if (!mounted) {
    return null; // avoid SSR/hydration flash
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-foreground transition-all duration-300">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full animate-fade-in p-6 bg-card/45 backdrop-blur-md rounded-2xl border border-border/30 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight flex items-center justify-center gap-2">
            Workspace Access
            {isDemo && (
              <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/15 tracking-wider select-none">
                Demo
              </span>
            )}
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter the 6-digit access PIN to unlock the internal tools workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full gap-4">
          <div className="my-2">
            <InputOTP 
              maxLength={6} 
              value={pin}
              onChange={setPin}
              onComplete={handleComplete}
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {isDemo && (
            <button
              type="button"
              onClick={() => {
                setPin(requiredPin);
                handleComplete(requiredPin);
              }}
              className="text-xs text-muted-foreground/90 hover:text-foreground transition-colors py-1.5 px-3 bg-muted/40 hover:bg-muted/65 border border-border/15 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer max-w-full animate-pulse hover:animate-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Use Demo PIN: </span>
              <code className="font-mono bg-background px-1.5 py-0.5 rounded border border-border/25 text-[11px] font-bold text-primary">{requiredPin}</code>
            </button>
          )}

          {error && (
            <div className="flex items-center gap-1.5 text-[11px] text-destructive animate-fade-in font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Access denied. Incorrect PIN.</span>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full mt-2" 
            disabled={pin.length !== 6}
          >
            Unlock Workspace
          </Button>

          {onBackToPublic && (
            <button
              type="button"
              onClick={onBackToPublic}
              className="text-xs text-muted-foreground hover:text-foreground mt-3 flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Public Site</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
