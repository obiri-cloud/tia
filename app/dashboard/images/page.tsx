"use client";
import React, { SVGProps, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import secureLocalStorage from "react-secure-storage";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { userCheck } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { MONTHS } from "@/helpers/months";
import StarRatings from "react-star-ratings";
import SquareLoader from "@/app/loaders/square";
import LineLoader from "@/app/loaders/line";

interface IUser {
  first_name: string;
  last_name: string;
}

const ImagePage = () => {
  // const { currentImage } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const id = searchParams.get("image");

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const [creatingStarted, setCreatingStarted] = useState(false);
  const [runningInstanceFound, setRunningInstanceFound] = useState(false);
  const [currentImage, setCurrentImage] = useState<ILabImage>();
  const [isActive, setIsActive] = useState(null);
  const [reviews, setReviews] = useState<IReview[] | null>(null);
  const [jokes, setJokes] = useState<string[]>([]);

  useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: ".play-button",
          popover: {
            title: "Start lab",
            description: "Click here to start a lab.",
          },
        },
        {
          element: ".reviews",
          popover: {
            title: "Lab reviews",
            description: "Read reviews about this lab here.",
          },
        },
      ],
    });

    driverObj.drive();
  }, []);

  useEffect(() => {
    async function getLoader() {
      const { square } = await import("ldrs");
      square.register();
    }
    getLoader();
  }, []);

  const startLab = async (id: number | undefined) => {
    setCreatingStarted(true);

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
      console.log("response", response);

      // setLabInfo(response.data);
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
            })
          );
          setCreatingStarted(false);
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

      console.log("data", data);

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
              lab_status_key
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
          console.log("data", data);
          setJokes((prev) => [data.joke, ...prev]);

          setTimeout(() => pollForLab(key,lab_status_key, delay, maxRetries - 1), delay);
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
      if (maxRetries > 0) {
        setTimeout(() => pollForLab(key,lab_status_key, delay, maxRetries - 1), delay);
      }
    }
  };

  useEffect(() => {
    try {
      getCurrentImage();
    } catch (error) {
      if (error instanceof AxiosError) {
        userCheck(error as AxiosError);
      }
      if (axios.isCancel(error)) {
        toast({
          title: "Image Retrieval Error",
          variant: "destructive",
          description: "Error when retrieving image info",
        });
      } else {
        // Handle other errors
      }
    }
  }, []);

  const getCurrentImage = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/user/image/${id}/retrieve/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response", response);
    if (response.status === 200) {
      setCurrentImage(response.data);
    }
  };

  useEffect(() => {
    getActiveLabs();
  }, []);

  const getActiveLabs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/labs/list/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.data.results", response.data.results);
      setIsActive(
        response.data.results.find(
          (res: IActiveLab) => String(res.image) === id
        )
      );
    } catch (error) {
      userCheck(error as AxiosError);
    }
  };

  const deleteLab = async (id: number | undefined) => {
    setCreatingStarted(true);

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
        setIsActive(null);
        toast({
          title: response.data.message,
          variant: "success",
        });
        setCreatingStarted(false);
      } else {
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);

      toast({
        title: "Something went wrong. Try again",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const getReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/lab/review/top?image=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("reviews", response.data.data);

      setReviews(response.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    getReviews();
  }, []);

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
          <Skeleton className="w-[100px] h-[16.5px] rounded-md" />
        )}
      </div>
      <div className="px-8 py-2">
        <div className="flex justify-between items-center">
          <div className="">
            {currentImage?.name ? (
              <h2 className="text-2xl font-normal">{currentImage?.name}</h2>
            ) : (
              <Skeleton className="w-[150px] h-[28px] mb-[4px] rounded-md" />
            )}
            {currentImage?.difficulty_level ? (
              <p className="text-sm capitalize font-semibold mt-4">
                Level: {currentImage?.difficulty_level}
              </p>
            ) : (
              <Skeleton className="w-[100px] h-[14px] rounded-md" />
            )}
          </div>
          <div className="">
            {creatingStarted ? (
              <SquareLoader />
            ) : (
              <div className="flex gap-4 items-center">
                {isActive ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger id="delete-lab">
                        <Trash
                          className="fill-black dark:fill-white w-[30px]"
                          onClick={() => deleteLab(currentImage?.id)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Lab</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Play
                        className="fill-black dark:fill-white play-button"
                        onClick={() => startLab(currentImage?.id)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start Lab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>

        {jokes.length > 0 ? (
          <div className="px-8 py-8">
            <Carousel>
              <CarouselContent>
                {jokes.map((joke, i) => (
                  <CarouselItem
                    className="text-center text-lg font-normal"
                    key={i}
                  >
                    {joke}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        ) : null}

        <div className="mt-8">
          <p className={`${creatingStarted ? "opacity-40" : "opacity-100"}`}>
            {currentImage?.description}
          </p>
          {creatingStarted ? (
            <div className="my-[28px_!important]">
              <LineLoader />
            </div>
          ) : (
            <div
              data-orientation="horizontal"
              role="separator"
              className="sc-4b9cd1f9-0 eZWIgh my-[30px_!important]"
            ></div>
          )}
          {runningInstanceFound ? (
            <div className="my-5 w-full">
              <p className="text-center text-red-500">
                {" "}
                You already have an instance of this image running.
                <br />
                Either delete it and start a new one or resume the old one.
              </p>
              <div className="flex gap-4 justify-center mt-5">
                <Button className="bg-red-500 text-white hover:bg-red-500/50">
                  Delete
                </Button>
                <Button className="bg-pink-200 text-white hover:bg-pink-200/50">
                  Resume
                </Button>
              </div>
            </div>
          ) : null}

          <div className="reviews">
            <h3 className="text-xl font-normal">Reviews</h3>
            <div className="mt-3">
              <ol className="relative border-s border-gray-200 dark:border-gray-700">
                {reviews ? (
                  reviews.length > 0 ? (
                    reviews.map((review, i) => (
                      <li key={i} className="mb-10 ms-4">
                        <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                        <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                          {new Date(
                            review.creation_date as string
                          ).toDateString()}{" "}
                          ·{" "}
                          {new Date(
                            review.creation_date as string
                          ).toLocaleTimeString()}
                        </time>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex gap-3">
                          <div>
                            {review.user.first_name} {review.user.last_name}{" "}
                          </div>{" "}
                          <div className="">
                            {" "}
                            <StarRatings
                              rating={Number(review.review)}
                              starDimension="20px"
                              starSpacing="1px"
                              starRatedColor="green"
                              numberOfStars={5}
                              name="rating"
                            />
                          </div>
                        </h3>
                        <p className=" font-normal">{review.comments}</p>
                      </li>
                    ))
                  ) : (
                    <p>No reviews yet...</p>
                  )
                ) : null}
                {reviews === null ? (
                  <>
                    <li className="mb-10 ms-4">
                      <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                      <Skeleton className="h-[16px] w-[250px] rounded-full mb-2" />
                      <Skeleton className="h-[16px] w-[150px] rounded-full mb-2" />
                      <StarRatings
                        rating={5}
                        starDimension="20px"
                        starSpacing="1px"
                        starRatedColor="hsl(210 40% 96.1%)"
                        numberOfStars={5}
                        name="rating"
                      />
                      <Skeleton className="h-[16px] w-[100px] rounded-full mt-2" />
                    </li>
                  </>
                ) : null}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;

const Play = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.40625 19.8633C1.875 19.8633 2.27344 19.6758 2.74219 19.4062L16.4062 11.5078C17.3789 10.9336 17.7188 10.5586 17.7188 9.9375C17.7188 9.31641 17.3789 8.94141 16.4062 8.37891L2.74219 0.46875C2.27344 0.199219 1.875 0.0234375 1.40625 0.0234375C0.539062 0.0234375 0 0.679688 0 1.69922V18.1758C0 19.1953 0.539062 19.8633 1.40625 19.8633Z"
      fill="#current"
      fill-opacity="0.85"
    />
  </svg>
);

const Trash = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 512 512"
  >
    <path
      d="M320 113V93.3c0-16.2-13.1-29.3-29.3-29.3h-69.5C205.1 64 192 77.1 192 93.3V113h-80v15h21.1l23.6 290.7c0 16.2 13.1 29.3 29.3 29.3h141c16.2 0 29.3-13.1 29.3-29.3L379.6 128H400v-15h-80zM207 93.3c0-8.1 6.2-14.3 14.3-14.3h69.5c8.1 0 14.3 6.2 14.3 14.3V113h-98V93.3h-.1zM202.7 401 192 160h14.5l10.9 241h-14.7zm60.3 0h-14V160h14v241zm46.3 0h-14.6l10.8-241H320l-10.7 241z"
      fill="#current"
      fill-opacity="0.85"
    ></path>
  </svg>
);

const ChevronRight = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 25a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42l7.3-7.29-7.3-7.29a1 1 0 1 1 1.42-1.42l8 8a1 1 0 0 1 0 1.42l-8 8A1 1 0 0 1 12 25Z"
      data-name="Layer 2"
      fill="#current"
      className="fill-2c2d3c"
    ></path>
    <path d="M0 0h32v32H0z" fill="none"></path>
  </svg>
);
