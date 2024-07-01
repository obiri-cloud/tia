"use client";
import React, { SVGProps, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { userCheck } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setCurrentImage } from "@/redux/reducers/userSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Arrow } from "@/public/svgs/Arrow";
import { ILabImage } from "../types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AltRouteCheck from "../components/alt-route-check";
import LabCard from "../components/LabCard";
import request from "@/lib/request";
import apiClient from "@/lib/request";
import { Separator } from "@radix-ui/react-select";

const UserPage = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: images } = useQuery(["images"], () => getImages());

  const getImages = async () => {
    try {
      const response = await apiClient.get(`/user/image/list/`);
      return response.data.data || [];
    } catch (error) {
      userCheck(error as AxiosError);
      return [];
    }
  };

  const getCategories = async () => {
    try {
      const response = await apiClient.get(`/user/image/tags/`);
      return response.data.tags || [];
    } catch (error) {
      userCheck(error as AxiosError);
      return [];
    }
  };

  const viewImage = (image: ILabImage) => {
    dispatch(setCurrentImage(image));
    router.push(`/dashboard/images?image=${image.id}`);
  };

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2">All Labs</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c]" />
        </div>
        <AltRouteCheck />
      </div>

      <div className="p-4">
        <span className="">All Labs</span>
        {/* Search Section */}
        <div className="sticky top-0 z-10 bg-white dark:bg-[#2c2d3c] p-4">
          <div className="flex justify-center my-4">
            <div className="w-1/5"></div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-3/5 p-2 border rounded-md"
            />
            <div className="w-1/5"></div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="my-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <div className="flex gap-2 mt-2">
            {catLoading ? (
              <>
                <Skeleton className="p-2 w-20 h-9 border rounded-md bg-gray-200" />
                <Skeleton className="p-2 w-20 h-9 border rounded-md bg-gray-200" />
                <Skeleton className="p-2 w-20 h-9 border rounded-md bg-gray-200" />
              </>
            ) : (
              categories.map((category: string) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`p-2 border rounded-md ${
                    selectedCategories.includes(category)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Difficulty Level Section */}
        <div className="my-4">
          <h2 className="text-lg font-semibold">Difficulty Level</h2>
          <div className="flex gap-2 mt-2">
            {difficulties.map((level) => (
              <button
                key={level}
                onClick={() => toggleDifficulty(level)}
                className={`p-2 border rounded-md ${
                  selectedDifficulty === level
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
          {isLoading ? (
            <>
              {new Array(6).fill(1).map((_, i) => (
                <Skeleton
                  key={i}
                  className="lab-card rounded-2xl w-full h-[200px]"
                />
              ))}
            </>
          )}

          {images && images.length === 0 ? (
            <div className="w-full flex justify-center  items-center col-span-12">
              <p className="text-gray-600 dark:text-white">
                No images found...
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
