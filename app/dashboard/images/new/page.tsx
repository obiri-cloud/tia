"use client";

import Reviews from "@/app/components/dashboard/Reviews";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "@/public/svgs/Clock";
import { UsersIcon } from "@/public/svgs/UsersIcon";
import axios, { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "@/components/ui/use-toast";
import InfinityLoader from "@/app/loaders/infinity";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import secureLocalStorage from "react-secure-storage";
import { userCheck } from "@/lib/utils";

const ImagePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("image");
  const { data: session } = useSession();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [creatingStarted, setCreatingStarted] = useState(false);
  const [jokes, setJokes] = useState<string[]>([]);

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const getCurrentImage = async (id: string | null, token: string) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/user/image/${id}/retrieve/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch image");
    }
  };

  const {
    isLoading,
    error,
    data: currentImage,
  } = useQuery(["image", id, token], () => getCurrentImage(id, token));

  function getTimeFromServer() {
    const timestamp = new Date().getTime();

    const url = `/api/getTime?timestamp=${timestamp}`;

    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const serverTime = new Date(data.unixtime * 1000);
          const localTime = new Date();
          const timeDifference = Math.abs(
            serverTime.getTime() - localTime.getTime()
          );

          if (timeDifference > 300000) {
            toast({
              title: "Your local time is incorrect.",
              variant: "destructive",
              description: "Please fix it before you start the lab.",
            });
            setCreatingStarted(false);
            if (buttonRef.current) {
              buttonRef.current.disabled = false;
            }

            reject(
              "Your local time is incorrect. Please fix it before you start the lab."
            );
          } else {
            resolve(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching time from server:", error);
          toast({
            title: "Error fetching time from server.",
            variant: "destructive",
          });
          setCreatingStarted(false);
          if (buttonRef.current) {
            buttonRef.current.disabled = false;
          }

          reject("Error fetching time from server");
        });
    });
  }

  const checkTimeBeforeStart = async (id: string | undefined) => {
    setCreatingStarted(true);
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }

    getTimeFromServer()
      .then((res) => {
        startLab(currentImage?.id);
      })
      .catch((error) => {
        setCreatingStarted(false);
        if (buttonRef.current) {
          buttonRef.current.disabled = false;
        }

        console.error("Error:", error);
      });
  };

  const startLab = async (id: number | null) => {
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
      if (response.data.status === 400) {
        toast({
          title: response.data.message,
          variant: "success",
          description: "Resuming your lab.",
        });
        if (
          response.data.ingress_url &&
          response.data.lab_id &&
          response.data.image_id
        ) {
          let data = response.data;
          secureLocalStorage.setItem(
            "tialab_info",
            JSON.stringify({
              id: data.image_id,
              url: data.ingress_url,
              creation_date: data.creation_date,
              duration: data.duration,
            })
          );
          setCreatingStarted(false);
          if (buttonRef.current) {
            buttonRef.current.disabled = false;
          }
          router.push(
            `/dashboard/labs?lab=${data.lab_id}&image=${data.image_id}`
          );
        }
      }
      if (response.data.status === 408) {
        setCreatingStarted(false);
        toast({
          title: response.data.message,
          variant: "destructive",
          description: "Lab timed out",
        });
      }
      let key = response.data.redis_cache_key;
      let lab_status_key = response.data.lab_status_key;
      if (response.data.status === 200 || response.data.status === 201) {
        pollForLab(key, lab_status_key);
      }
      if (response.data.status == 409) {
        pollForLab(key, lab_status_key);
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
      setCreatingStarted(false);
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
      }
    }
  };

  const pollForLab = async (
    key: string | null,
    lab_status_key: string | null,
    delay: number = 8000,
    maxRetries: number = 10
  ) => {
    try {
      let resolved = false;

      const response = await fetch(`/api/poll?key=${key}&token=${token}`, {
        method: "GET",
      });
      let data = await response.json();

      data = data.data;

      if (data.status === 408) {
        setCreatingStarted(false);
        toast({
          title: data.message,
          variant: "destructive",
          description: "Lab timed out",
        });
        resolved = true;
        router.push(`/dashboard`);
      } else {
        if (data.data) {
          resolved = true;
          secureLocalStorage.setItem(
            "tialab_info",
            JSON.stringify({
              id: data.data.image_id,
              url: data.data.ingress_url,
              creation_date: data.data.creation_date,
              lab_status_key,
              duration: data.data.duration,
            })
          );
          toast({
            title: data.message,
            variant: "success",
            description: "Lab Creation",
          });
          setCreatingStarted(false);
          router.push(
            `/dashboard/labs?lab=${data.data.lab_id}&image=${data.data.image_id}`
          );
        }
        if (!resolved) {
          setJokes((prev) => [data.joke, ...prev]);

          setTimeout(
            () => pollForLab(key, lab_status_key, delay, maxRetries - 1),
            delay
          );
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
      if (maxRetries > 0) {
        setTimeout(
          () => pollForLab(key, lab_status_key, delay, maxRetries - 1),
          delay
        );
      }
    }
  };

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge  flex gap-2 p-2 items-center">
        <Link
          href="/dashboard"
          className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
        >
          All Images
        </Link>
        <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
        {currentImage?.name ? (
          <span className="p-2 rounded-md">{currentImage?.name}</span>
        ) : (
          <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
        )}
      </div>
      <div className="w-full py-12 lg:py-24 xl:py-16">
        <div className="container grid gap-6 px-4 md:px-6 lg:grid-cols-12 xl:gap-12">
          <div className="space-y-4 lg:col-span-8 xl:col-start-1 xl:space-y-8">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 capitalize">
                {!isLoading ? (
                  currentImage?.difficulty_level
                ) : (
                  <Skeleton className="w-[80px] h-[22px] rounded-md" />
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {!isLoading ? (
                  currentImage?.name
                ) : (
                  <>
                    <Skeleton className="w-[700px] h-[38px] rounded-md" />
                    <Skeleton className="w-[400px] h-[38px] rounded-md mt-2" />
                  </>
                )}
              </h1>
            </div>
            <div className="prose max-w-none">
              <p>
                {!isLoading ? (
                  currentImage?.description
                ) : (
                  <>
                    <Skeleton className="w-[700px] h-[16px] rounded-md" />
                    <Skeleton className="w-[400px] h-[16px] rounded-md mt-2" />
                  </>
                )}
              </p>
            </div>
            {/* <div className="grid gap-1.5 sm:grid-cols-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>1-2 weeks</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <UsersIcon className="w-4 h-4 flex-shrink-0" />
                <span>10,000+ learners</span>
              </div>
            </div> */}
            <Button
              ref={buttonRef}
              onClick={() => checkTimeBeforeStart(currentImage?.id)}
              className="inline-flex items-center gap-2 h-10 text-sm font-medium rounded-md bg-gray-900 px-4 shadow text-gray-50 transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            >
              {creatingStarted ? (
                <span className="px-7">
                  <InfinityLoader />{" "}
                </span>
              ) : (
                "Start Learning"
              )}
            </Button>
            <div className="mt-[100px_!important]">
              <Reviews id={id} token={token} />
            </div>
          </div>
          <div className="lg:col-span-4 xl:col-span-8 xl:col-start-9">
            {jokes.length > 0 ? (
              <Carousel
                className={`lab-card rounded-2xl p-8  w-full pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer`}
              >
                <CarouselContent>
                  {jokes.map((joke, i) => (
                    <CarouselItem key={i}>{joke}</CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
