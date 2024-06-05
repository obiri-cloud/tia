"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import LabTable from "./lab-table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import NewImageForm from "./new-image-form";
import ImageTable from "./image-table";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const Overview = () => {
  const { data: session } = useSession();
  const { labCount, imageCount, labList, imageList } = useSelector(
    (state: RootState) => state.admin
  );
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;



  return (
    <div className="space-y-4">
      <Dialog>
        <div className="flex gap-4 ">
          <div
            className={`lab-card rounded-2xl p-8 lg:w-[375px] w-full pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer`}
          >
            <span className="text-[40px] font-bold">{imageCount}</span>
            <div className="mt-[40px] ">
              <h6 className="font-semibold leading-[140%] text-2xl app-text-clip h-[65px] max-h-[65px]">
                Total Images
              </h6>
            </div>
          </div>

          <div
            className={`lab-card rounded-2xl p-8 lg:w-[375px] w-full pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer`}
          >
            <span className="text-[40px] font-bold">{labCount}</span>
            <div className="mt-[40px] ">
              <h6 className="font-semibold leading-[140%] text-2xl app-text-clip h-[65px] max-h-[65px]">
                Total Labs
              </h6>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Overview;

export async function getLabListX(token: string | undefined) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_BE_URL}/moderator/labs/list/`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // @ts-ignore
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function getOrgList(token: string | undefined) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_BE_URL}/organization/retrieve/`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // @ts-ignore
        Authorization: `Bearer ${token}`,
      },
    }
  );
}



export async function getImageListX(token: string | undefined) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/list?page_size=1000`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // @ts-ignore
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
