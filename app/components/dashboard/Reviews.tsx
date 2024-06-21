import { IReview } from "@/app/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import React, { useRef } from "react";
import { useQuery } from "react-query";
import StarRatings from "react-star-ratings";
import apiClient from "@/lib/request";

const Reviews = ({ id, token }: { id: string | null; token: string }) => {
  const getReviews = async (
    id: string | null,
    token: string
  ): Promise<IReview[] | null> => {
    const response = await apiClient.get(`/user/lab/review/top?image=${id}`);

    if (response.status === 200) {
      return response.data.data;
    } else {
      toast({
        title: "Failed to fetch reviews",
        variant: "destructive",
      });
      throw new Error("Failed to fetch reviews");
    }
  };

  const {
    isLoading,
    error,
    data: reviews,
  } = useQuery(["review", id], () => getReviews(id, token));

  return (
    <section className="reviews">
      <div className="">
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          {!isLoading && reviews ? (
            reviews.length > 0 ? (
              reviews.map((review, i) => (
                <li key={i} className="mb-10 ms-4">
                  <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                  <time className="mb-1 font-normal leading-none text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.creation_date as string).toDateString()} ·{" "}
                    {new Date(
                      review.creation_date as string
                    ).toLocaleTimeString()}
                  </time>
                  <h3 className="text-base font-semibold text-black dark:text-white flex gap-3">
                    <div>
                      {review.user?.first_name ?? "John"}{" "}
                      {review.user?.last_name ?? "Doe"}{" "}
                    </div>{" "}
                    <div className="">
                      <StarRatings
                        rating={Number(review.review)}
                        starDimension="20px"
                        starSpacing="1px"
                        starRatedColor="#4fb05c"
                        numberOfStars={5}
                        name="rating"
                      />
                    </div>
                  </h3>
                  <p className="text-sm leading-loose text-gray-500 dark:text-gray-400">
                    {review.comments}
                  </p>
                </li>
              ))
            ) : (
              <p>No reviews yet...</p>
            )
          ) : null}
          {!isLoading && !reviews ? (
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
    </section>
  );
};

export default Reviews;
