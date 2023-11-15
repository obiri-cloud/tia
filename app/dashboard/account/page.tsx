"use client";
import axios from "axios";
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
import edit from "@/public/svgs/edit.svg";
import cancel from "@/public/svgs/cancel.svg";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import * as z from "zod";

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
        `${process.env.NEXT_PUBLIC_BE_URL}auth/account/deactivate/`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);

      if (response.status === 200) {
        toast({
          title: "Account deactivated successfully!",
          variant: "success",
        });
        signOut();
      } else {
        toast({
          title: "Something went deactivating your account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("error", error);

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
    <div className="container pt-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-gray-200 text-3xl font-bold w-[100px] h-[100px] rounded-full flex justify-center items-center">
            {userData?.first_name[0]}
            {userData?.last_name[0]}
          </div>
          <div className="relative">
            <button className="underline underline-offset-4 font-medium ">
              Change avatar
            </button>
            <input
              onChange={changeAvatar}
              type="file"
              className="absolute left-0 w-auto z-10 opacity-0"
              accept=".jpg, .jpeg, .png"
            />
          </div>
        </div>
        <button
          ref={deactivateButtonRef}
          onClick={deactivateAccount}
          className="bg-red-700 text-white h-auto py-3 px-6 rounded-2xl disabled:bg-red-700/60"
        >
          Deactivate Account
        </button>
      </div>

      <div className="mt-10">
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center">
              <h1 className="font-medium ">Personal Information</h1>
              {editMode ? (
                <Button
                  type="submit"
                  ref={buttonRef}
                  className="disabled:bg-black-900/10"
                  variant="black"
                >
                  Save
                </Button>
              ) : null}
            </div>
            <div className="relative">
              <div
                onClick={() => setEditMode(!editMode)}
                className="border w-fit p-3 rounded-full absolute cursor-pointer bg-white right-[-20px] top-[-10px] "
              >
                <Image src={editMode ? cancel : edit} alt="edit" width={20} />
              </div>
              <div className="w-full grid grid-cols-2 border rounded-xl mt-4 p-9 gap-4">
                <div className="mb-6">
                  <h2 className="font-medium ">First Name</h2>
                  {editMode ? (
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={userData?.first_name}
                              placeholder="First Name"
                              type="text"
                              {...field}
                              ref={firstNameRef}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <>
                      {userData?.first_name ? (
                        <p className="text-black/70">{userData?.first_name}</p>
                      ) : (
                        <Skeleton className="w-full h-[25px] rounded-md" />
                      )}
                    </>
                  )}
                </div>
                <div className="">
                  <h2 className="font-medium ">Last Name</h2>
                  {editMode ? (
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              defaultValue={userData?.last_name}
                              placeholder="Last Name"
                              type="text"
                              {...field}
                              ref={lastNameRef}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <>
                      {userData?.last_name ? (
                        <p className="text-black/70">{userData?.last_name}</p>
                      ) : (
                        <Skeleton className="w-full h-[25px] rounded-md" />
                      )}
                    </>
                  )}
                </div>
                <div className="">
                  <h2 className="font-medium ">Email</h2>
                  <>
                    {userData?.email ? (
                      <p className="text-black/70">{userData?.email}</p>
                    ) : (
                      <Skeleton className="w-full h-[25px] rounded-md" />
                    )}
                  </>
                </div>
                <div className="">
                  <h2 className="font-medium ">Username</h2>
                  <>
                    {userData?.username ? (
                      <p className="text-black/70">{userData?.username}</p>
                    ) : (
                      <Skeleton className="w-full h-[25px] rounded-md" />
                    )}
                  </>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AccountPage;
