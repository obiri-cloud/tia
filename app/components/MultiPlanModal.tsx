import React from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { userCheck } from "@/lib/utils";

const plans = [
  {
    value: "basic",
    label: "Basic",
    features: ["100 credits per month", "Basic analytics", "Community support"],
    price: "0",
    basicPrice: 0,
    plan_choice: "monthly",
  },
  {
    value: "standard",
    label: "Standard",
    features: ["250 credits per month", "Enhanced analytics", "Email support"],
    price: "10",
    plan_choice: "monthly",
  },
  {
    value: "premium",
    label: "Premium",
    features: ["500 credits per month", "Advanced analytics", "Priority support"],
    price: "20",
    plan_choice: "monthly",
  },
];

export default function MultiPlanModal({ currentPlan, currentImage }) {
  const { data: session } = useSession();
  const token = session?.user?.tokens?.access_token;

  const subscribe = async (plan) => {
    document.getElementById("btn").textContent = "Processing";
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/payment/subscription/create/`,
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
      document.getElementById("btn").textContent = "Processing";
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
    }
  };

  const upgradeSubscription = async (plan) => {
    document.getElementById("btn").textContent = "Updating";
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/payment/subscription/update/`,
        {
          amount: plan.price,
          plan_choice: plan.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      document.getElementById("btn").textContent = `Subscribe to ${plan.value}`;
      toast({
        title: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  const filteredPlans = plans.filter((plan) => {
    if (currentPlan === "basic" && (plan.value === "standard" || plan.value === "premium")) {
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

  return (
    <div className="sm:max-w-[600px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Upgrade Your Plan
      </p>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Choose the plan that best fits your needs and budget.
      </p>
      <div className="grid gap-6 py-6">
        {filteredPlans.map((plan) => (
          <div key={plan.value} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
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
                className="mt-4 w-full text-sm font-medium"
                onClick={() => subscribe(plan)}
              >
                Subscribe to {plan.label}
              </Button>
            ) : (
              <Button
                id="btn"
                variant="outline"
                onClick={() => upgradeSubscription(plan)}
                className="mt-4 w-full text-sm font-medium"
              >
                Upgrade to {plan.label}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
