"use client";

import Reviews from "@/app/components/dashboard/Reviews";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios, { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
import { TrashIcon } from "@radix-ui/react-icons";
import { IActiveLab, ILabImage } from "@/app/types";
import AltRouteCheck from "../alt-route-check";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import MultiPlanModal from "../MultiPlanModal";
import apiClient from "@/lib/request";

const MainImagePage = ({
  token,
  labCreationUrl,
  redirectUrl,
}: {
  token: string;
  labCreationUrl: string;
  redirectUrl: string;
}) => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const id = searchParams.get("image");

  const paramId = params.id;
  const gid = params.gid;
  const name = searchParams.get("name") ?? "";
  const group = searchParams.get("group_name");

  const pathname = usePathname();

  const { data: session } = useSession();
  const currentPlan = session?.user?.data?.subscription_plan;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [creatingStarted, setCreatingStarted] = useState(false);
  const [jokes, setJokes] = useState<string[]>([]);
  const [description,setDescription]=useState<any>()

  const getCurrentImage = async (id: string | null, token: string | null) => {
    if (!token && session?.expires) {
      throw new Error("Missing access token");
    }

    try {
      const response = await apiClient.get(`/user/image/${id}/retrieve/`);
      console.log("response", response);

      return response.data;
    } catch (error) {
      console.error("Failed to fetch image:", error, token);
      toast({
        title: "Failed to fetch lab info",
        variant: "destructive",
      });
      throw new Error("Failed to fetch image");
    }
  };

  const { isLoading, data: currentImage } = useQuery(["image", id], () =>
    getCurrentImage(id, token)
  );

  const { data: isActive } = useQuery(["active-labs", id], () =>
    getActiveLabs()
  );

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
          setCreatingStarted(false);
          if (buttonRef.current) {
            buttonRef.current.disabled = false;
          }

          reject("Error fetching time from server");
        });
    });
  }

  const checkTimeBeforeStart = async () => {
    setCreatingStarted(true);
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }

    getTimeFromServer()
      .then(() => {
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
      const response = await apiClient.post(`${labCreationUrl}`, formData);
      if (response.data.status === 400) {
        if (
          response.data.ingress_url &&
          response.data.lab_id &&
          response.data.image_id
        ) {
          toast({
            title: response.data.message,
            variant: "success",
            description: "Resuming your lab.",
            duration: 2000,
          });
          let data = response.data;
          console.log("==", { data });
          secureLocalStorage.setItem(
            `tialab_info_${data.id}`,
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
            `${redirectUrl}/labs?lab=${data.lab_id}&image=${data.image_id}`
          );
        } else {
          setCreatingStarted(false);
          if (buttonRef.current) {
            buttonRef.current.disabled = false;
          }
          toast({
            title: response.data.message,
            variant: "success",
            description: "Resume this lab or end this one and start a new.",
            duration: 2000,
          });
        }
      }
      if (response.data.status === 408) {
        setCreatingStarted(false);
        toast({
          title: response.data.message,
          variant: "destructive",
          description: "Lab timed out",
          duration: 2000,
        });
      }

      if (response.data.status === 409) {
        toast({
          title: response.data.message,
          duration: 2000,
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
      console.error("error this one", error);
      setOpenModal(true);
      if (error instanceof AxiosError) {
        userCheck(error as AxiosError);
      }
      if (axios.isCancel(error)) {
        toast({
          title: "Lab Creation Stopped",
          variant: "destructive",
          description: "Deleting all created resources",
          duration: 2000,
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
    delay: number = 10_000,
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
          console.log("<==>", data.data);
          secureLocalStorage.setItem(
            `tialab_info_${data.data.lab_id}`,
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
            `${redirectUrl}/labs?lab=${data.data.lab_id}&image=${data.data.image_id}`
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

  const getActiveLabs = async () => {
    if (!token && session?.expires) {
      throw new Error("Missing access token");
    }
    try {
      const response = await apiClient.get(`/user/labs/list/`);
      if (response.status === 200) {
        return response.data.data.find(
          (res: IActiveLab) => String(res.image) === id
        );
      } else {
        throw new Error("Failed to fetch active labs");
      }
    } catch (error) {
      userCheck(error as AxiosError);
    }
  };


  const getDescription = async () => {
    // const id = params.id;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${id}/image-descriptions/retrieve`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      setDescription(response.data.data);
      return response.data.data
    }
  };

  // const { data: description } = useQuery(["description"], getDescription);
 
useEffect(()=>{
  getDescription()
},[])
  return (
    <div className="">
      {" "}
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        {pathname.includes("organizations") ? (
          <div className="flex items-center">
            <Link
              href={`/dashboard/organizations`}
              className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
            >
              Organizations
            </Link>
            <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
            {name ? (
              <Link
                className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
                href={`/dashboard/organizations/${paramId}/groups?name=${name}`}
              >
                {name}
              </Link>
            ) : (
              <Skeleton className="w-[200px] h-[16.5px] rounded-md" />
            )}
            <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
            {group ? (
              <Link
                className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
                href={`/dashboard/organizations/${paramId}/groups/${gid}?name=${name}&group_name=${group}`}
              >
                {group}
              </Link>
            ) : (
              <Skeleton className="w-[200px] h-[16.5px] rounded-md" />
            )}
            <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
            {currentImage?.name ? (
              <span className="p-2 rounded-md">{currentImage?.name}</span>
            ) : (
              <Skeleton className="w-[200px] h-[16.5px] rounded-md" />
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
            >
              All Labs
            </Link>
            <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
            {currentImage?.name ? (
              <span className="p-2 rounded-md">{currentImage?.name}</span>
            ) : (
              <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
            )}
          </div>
        )}

        <AltRouteCheck />
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
                    <Skeleton className="w-[400px] h-[38px] rounded-md" />
                    <Skeleton className="w-[200px] h-[38px] rounded-md mt-2" />
                  </>
                )}
              </h1>
              <div className="mt-4 space-x-1">
                {currentImage?.tags &&
                  currentImage?.tags
                    ?.split(",")
                    .map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 border border-1 rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
              </div>
            </div>
            <div className="prose max-w-none">
              <p>
                {!isLoading ? (
                  currentImage?.description
                ) : (
                  <>
                    <Skeleton className="w-[400px] h-[16px] rounded-md" />
                    <Skeleton className="w-[200px] h-[16px] rounded-md mt-2" />
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-2">
              {isActive ? (
                <Button
                  ref={buttonRef}
                  onClick={() => checkTimeBeforeStart()}
                  className="inline-flex items-center gap-2 h-10 text-sm font-medium rounded-md bg-gray-900 px-4 shadow text-gray-50 transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                >
                  {creatingStarted ? (
                    <span className="px-7">
                      <InfinityLoader />{" "}
                    </span>
                  ) : (
                    "Resume Learning"
                  )}
                </Button>
              ) : (
                <div className="flex justify-center items-center gap-2">
                  {creatingStarted ? (
                    <Button
                      ref={buttonRef}
                      onClick={() => checkTimeBeforeStart()}
                      className="inline-flex items-center gap-2 h-10 text-sm font-medium rounded-md bg-gray-900 px-4 shadow text-gray-50 transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    >
                      <div className="px-7 flex justify-center items-center gap-2">
                        <span className="">
                          <InfinityLoader />
                        </span>
                      </div>
                    </Button>
                  ) : (
                    <Button
                      ref={buttonRef}
                      onClick={() => checkTimeBeforeStart()}
                      className="inline-flex items-center gap-2 h-10 text-sm font-medium rounded-md bg-gray-900 px-4 shadow text-gray-50 transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    >
                      Start Learning
                    </Button>
                  )}
                  {creatingStarted && <p>Lab Loading In Progress</p>}
                </div>
              )}
       
              {isActive ? (
                <Button variant="destructive" className="bg-danger flex gap-1">
                  <TrashIcon className="stroke-2 w-4 h-5" />
                  <span>Delete</span>
                </Button>
              ) : null}

            </div>
            <div dangerouslySetInnerHTML={{ __html: description?.text}} />
            <div className="mt-[100px_!important]">
              {token && id ? <Reviews id={id} token={token} /> : null}
            </div>
          </div>
          <div className="lg:col-span-4 xl:col-span-8 xl:col-start-9 p-5 w-full py-5 px-3 select-none">
            {jokes.length > 0 ? (
              <Carousel
                opts={{
                  align: "start",
                }}
                orientation="vertical"
                className="w-full max-w-lg -mt-1 h-[150px]"
              >
                <CarouselContent className="gap-4 -mt-1 h-[150px] p-6 ">
                  {jokes.map((joke, i) => (
                    <CarouselItem
                      key={i}
                      className="pt-1 md:basis-1/6 justify-center flex"
                    >
                      <div
                        className={`lab-card rounded-2xl p-8  w-[90%] pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer `}
                      >
                        {joke}˝
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : null}
          </div>
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent>
              <MultiPlanModal
                currentPlan={currentPlan}
                currentImage={currentImage}
              />
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
        </div>
      </div>
    </div>
  );
};

export default MainImagePage;
