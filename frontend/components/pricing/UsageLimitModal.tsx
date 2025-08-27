import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Crown, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import SignInButton from '../auth/SignInButton';

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  operation: string;
  remaining: number;
  limit: number;
}

export default function UsageLimitModal({
  isOpen,
  onClose,
  onUpgrade,
  operation,
  remaining,
  limit
}: UsageLimitModalProps) {
  const { isSignedIn } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-orange-100 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <DialogTitle className="text-xl">Usage Limit Reached</DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-3">
            <p>
              You've reached your {operation} processing limit of {limit} operations.
            </p>
            {!isSignedIn ? (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium mb-2">
                  Sign up for free to get more operations!
                </p>
                <p className="text-blue-700 text-sm">
                  Create a free account to get 100 image operations, 10 video conversions, and more features.
                </p>
              </div>
            ) : (
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-purple-800 font-medium mb-2">
                  Upgrade to continue processing
                </p>
                <p className="text-purple-700 text-sm">
                  Get unlimited access to all tools with our premium plans starting at just $9.99/month.
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 mt-6">
          {!isSignedIn ? (
            <>
              <SignInButton 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                Sign Up Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </SignInButton>
              <Button
                onClick={onUpgrade}
                variant="outline"
                className="w-full border-purple-200 hover:bg-purple-50"
              >
                <Crown className="h-4 w-4 mr-2" />
                View Premium Plans
              </Button>
            </>
          ) : (
            <Button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
          
          <Button variant="outline" onClick={onClose} className="w-full">
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
