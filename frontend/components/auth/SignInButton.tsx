import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SignInButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function SignInButton({ 
  className = '',
  children 
}: SignInButtonProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      signIn(email);
      setIsOpen(false);
      setEmail('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          {children || (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Demo mode - enter any email to sign in
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
