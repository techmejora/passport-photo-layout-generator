import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import type { PricingPlan } from '~backend/subscription/plans';

interface PricingCardProps {
  plan: PricingPlan;
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
  currentPlan?: string;
}

export default function PricingCard({ 
  plan, 
  onSelectPlan, 
  isLoading = false,
  currentPlan 
}: PricingCardProps) {
  const isCurrentPlan = currentPlan === plan.id;
  const isFree = plan.price === 0;

  return (
    <Card className={`relative border-2 transition-all duration-300 hover:shadow-lg ${
      plan.popular 
        ? 'border-purple-500 shadow-purple-100' 
        : isCurrentPlan
        ? 'border-green-500 shadow-green-100'
        : 'border-gray-200 hover:border-purple-300'
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Star className="h-3 w-3" />
            <span>Most Popular</span>
          </div>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Current Plan
          </div>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
        <p className="text-gray-600 text-sm">{plan.description}</p>
        <div className="mt-4">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
            {!isFree && <span className="text-gray-500 ml-1">/{plan.interval}</span>}
          </div>
          {isFree && <p className="text-sm text-gray-500 mt-1">Forever free</p>}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Usage Limits</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Image Processing:</span>
              <span className="font-medium">
                {plan.limits.imageProcessing === -1 ? 'Unlimited' : `${plan.limits.imageProcessing}/month`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Video Processing:</span>
              <span className="font-medium">
                {plan.limits.videoProcessing === -1 ? 'Unlimited' : `${plan.limits.videoProcessing}/month`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Card Generation:</span>
              <span className="font-medium">
                {plan.limits.cardGeneration === -1 ? 'Unlimited' : `${plan.limits.cardGeneration}/month`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Storage:</span>
              <span className="font-medium">{plan.limits.storageGB}GB</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onSelectPlan(plan.id)}
          disabled={isLoading || isCurrentPlan}
          className={`w-full ${
            plan.popular
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              : isCurrentPlan
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-900 hover:bg-gray-800'
          } text-white`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : isCurrentPlan ? (
            'Current Plan'
          ) : isFree ? (
            'Get Started Free'
          ) : (
            `Upgrade to ${plan.name}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
