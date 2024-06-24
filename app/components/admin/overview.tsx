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
import apiClient from "@/lib/request";

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

//refactor later

export async function getLabListX(token: string | undefined) {
  return await apiClient.get(`/moderator/labs/list/`);
}

export async function getOrgList(token: string | undefined) {
  return await apiClient.get(`/organization/retrieve/`);
}

export async function getImageListX(token: string | undefined) {
  return await apiClient.get(`/moderator/image/list?page_size=1000`);
}
