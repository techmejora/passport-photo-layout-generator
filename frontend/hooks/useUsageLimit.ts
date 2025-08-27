import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import backend from '~backend/client';

interface UsageLimit {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetDate?: Date;
  requiresUpgrade: boolean;
}

export function useUsageLimit() {
  const { isSignedIn } = useAuth();
  const [guestId, setGuestId] = useState<string>('');

  useEffect(() => {
    if (!isSignedIn) {
      // Generate or get guest ID from localStorage
      let id = localStorage.getItem('guestId');
      if (!id) {
        id = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('guestId', id);
      }
      setGuestId(id);
    }
  }, [isSignedIn]);

  const checkUsageLimit = async (operation: 'image' | 'video' | 'card'): Promise<UsageLimit> => {
    try {
      const result = await backend.subscription.checkUsageLimit({
        operation,
        guestId: !isSignedIn ? guestId : undefined
      });
      
      return result;
    } catch (error) {
      console.error('Failed to check usage limit:', error);
      // Default to allowing operation if check fails
      return {
        allowed: true,
        remaining: 0,
        limit: 0,
        requiresUpgrade: false
      };
    }
  };

  const recordUsage = async (operation: 'image' | 'video' | 'card'): Promise<void> => {
    try {
      await backend.subscription.recordUsage({
        operation,
        guestId: !isSignedIn ? guestId : undefined
      });
    } catch (error) {
      console.error('Failed to record usage:', error);
    }
  };

  return {
    checkUsageLimit,
    recordUsage,
    isGuest: !isSignedIn,
    guestId
  };
}
