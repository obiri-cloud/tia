"use client";
import React from "react";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

import apiClient from "@/lib/request";
import { Dialog } from "@/components/ui/dialog";

const Overview = () => {
  const { labCount, imageCount } = useSelector(
    (state: RootState) => state.admin
  );

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

export async function getImageListX() {
  return await apiClient.get(`/moderator/image/list?page_size=1000`);
}
