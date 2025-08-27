import { api } from "encore.dev/api";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  limits: {
    imageProcessing: number;
    videoProcessing: number;
    cardGeneration: number;
    storageGB: number;
  };
  popular?: boolean;
  stripePriceId?: string;
}

export interface GetPricingPlansResponse {
  plans: PricingPlan[];
}

// Gets available pricing plans
export const getPricingPlans = api<void, GetPricingPlansResponse>(
  { expose: true, method: "GET", path: "/subscription/plans" },
  async () => {
    return {
      plans: [
        {
          id: "free",
          name: "Free",
          description: "Perfect for trying out our tools",
          price: 0,
          currency: "USD",
          interval: "month",
          features: [
            "2 image processing operations",
            "Basic image resizing",
            "Basic image cropping",
            "Standard quality output",
            "Community support"
          ],
          limits: {
            imageProcessing: 2,
            videoProcessing: 0,
            cardGeneration: 0,
            storageGB: 0
          }
        },
        {
          id: "starter",
          name: "Starter",
          description: "Great for personal projects and small businesses",
          price: 9.99,
          currency: "USD",
          interval: "month",
          features: [
            "100 image processing operations/month",
            "10 video conversions/month",
            "5 PVC card generations/month",
            "High-quality output",
            "All image tools",
            "Basic video tools",
            "Email support",
            "1GB cloud storage"
          ],
          limits: {
            imageProcessing: 100,
            videoProcessing: 10,
            cardGeneration: 5,
            storageGB: 1
          },
          stripePriceId: "price_starter_monthly"
        },
        {
          id: "professional",
          name: "Professional",
          description: "Perfect for professionals and growing businesses",
          price: 29.99,
          currency: "USD",
          interval: "month",
          features: [
            "500 image processing operations/month",
            "50 video conversions/month",
            "25 PVC card generations/month",
            "Premium quality output",
            "All tools and features",
            "Advanced video tools",
            "Priority support",
            "10GB cloud storage",
            "Batch processing",
            "API access"
          ],
          limits: {
            imageProcessing: 500,
            videoProcessing: 50,
            cardGeneration: 25,
            storageGB: 10
          },
          popular: true,
          stripePriceId: "price_professional_monthly"
        },
        {
          id: "enterprise",
          name: "Enterprise",
          description: "For large teams and high-volume usage",
          price: 99.99,
          currency: "USD",
          interval: "month",
          features: [
            "Unlimited image processing",
            "Unlimited video conversions",
            "Unlimited PVC card generations",
            "Ultra-high quality output",
            "All tools and features",
            "Advanced API access",
            "24/7 priority support",
            "100GB cloud storage",
            "Custom integrations",
            "Team management",
            "White-label options"
          ],
          limits: {
            imageProcessing: -1, // -1 means unlimited
            videoProcessing: -1,
            cardGeneration: -1,
            storageGB: 100
          },
          stripePriceId: "price_enterprise_monthly"
        }
      ]
    };
  }
);
