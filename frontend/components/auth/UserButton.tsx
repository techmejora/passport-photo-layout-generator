import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Crown, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SignInButton from './SignInButton';

export default function UserButton() {
  const { isSignedIn, user, signOut } = useAuth();

  if (!isSignedIn || !user) {
    return (
      <SignInButton className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg" />
    );
  }

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-white">
              {getInitials(user.email)}
            </span>
          </div>
          <span className="hidden sm:block max-w-32 truncate">{user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl border-0 rounded-lg">
        <div className="px-3 py-2 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {getInitials(user.email)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{user.email}</div>
              <div className="text-sm text-gray-500">Free Plan</div>
            </div>
          </div>
        </div>
        
        <DropdownMenuItem asChild>
          <Link to="/pricing" className="flex items-center space-x-3 px-3 py-2 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-200">
            <Crown className="h-4 w-4 text-yellow-600" />
            <span>Upgrade to Premium</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 transition-all duration-200">
          <BarChart3 className="h-4 w-4 text-gray-600" />
          <span>Usage Statistics</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 transition-all duration-200">
          <Settings className="h-4 w-4 text-gray-600" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={signOut}
          className="flex items-center space-x-3 px-3 py-2 hover:bg-red-50 text-red-600 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
