"use client";
import React, { SVGProps, useEffect, useState } from "react";
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
import { useQuery } from "react-query";
import AltRouteCheck from "../components/alt-route-check";
import LabCard from "../components/LabCard";
import request from "@/lib/request";
import apiClient from "@/lib/request";

const UserPage = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: images } = useQuery(["images"], () => getImages());

  const getImages = async () => {
    try {
      const response = await apiClient.get(`/user/image/list/`);
      return response.data.data;
    } catch (error) {
      userCheck(error as AxiosError);
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
          <span className="p-2 ">All Labs</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
        </div>
        <AltRouteCheck />
      </div>

      <div className="p-4 ">
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
          {images && images.length >= -1 ? (
            images.map((image: ILabImage, i: number) => (
              <LabCard key={i} lab={image} viewImage={viewImage} />
            ))
          ) : (
            <>
              {new Array(6).fill(1).map((_, i) => (
                <Skeleton
                  key={i}
                  className="lab-card rounded-2xl  w-full  h-[200px]"
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
