"use client";

import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<IReview[] | null>(null);

  const { data: session } = useSession();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const getReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/moderator/review/list/`,
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

      setReviews(response.data.results);
    } catch (error) {}
  };

  useEffect(() => {
    getReviews();
  }, []);
  return (
    <div className="p-4">
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
                      {new Date(review.creation_date as string).toDateString()}{" "}
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
                {new Array(5).fill(0).map((_, i) => (
                  <li key={i} className="mb-10 ms-4">
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
                ))}
              </>
            ) : null}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
