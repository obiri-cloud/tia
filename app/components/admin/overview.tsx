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

const Overview = () => {
  const { labCount, imageCount, labList, imageList } = useSelector(
    (state: RootState) => state.admin
  );
  return (
    <div className="space-y-4">
      <Dialog>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Labs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{imageCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{labCount}</div>
            </CardContent>
          </Card>
        </div>
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
          <Card className="col-span-4">
            <CardHeader className="flex flex-row justify-between items-center w-full">
              <div>
                <CardTitle>Image List</CardTitle>
                <CardDescription>
                  You have {imageCount} image(s).
                </CardDescription>
              </div>
              <DialogTrigger>
                <Button>Add Image</Button>
              </DialogTrigger>
            </CardHeader>
            <CardContent className="pl-2">
              <ImageTable imageList={imageList} />
            </CardContent>
          </Card>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Lab List</CardTitle>
              <CardDescription>You have {labCount} lab(s).</CardDescription>
            </CardHeader>
            <CardContent>
              <LabTable labList={labList} />
            </CardContent>
          </Card>
        </div>

        <NewImageForm  /> */}
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

export async function getImageListX(token: string | undefined) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/list/`,
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
