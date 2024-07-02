"use client";
import axios, { AxiosError } from "axios";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import * as z from "zod";
import { userCheck } from "@/lib/utils";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import DeactivateConfirmation from "@/app/components/deactivate-confirmation";
import { IUserProfile } from "@/app/types";
import { DropToggle } from "@/app/components/DropToggle";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { CarrotIcon} from "lucide-react";
import AltRouteCheck from "@/app/components/alt-route-check";
import PlanModalContent from "@/app/components/PlanModal";

import apiClient from "@/lib/request";

const plans = [
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



const AccountPage = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<IUserProfile>();
  const [editMode, setEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [deactivateAccountOpen, setDeactivateAccountOpen] = useState(false);
  const [deactivateSubscriptionOpen, setDeactivateSubscriptionOpen] =
    useState(false);
  const [open, setOpen] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const deactivateButtonRef = useRef<HTMLButtonElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const token = session?.user?.tokens?.access_token;
  const currentPlan = session?.user?.data?.subscription_plan;
  const getUser = async () => {
    const response = await apiClient.get(`/auth/user/`);
    setUserData(response.data);
  };

  useEffect(() => {
    try {
      getUser();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const formSchema = z.object({
    first_name: z.string().min(3, {
      message: "Name has to be 3 characters or more",
    }),
    last_name: z.string().min(3, {
      message: "Name has to be 3 characters or more",
    }),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (buttonRef.current) buttonRef.current.disabled = true;

    const formData = {
      first_name: firstNameRef.current?.value,
      last_name: lastNameRef.current?.value,
    };

    try {
      formSchema.parse(formData);
      const response = await apiClient.post(
        `/auth/user/update/`,
        JSON.stringify(formData)
      );
      if (response.data.status === 200) {
        toast({
          variant: "success",
          title: "Profile Updated Successfully",
          duration: 2000,
        });
        setEditMode(false);
        getUser();
      } else {
        toast({
          variant: "destructive",
          title: "Profile Update Error",
          duration: 2000,
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);
      if (error instanceof z.ZodError) {
        error.issues.forEach((err) =>
          toast({
            variant: "destructive",
            title: "Profile Update Error",
            description: err.message,
            duration: 2000,
          })
        );
      }
    } finally {
      if (buttonRef.current) buttonRef.current.disabled = false;
    }
  };

  const deactivateAccount = async () => {
    if (deactivateButtonRef.current)
      deactivateButtonRef.current.disabled = true;
    try {
      const response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/account/deactivate/`,
        {}
      );

      if (response.status === 200) {
        toast({
          title: "Account deactivated successfully!",
          variant: "success",
          duration: 2000,
        });
        signOut({ callbackUrl: "/login" });
      } else {
        toast({
          title: "Something went wrong deactivating your account.",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);
      console.error("error", error);
      toast({
        title: "Something went wrong deactivating your account.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      if (deactivateButtonRef.current)
        deactivateButtonRef.current.disabled = false;
    }
  };

  const deactivateSubscription2 = async () => {
    if (deactivateButtonRef.current) deactivateButtonRef.current.disabled = true;
    try {
      const response = await apiClient.post(
        `/payment/subscription/delete/`
      );

      console.log("account----->", response);

      if (response.status === 204) {
        window.location.href = "/dashboard/account";
        toast({
          title: "Subscription deactivated successfully!",
          variant: "success",
          duration: 2000,
        });
        window.location.href = "/dashboard/account";
      } else {
        toast({
          title: "Something went wrong!",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);
      console.error("error", error);
      //@ts-ignore
      toast({
        //@ts-ignore
        title: error.response.data.message,
        variant: "destructive",
        duration: 2000,
      });
    }finally{
      if (deactivateButtonRef.current)
        deactivateButtonRef.current.disabled = false;
    }
  };



  const deactivateSubscription = async () => {
    if (deactivateButtonRef.current) deactivateButtonRef.current.disabled = true;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/payment/subscription/delete/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
       console.log('++++++++++++___',response)
      if (response.status === 204) {
        toast({
          title: "Subscription deactivated successfully!",
          variant: "success",
          duration: 2000,
        });
        window.location.href = "/dashboard/account";
      } else {
        toast({
          title: "Something went wrong!",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);
      console.error("error", error);
      //@ts-ignore
      toast({
        //@ts-ignore
        title: error.response.data.message,
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      if (deactivateButtonRef.current)
        deactivateButtonRef.current.disabled = false;
    }
  };


  const getFilteredPlans = () => {
    return plans.filter((plan) => plan.value !== currentPlan);
  };

  return (
    <Dialog>
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex">
          <span className="p-2 ">Account</span>
        </div>
        <AltRouteCheck />
      </div>
      <div className="sc-hLBbgP sc-fLjoTV jAQqIz jVzpQn">
        <div className="sc-jEJXZe cyvxRV"></div>
        <div className="sc-hLBbgP sc-cTUoWY ioYMmf jlBsiO">
          <div className="sc-hLBbgP cAyNtX">
            <div className="sc-hLBbgP gUrCBj">
              <span className="text-left leading-8 text-2xl font-medium tracking-widest-[-0.01rem] dark:text-dashboardDarkHeadText text-whiteDark">
                Profile
              </span>
            </div>
            <div className="sc-bcXHqe sc-cRIgaW cpMQpB htAZxf">
              Manage your Tialabs profile
            </div>
          </div>
          <div className="border-b dark:border-b-dashboardDarkSeparator border-b-whiteEdge my-6"></div>
          <form onSubmit={handleSubmit}>
            <div className="sc-hLBbgP ePdqdi mb-[24px]">
              <span className="text-[0.8125rem] text-whiteDark dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">
                Email
              </span>
              <div className="sc-hLBbgP sc-svekf hDbocA lhdcYD">
                <div className="sc-hLBbgP fHykyP">
                  {userData?.email ? (
                    <span className="sc-bcXHqe sc-kgMPZw cpMQpB tJsVO">
                      {userData.email}
                    </span>
                  ) : (
                    <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
                  )}
                </div>
              </div>
            </div>
            <div className="sc-hLBbgP ePdqdi mb-[24px]">
              <span className="text-[0.8125rem] text-whiteDark dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">
                Username
              </span>
              <div className="sc-hLBbgP sc-svekf hDbocA lhdcYD">
                <div className="sc-hLBbgP fHykyP">
                  {userData?.username ? (
                    <span className="sc-bcXHqe sc-kgMPZw cpMQpB tJsVO">
                      {userData.username}
                    </span>
                  ) : (
                    <Skeleton className="w-[100px] h-[16.5px] rounded-md" />
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="sc-gGfaQS gna-dsN">
                <div className="sc-hLBbgP sc-lcKFhQ ePdqdi gvNIOZ">
                  <div className="sc-hLBbgP ioYMmf">
                    <label>
                      <span className="dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">
                        First name
                      </span>
                    </label>
                    <div className="sc-hLBbgP fHykyP">
                      <input
                        placeholder="First name"
                        className="kFBAIE bg-white dark:bg-dashboardDarkInput dark:border-dashboardDarkInputBorder border-dashboardLightInputBorder border text-whiteDark dark:text-dashboardLightInputBorder"
                        defaultValue={userData?.first_name}
                        ref={firstNameRef}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="sc-gGfaQS gna-dsN">
                <div className="sc-hLBbgP sc-lcKFhQ ePdqdi gvNIOZ">
                  <div className="sc-hLBbgP ioYMmf">
                    <label>
                      <span className="dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">
                        Last name
                      </span>
                    </label>
                    <div className="sc-hLBbgP fHykyP">
                      <input
                        placeholder="Last name"
                        className="kFBAIE bg-white dark:bg-dashboardDarkInput dark:border-dashboardDarkInputBorder border-dashboardLightInputBorder border text-whiteDark dark:text-dashboardLightInputBorder"
                        defaultValue={userData?.last_name}
                        ref={lastNameRef}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              ref={buttonRef}
              type="submit"
              className="sc-fbYMXx dxdUZf bg-black"
            >
              Update
            </button>
          </form>

          <div className="sc-hLBbgP gUrCBj mt-8">
            <div className="sc-hLBbgP sc-eAeVAz dIPdRh hOuTWu">
              <label className="text-[0.8125rem] text-whiteDark dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">
                Change plan
              </label>
              <span className="sc-bcXHqe sc-iuxOeI wRSCb jhSxJJ">
                Upgrade your subscription plan
              </span>
              You are on a {currentPlan} Subscription
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between dark:bg-comboBg bg-white theme-selector"
                >
                  {currentPlan === "basic" ? "Subscribe..." : "change plan..."}
                  <CarrotIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandEmpty>No plans found.</CommandEmpty>
                  <CommandGroup className="dark:bg-comboBg bg-white">
                    {getFilteredPlans().map((plan) => (
                      <CommandItem
                        key={plan.value}
                        value={plan.value}
                        onSelect={(currentValue) => {
                          const selected = plans.find(
                            (plan) => plan.value === currentValue
                          );
                          if (selected) {
                            setSelectedPlan(selected);
                            setModalOpen(true);
                          }
                          setOpen(false);
                        }}
                        className="capitalize"
                      >
                        {plan.label}
                        {/* <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedPlan.value === plan.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        /> */}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <DropToggle />

          <div className="sc-jEJXZe cyvxRV"></div>

          <div className="sc-hLBbgP flex justify-between mt-10">
            <div className="">
              <div className="sc-hLBbgP gUrCBj">
                <span className="text-left leading-8 text-2xl font-medium tracking-widest-[-0.01rem] dark:text-dashboardDarkHeadText whiteDark">
                  Deactivate Account
                </span>
              </div>
              <div className="sc-bcXHqe sc-cRIgaW cpMQpB htAZxf">
                Deactivate your account
              </div>
            </div>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                onClick={() => setDeactivateAccountOpen(true)}
              >
                Deactivate account
              </Button>
            </DialogTrigger>
          </div>

          <Dialog
            open={deactivateAccountOpen}
            onOpenChange={setDeactivateAccountOpen}
          >
            <DeactivateConfirmation
              text="Do you want to deactivate your account?"
              noText="No, cancel"
              confirmText="Yes, deactivate"
              confirmFunc={deactivateAccount}
              deactivateButtonRef
            />
          </Dialog>

          <div className="sc-hLBbgP flex justify-between mt-10">
            <div className="">
              <div className="sc-hLBbgP gUrCBj">
                <span className="text-left leading-8 text-2xl font-medium tracking-widest-[-0.01rem] dark:text-dashboardDarkHeadText whiteDark">
                  Deactivate Subscription
                </span>
              </div>
              <div className="sc-bcXHqe sc-cRIgaW cpMQpB htAZxf">
                Deactivate your subscription
              </div>
            </div>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                onClick={() => setDeactivateSubscriptionOpen(true)}
              >
                Deactivate subscription
              </Button>
            </DialogTrigger>
          </div>

          <Dialog
            open={deactivateSubscriptionOpen}
            onOpenChange={setDeactivateSubscriptionOpen}
          >
            <DeactivateConfirmation
              text="Do you want to deactivate your subscription?"
              noText="No, cancel"
              confirmText="Yes, deactivate"
              confirmFunc={deactivateSubscription}
              deactivateButtonRef={deactivateButtonRef}
            />
          </Dialog>

          <div className="border-b dark:border-b-dashboardDarkSeparator border-b-whiteEdge my-6"></div>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <PlanModalContent plan={selectedPlan} currentPlan={currentPlan} />
          <DialogClose asChild>
            <button
              aria-label="Close"
              className="absolute top-2.5 right-2.5 inline-flex h-8 w-8 appearance-none items-center justify-center rounded-full focus:outline-none"
            >
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default AccountPage;
