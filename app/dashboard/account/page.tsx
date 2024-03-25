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
import { ToastAction } from "@radix-ui/react-toast";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import * as z from "zod";
import { userCheck } from "@/lib/utils";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeactivateConfirmation from "@/app/components/deactivate-confirmation";
import { IUserProfile } from "@/app/types";


const AccountPage = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<IUserProfile>();
  const [editMode, setEditMode] = useState(false);

  const form = useForm();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const deactivateButtonRef = useRef<HTMLButtonElement>(null);

  const formSchema = z.object({
    first_name: z.string().min(3, {
      message: "Name has to be 3 characters or more",
    }),
    last_name: z.string().min(3, {
      message: "Name has to be 3 characters or more",
    }),
  });

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const getUser = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/auth/user/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUserData(response.data);
  };
  useEffect(() => {
    try {
      getUser();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const changeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFiles = e.target.files;
      const image = imageFiles[0];
      const formData = new FormData();
      formData.append("video", image);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BE_URL}auth/avatar/change/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast({
            title: "Avatar Updated",
            variant: "success",
          });
          getUser();
        } else {
          toast({
            title: "Error when updating.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
            variant: "destructive",
          });
        }
      } catch (error) {
        userCheck(error as AxiosError);

        toast({
          title: "Error when updating.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }
    let formData = {
      first_name: firstNameRef.current?.value,
      last_name: lastNameRef.current?.value,
    };

    try {
      formSchema.parse(formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/user/update/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        toast({
          variant: "success",
          title: "Profile Updated Successfully",
        });
        setEditMode(false);
        getUser();
      } else {
        toast({
          variant: "destructive",
          title: "Profile Update Error",
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);

      if (error instanceof z.ZodError) {
        error.issues.map((err) =>
          toast({
            variant: "destructive",
            title: "Profile Update Error",
            description: err.message,
          })
        );
      }
    } finally {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
      }
    }
  };

  const deactivateAccount = async () => {
    if (deactivateButtonRef.current) {
      deactivateButtonRef.current.disabled = true;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/account/deactivate/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Account deactivated successfully!",
          variant: "success",
        });
        signOut({ callbackUrl: "/login" });
      } else {
        toast({
          title: "Something went deactivating your account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);

      console.error("error", error);

      toast({
        title: "Something went deactivating your account.",
        variant: "destructive",
      });
    } finally {
      if (deactivateButtonRef.current) {
        deactivateButtonRef.current.disabled = false;
      }
    }
  };

  return (
    <Dialog>

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
          {/* <div className="sc-gGfaQS gna-dsN">
            <div className="sc-hLBbgP sc-lcKFhQ ePdqdi gvNIOZ">
              <div className="sc-hLBbgP ioYMmf">
                <label>
                  <span className="text-[0.8125rem] text-whiteDark dark:text-dashboardDarkHeadText font-medium">
                    Profile picture
                  </span>
                </label>
                <div className="sc-hLBbgP fHykyP">
                  <div
                    role="button"
                    className="sc-hLBbgP sc-igtUOe jKWMTP Vihrj sc-lgpvUy dHFqIb"
                  >
                    <input
                      className="hidden"
                      accept="image/png, image/jpeg"
                      type="file"
                      id="avatarUrl"
                    />
                    <div className="sc-gJqSRm bPFOEz sc-hRXZVh iZhvmM">
                      <div
                        aria-label="Avatar with initials SA"
                        className="sc-fHSyak bhauWF"
                      >
                        <span className=" uppercase">
                          {userData?.first_name.slice(0, 2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
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

          <button
            ref={buttonRef}
            type="submit"
            className="sc-fbYMXx dxdUZf bg-black"
          >
            Update
          </button>
        </form>

        <div className="sc-jEJXZe cyvxRV"></div>

        <div className="sc-hLBbgP   flex justify-between">
          <div className="">
            <div className="sc-hLBbgP gUrCBj">
              <span className="text-left leading-8 text-2xl font-medium tracking-widest-[-0.01rem] dark:text-dashboardDarkHeadText whiteDark">
                Deactivate
              </span>
            </div>
            <div className="sc-bcXHqe sc-cRIgaW cpMQpB htAZxf">
              Deactivate your account
            </div>
          </div>
          <DialogTrigger>
            <Button variant="destructive" >Deactivate</Button>
          </DialogTrigger>
        </div>
        <div className="border-b dark:border-b-dashboardDarkSeparator border-b-whiteEdge my-6"></div>
      <DeactivateConfirmation
        text="Do you want to deactivate your account?"
        noText="No, cancel"
        confirmText="Yes, deactivate"
        confirmFunc={() => deactivateAccount()}
      />
      </div>
    </div>
    </Dialog>

  );
};


export default AccountPage;
