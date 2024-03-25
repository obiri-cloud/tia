"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Progress } from "@/components/ui/progress";
import { createPortal } from "react-dom";
import secureLocalStorage from "react-secure-storage";
import { userCheck } from "@/lib/utils";
import { ContentProps, ILabInfo, ILabInfoDialog } from "@/app/types";

const LabInfoDialog: FC<ILabInfoDialog> = ({ lab }) => {
  const { data: session } = useSession();
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [labInfo, setLabInfo] = useState<ILabInfo>();
  const [secondaryAction, setSecondaryAction] = useState<string | null>(null);
  const [noClose, toggleNoClose] = useState(false);
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const router = useRouter();

  const goToLab = async (id: number) => {
    setDisabled(true);
    toggleNoClose(true);

    const timer = setInterval(() => setProgress((prev) => prev + 10), 1000);
    setTimeout(() => {
      clearInterval(timer);
    }, 5000);
    let formData = JSON.stringify({
      image: id,
      review: 1,
      comments: "string",
    });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/lab/create/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLabInfo(response.data);
      if (response.data.status === 400) {
        setDisabled(false);
        setProgress(0);
        toast({
          title: response.data.message,
          variant: "destructive",
          description: "Please delete one of your active labs.",
        });
        if (
          response.data.ingress_url &&
          response.data.lab_id &&
          response.data.image_id
        ) {
    toggleNoClose(false)

          setSecondaryAction(
            "A lab of this instance already exists, you can delete the lab and create a new one or jump back into it."
          );
        }
      }

      if (response.data.status === 408) {
        setDisabled(false);
        setProgress(0);
        toast({
          title: response.data.message,
          variant: "destructive",
          description: "Lab timed out",
        });
      }

      if (response.data.status === 200 || response.data.status === 201) {
        delayPush(response.data);
      }
    } catch (error) {
      console.error("error", error);
      if (error instanceof AxiosError) {
        userCheck(error as AxiosError);
      }
      if (axios.isCancel(error)) {
        toast({
          title: "Lab Creation Stopped",
          variant: "destructive",
          description: "Deleting all created resources",
        });
      } else {
        // Handle other errors
      }
      setDisabled(false);
      setProgress(0);
    }
  };
  const delayPush = (data: any, resumed: boolean | null = null) => {
    setSecondaryAction(null);
    const timer = setInterval(() => setProgress((prev) => prev + 10), 1000);
    setTimeout(() => {
      secureLocalStorage.setItem(
        "tialab_info",
        JSON.stringify({
          id: data.image_id,
          url: data.ingress_url,
          creation_date: data.creation_date,
        })
      );
      toast({
        title: `Lab ${resumed ? "Resumed" : "Created"}`,
        variant: "success",
      });
      router.push(`/dashboard/labs?lab=${data.lab_id}`);
      setProgress(0);
      clearInterval(timer);
      setDisabled(false);
    }, 5000);
  };

  const deleteLab = async (id: number) => {
    setDisabled(true);
    setSecondaryAction(null);
    const timer = setInterval(() => setProgress((prev) => prev + 10), 1000);
    setTimeout(() => {
      clearInterval(timer);
    }, 5000);

    let formData = JSON.stringify({ image: id });
    toast({
      title: "Hold on we are deleting your lab.",
    });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/lab/delete/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        toast({
          title: response.data.message,
          variant: "success",
        });
        setDisabled(false);
      } else {
        setSecondaryAction(
          "A lab of this instance already exists, you can delete the lab and create a new one or jump back into it."
        );
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);
      setSecondaryAction(
        "A lab of this instance already exists, you can delete the lab and create a new one or jump back into it."
      );
      toast({
        title: "Something went wrong. Try again",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    setDisabled(false);
    setProgress(0);
    setSecondaryAction(null);
  }, [lab]);

  const handleOnClickOutside = (
    e: ContentProps["onPointerDownOutside"],
    text: string
  ) => {
    e.preventDefault();

    toast({
      variant: "destructive",
      title: text,
    });
  };

  const handleOnEsc = (
    e: React.KeyboardEvent<HTMLDivElement>,
    text: string
  ) => {
    if (e.key === "Escape") {
      e.preventDefault();
      toast({
        variant: "destructive",
        title: text,
      });
    }
  };

  const cancelLab = () => {
    document.getElementById("closeDialog")?.click();

    toast({
      variant: "destructive",
      title: `Lab creation stopped`,
    });
    //@ts-ignore
    deleteLab(lab?.id);
  };

  const deleteActiveLab = ()=>{
    deleteLab(labInfo!.image_id)
    document.getElementById("closeDialog")?.click();

  }
  return (
    <div>
      {lab ? (
        <DialogContent
          onClickOutside={(e) =>
            handleOnClickOutside(
              e,
              "You can't stop lab creation once you've initiated the request."
            )
          }
          onEsc={(e) =>
            noClose &&
            handleOnEsc(
              e,
              "You can't stop lab creation once you've initiated the request."
            )
          }
          noClose={false}
        >
          <DialogHeader>
            <DialogTitle>{lab.name}</DialogTitle>
          </DialogHeader>
          <>
            <div className="">
              <span className="font-semibold block">Level: </span>
              <span>{lab.difficulty_level}</span>
            </div>
            <div className="">
              <span className="font-semibold block">Description: </span>
              <span>
                {lab.description ? (
                  lab.description
                ) : (
                  <p>No description provided...</p>
                )}
              </span>
            </div>

            {disabled ? (
              <Progress value={progress} className="mt-10 h-2" />
            ) : (
              !secondaryAction && (
                <Button
                  onClick={() => goToLab(lab.id)}
                  className="mt-6 disabled:bg-black-900/10 w-full dark:bg-white dark:text-black bg-black text-white "
                  variant="black"
                >
                  Start Lab
                </Button>
              )
            )}
            {secondaryAction ? (
              <div className="mt-5">
                <span>
                  A lab of this instance already exists, you can delete the lab
                  and create a new one or jump back into it.
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={deleteActiveLab}
                    className="mt-6 block py-2 px-4 rounded-md"
                    variant="destructive"
                  >
                    Delete Lab
                  </Button>
                  <Button
                    onClick={() => {
                      setDisabled(true);
                      delayPush(labInfo, true);
                    }}
                    className="mt-6 disabled:bg-black-900/10 w-full bg-black text-white  glassBorder"
                    variant="black"
                  >
                    Jump back into lab
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        </DialogContent>
      ) : null}
    </div>
  );
};

export default LabInfoDialog;
