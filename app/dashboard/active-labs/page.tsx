"use client";
import { userCheck } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { ChevronRight } from "../page";
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

const ActiveLabsPage = () => {
  const [labs, setLabs] = useState([]);

  const { data: session } = useSession();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;


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
          {labs?.length === 0 && <TableCaption>You have no active lab...</TableCaption>}
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
                        <Button
                          //   onClick={() => viewImage(image)}
                          className="font-medium p-0"
                          variant="link"
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
