import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { userCheck } from "@/lib/utils";
import { ILabImage, Plan } from "../types";
import apiClient from "@/lib/request";

const plans:Plan[] = [
  {
    value: "standard",
    label: "Standard",
    features: ["250 credits per month", "Enhanced analytics", "Email support"],
    price: process.env.NEXT_PUBLIC_SUBSCRIPTION_PLAN_STANDARD_AMOUNT || "10",
    plan_choice: process.env.NEXT_PUBLIC_SUBSCRIPTION_PLAN_INTERVAL || "monthly",
  },
  {
    value: "premium",
    label: "Premium",
    features: [
      "500 credits per month",
      "Advanced analytics",
      "Priority support",
    ],
    price: process.env.NEXT_PUBLIC_SUBSCRIPTION_PLAN_PREMIUM_AMOUNT || "20",
    plan_choice: process.env.NEXT_PUBLIC_SUBSCRIPTION_PLAN_INTERVAL || "monthly",
  },
];

export default function MultiPlanModal({
  currentPlan,
  currentImage,
}: {
  currentPlan: string | undefined;
  currentImage: ILabImage;
}) {
  const { data: session } = useSession();
  const token = session?.user?.tokens?.access_token;
  const [loading, setLoading] = useState(false);

  const subscribe = async (plan: Plan) => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        `/payment/subscription/create/`,
        {
          amount: plan.price,
          interval: "monthly",
          plan_choice: plan.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        window.location.href = response.data.authorization_url;
        toast({
          title: "Redirecting you to payment page",
          variant: "success",
        });
      } else {
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);
      console.error("error", error);
      toast({
        title: "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const upgradeSubscription = async (plan: Plan) => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/payment/subscription/update/`, {
        amount: plan.price,
        plan_choice: plan.value,
      });

      if (response.data.status === 200) {
        window.location.href = `/dashboard/images?image=${currentImage.id}`;
        toast({
          title: `Upgraded to ${plan.value} Successful`,
          variant: "success",
        });
      } else {
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);
      console.error("error", error);
      toast({
        title: "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter((plan: Plan) => {
    if (
      currentPlan === "basic" &&
      (plan.value === "standard" || plan.value === "premium")
    ) {
      return true;
    }
    if (currentPlan === "standard" && plan.value === "premium") {
      return true;
    }
    if (currentPlan === "premium") {
      return false;
    }
    return false;
  });

  const isUpgrade = (current: string | undefined, target: string) => {
    const plansOrder = ["basic", "standard", "premium"];
    return plansOrder.indexOf(target) > plansOrder.indexOf(current ?? "");
  };

  return (
    <div className="sm:max-w-[600px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Upgrade Your Plan
      </p>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Choose the plan that best fits your needs and budget
      </p>
      <div className="grid gap-6 py-6">
        {filteredPlans.map((plan) => (
          <div
            key={plan.value}
            className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg"
          >
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {plan.label}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {plan.features.join(", ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${plan.price}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  per month
                </p>
              </div>
            </div>
            {currentPlan === "basic" ? (
              <Button
                id="btn"
                variant="outline"
                className="mt-4 w-full text-sm font-medium text-black dark:text-white"
                onClick={() => subscribe(plan)}
                disabled={loading}
              >
                {loading ? "Processing..." : `Subscribe to ${plan.label}`}
              </Button>
            ) : (
              <Button
                id="btn"
                variant="outline"
                onClick={() => upgradeSubscription(plan)}
                className="mt-4 w-full text-sm font-medium text-black dark:text-white"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isUpgrade(currentPlan, plan.value)
                  ? `Upgrade to ${plan.label}`
                  : `Downgrade to ${plan.label}`}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
