"use client";
import { userCheck } from "@/lib/utils";
import { AxiosError } from "axios";
import React, { SVGProps, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import Link from "next/link";
import secureLocalStorage from "react-secure-storage";
import { IActiveLab } from "@/app/types";
import AltRouteCheck from "@/app/components/alt-route-check";
import apiClient from "@/lib/request";

const ActiveLabsPage = () => {
  const [labs, setLabs] = useState([]);

  const router = useRouter();

  useEffect(() => {
    getActiveLabs();
  }, []);

  const getActiveLabs = async () => {
    try {
      const response = await apiClient.get(`/user/labs/list/`);

      setLabs(response.data.data);
    } catch (error) {
      userCheck(error as AxiosError);
    }
  };

  const viewLab = (lab: IActiveLab) => {
    secureLocalStorage.setItem(
      `tialab_info_${lab.id}`,
      JSON.stringify({
        id: lab.image.id,
        url: lab.ingress_url,
        creation_date: lab.creation_date,
        duration: lab.image.duration,
      })
    );
    router.push(`/dashboard/labs?lab=${lab.id}&image=${lab.image.id}`);
  };
  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex">
          <span className="p-2 ">Active Labs</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
        </div>
        <AltRouteCheck />
      </div>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-1">Name</TableHead>
              <TableHead className="text-right p-1">Action</TableHead>
            </TableRow>
          </TableHeader>
          {labs?.length === 0 && (
            <TableCaption>
              You have no active lab...{" "}
              <Link
                href="/dashboard"
                className="underline font-semibold dark:text-white text-black"
              >
                click here to start one
              </Link>
            </TableCaption>
          )}
          <TableBody>
            {labs
              ? labs.length > 0
                ? labs.map((image: IActiveLab, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium p-1">
                        {image.name}
                      </TableCell>

                      <TableCell className="underline font-medium text-right p-1">
                        <Button
                          variant="link"
                          onClick={() => viewLab(image)}
                          className="font-medium p-0"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActiveLabsPage;

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
