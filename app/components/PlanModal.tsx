import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { userCheck } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plan } from "../types";
import apiClient from "@/lib/request";

const PlanModalContent = ({
  plan,
  currentPlan,
}: {
  plan: Plan;
  currentPlan: string | undefined;
}) => {
  const { data: session } = useSession();
  const token = session?.user?.tokens?.access_token;
  const router = useRouter();
  let btn = document.getElementById("btn");

  const subscribe = async () => {
    if (btn) {
      btn.textContent = "Processing";
    }
    try {
      const response = await apiClient.post(`/payment/subscription/create/`, {
        amount: plan.price,
        interval: "monthly",
        plan_choice: plan.value,
      });
      if (btn) {
        btn.textContent = "Processing";
      }
      if (response.status === 200) {
        if (btn) {
          btn.textContent = "Processing";
        }
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

  const upgradeSubscription = async () => {
    if (btn) {
      btn.textContent = "Updating";
    }
    try {
      const response = await apiClient.post(`/payment/subscription/update/`, {
        amount: plan.price,
        plan_choice: plan.value,
      });

      if (response.data.status === 200) {
        window.location.href = "/dashboard/account";
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
      if (btn) {
        btn.textContent = `Subscribe to ${plan.value}`;
      }
      toast({
        title: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-2 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {plan.label} Plan
      </h2>
      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
            <span className="text-gray-800 dark:text-gray-200">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center mb-4">
        <span className="text-4xl font-bold text-gray-900 dark:text-gray-100 mr-2">
          ${plan.price}/month
        </span>
      </div>
      <div className="flex items-center space-x-2 text-black dark:text-white">
        <Input id="discount" placeholder="Enter discount code" />
        <Button variant="outline">Apply</Button>
      </div>
      {currentPlan === "basic" ? (
        <p
          id="btn"
          onClick={subscribe}
          className="inline-flex items-center justify-center px-4 cursor-pointer py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-50"
        >
          Subscribe to {plan.label}
        </p>
      ) : (
        <p
          id="btn"
          onClick={upgradeSubscription}
          className="inline-flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-50"
        >
          Upgrade to {plan.label}
        </p>
      )}
    </div>
  );
};

export default PlanModalContent;
