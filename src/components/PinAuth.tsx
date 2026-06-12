import React, { useState, useEffect } from 'react';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot, 
  InputOTPSeparator 
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Lock, ShieldAlert } from 'lucide-react';

export function PinAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // start true to prevent flash
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hardcoded required PIN logic or default. Can use Vite env.
  const requiredPin = import.meta.env.VITE_ACCESS_PIN || '123456';

  useEffect(() => {
    setMounted(true);
    const storedAuth = localStorage.getItem('app-pin-auth');
    if (storedAuth !== requiredPin) {
      setIsAuthenticated(false);
    }
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
          <h1 className="text-xl font-bold tracking-tight">Workspace Access</h1>
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
        </form>
      </div>
    </div>
  );
}
