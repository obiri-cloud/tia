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
import { DropToggle } from "@/app/components/DropToggle";
import { useRouter } from "next/navigation";
import useOrgCheck from "@/hooks/orgnization-check";

const AccountPage = () => {
  const { data: session, update } = useSession();
  const org_id = session?.user!.data?.organization_id;
  const [userData, setUserData] = useState<any>();
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const form = useForm();
  // const session = await getSession();

  const NameRef = useRef<HTMLInputElement>(null);
  const deactivateButtonRef = useRef<HTMLButtonElement>(null);

  const formSchema = z.object({
    name: z.string().min(3, {
      message: "Name has to be 3 characters or more",
    }),
  });

  console.log({ session });

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const getUser = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/retrieve/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUserData(response.data.data);
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
    let formData = {
      name: NameRef.current?.value,
    };

    try {
      formSchema.parse(formData);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${userData.id}/update/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Profile Updated Successfully",
        });
        setEditMode(false);
        getUser();
        router.push("/my-organization/account");
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
      //   if (buttonRef.current) {
      //     buttonRef.current.disabled = false;
      //   }
    }
  };

  const deleteOrganization = async () => {
    if (deactivateButtonRef.current) {
      deactivateButtonRef.current.disabled = true;
    }
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${userData.id}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        if (session)
          update({
            ...session,
            user: {
              ...session.user,
              data: { ...session.user.data, organization_id: null },
            },
          });

        if (session) {
          const updatedUserData = {
            ...session.user.data,
            organization_id: null,
          };

          const updatedSession = {
            ...session,
            user: {
              ...session.user,
              data: updatedUserData,
            },
          };

          await update(updatedSession);
        }

        toast({
          title: "Organization Account deleted successfully",
          variant: "success",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Something went deactivating your organizaton",
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
                Organization Profile
              </span>
            </div>
            <div className="sc-bcXHqe sc-cRIgaW cpMQpB htAZxf">
              Manage your Organization profile
            </div>
          </div>
          <div className="border-b dark:border-b-dashboardDarkSeparator border-b-whiteEdge my-6"></div>
          <form onSubmit={handleSubmit}>
            <div className="sc-hLBbgP ePdqdi mb-[24px]">
              <span className="text-[0.8125rem] text-whiteDark dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">
                Organization Name
              </span>
              <div className="sc-hLBbgP sc-svekf hDbocA lhdcYD">
                <div className="sc-hLBbgP fHykyP">
                  {userData?.owner ? (
                    <span className="sc-bcXHqe sc-kgMPZw cpMQpB tJsVO">
                      {userData.name}
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
                      Organization Name
                    </span>
                  </label>
                  <div className="sc-hLBbgP fHykyP">
                    <input
                      placeholder="name"
                      className="kFBAIE bg-white dark:bg-dashboardDarkInput dark:border-dashboardDarkInputBorder border-dashboardLightInputBorder border text-whiteDark dark:text-dashboardLightInputBorder"
                      defaultValue={userData?.name}
                      ref={NameRef}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              // ref={buttonRef}
              id="submit-button"
              type="submit"
              className="sc-fbYMXx dxdUZf bg-black"
              // onClick={handleSubmit}
            >
              Update Organization Name
            </button>
          </form>

          <div className="sc-jEJXZe cyvxRV"></div>

          <div className="sc-hLBbgP   flex justify-between mt-10">
            <div className="">
              <div className="sc-hLBbgP gUrCBj">
                <span className="text-left leading-8 text-2xl font-medium tracking-widest-[-0.01rem] dark:text-dashboardDarkHeadText whiteDark">
                  Delete Organization
                </span>
              </div>
              <div className="sc-bcXHqe sc-cRIgaW cpMQpB htAZxf">
                Delete Your Organization
              </div>
            </div>
            <DialogTrigger>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
          </div>
          <div className="border-b dark:border-b-dashboardDarkSeparator border-b-whiteEdge my-6"></div>
          <DeactivateConfirmation
            text="Do you want to delete your Organization. You will lose all your groups, members and labs attached to this group"
            noText="No, cancel"
            confirmText="Yes, delete"
            confirmFunc={() => deleteOrganization()}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default AccountPage;
