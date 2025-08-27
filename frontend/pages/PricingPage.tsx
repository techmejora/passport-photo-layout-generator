import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Crown, ArrowLeft, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import backend from '~backend/client';
import PricingCard from '../components/pricing/PricingCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SignInButton from '../components/auth/SignInButton';

export default function PricingPage() {
  const { toast } = useToast();
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch pricing plans
  const { data: pricingData, isLoading: plansLoading } = useQuery({
    queryKey: ['pricing-plans'],
    queryFn: async () => {
      try {
        return await backend.subscription.getPricingPlans();
      } catch (error) {
        console.error('Failed to fetch pricing plans:', error);
        toast({
          title: "Error",
          description: "Failed to load pricing plans",
          variant: "destructive",
        });
        throw error;
      }
    }
  });

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      if (!isSignedIn) {
        toast({
          title: "Sign Up Required",
          description: "Please sign up to get started with the free plan",
        });
        return;
      }
      
      toast({
        title: "Free Plan Active",
        description: "You're already on the free plan!",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Integrate with Stripe for payment processing
      // For now, just show a message
      toast({
        title: "Coming Soon",
        description: "Payment processing will be available soon. Please contact support for premium access.",
      });
    } catch (error) {
      console.error('Failed to process subscription:', error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (plansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <LoadingSpinner size="lg" text="Loading pricing plans..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          {!isSignedIn && (
            <SignInButton className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white" />
          )}
        </div>

        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade as you grow. All plans include our core features with different usage limits.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingData?.plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSelectPlan={handleSelectPlan}
              isLoading={isLoading}
              currentPlan="free" // TODO: Get actual current plan from user data
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Compare All Features
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                  {pricingData?.plans.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-6">
                      <div className="font-semibold text-gray-900">{plan.name}</div>
                      <div className="text-sm text-gray-500">${plan.price}/{plan.interval}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Image Processing</td>
                  <td className="text-center py-4 px-6">2 operations</td>
                  <td className="text-center py-4 px-6">100/month</td>
                  <td className="text-center py-4 px-6">500/month</td>
                  <td className="text-center py-4 px-6">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Video Processing</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6">10/month</td>
                  <td className="text-center py-4 px-6">50/month</td>
                  <td className="text-center py-4 px-6">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">PVC Card Generation</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6">5/month</td>
                  <td className="text-center py-4 px-6">25/month</td>
                  <td className="text-center py-4 px-6">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Cloud Storage</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6">1GB</td>
                  <td className="text-center py-4 px-6">10GB</td>
                  <td className="text-center py-4 px-6">100GB</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Priority Support</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">API Access</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens to my data if I cancel?</h3>
              <p className="text-gray-600">Your data is safely stored for 30 days after cancellation, giving you time to export or reactivate.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Our free plan gives you access to try our tools. No credit card required to get started.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
