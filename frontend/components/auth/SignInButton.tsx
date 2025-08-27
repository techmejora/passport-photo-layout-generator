import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';
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
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      signIn(email);
      setIsOpen(false);
      setEmail('');
      setPassword('');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      signIn(email);
      setIsOpen(false);
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
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
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to AutoImageResizer
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" className="flex items-center space-x-2">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Sign Up</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4 mt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Welcome Back!</h3>
              <p className="text-sm text-gray-600">Sign in to access your account</p>
            </div>
            
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </form>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4 mt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Account</h3>
              <p className="text-sm text-gray-600">Join thousands of users processing images daily</p>
            </div>
            
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </form>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Already have an account? Sign in
              </button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Demo Mode Active</span>
            </div>
            <p className="text-xs text-gray-600">
              This is a demo application. Enter any email to {activeTab === 'signin' ? 'sign in' : 'create an account'}. 
              No real authentication is required.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
