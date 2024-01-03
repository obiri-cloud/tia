"use client";
import { userCheck } from "@/lib/utils";
import axios, { AxiosError } from "axios";
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ActiveLabsPage = () => {
  const [labs, setLabs] = useState([]);

  const { data: session } = useSession();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const router = useRouter();

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

      setLabs(response.data.results);
    } catch (error) {
      userCheck(error as AxiosError);
    }
  };
  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge  flex gap-2 p-2">
        <span className="p-2 ">Active Images</span>
        <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
      </div>
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-1">Name</TableHead>
              <TableHead className="p-1">Difficulty Level</TableHead>
              <TableHead className="text-right p-1">Action</TableHead>
            </TableRow>
          </TableHeader>
          {labs?.length === 0 && (
            <TableCaption>You have no active lab...</TableCaption>
          )}
          <TableBody>
            {labs
              ? labs.length > 0
                ? labs.map((image: ILabImage, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium p-1">
                        {image.name}
                      </TableCell>
                      <TableCell className="p-1">
                        {image.difficulty_level}
                      </TableCell>
                      <TableCell className="underline font-medium text-right p-1">
                        <Link
                          href={`/dashboard/labs?lab=${image.id}&image=${image.image}`}
                          className="font-medium p-0"
                        >
                          View
                        </Link>
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
