"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NewLabForm from "./new-lab-form";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const Labs = () => {
  const { labCount, labList } = useSelector((state: RootState) => state.admin);

  const [currentLab, setCurrentLab] = useState<ILabList | null>(null);
  return (
    <TabsContent value="labs" className="space-y-4">
      <Dialog>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lab</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{labCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lab</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">{labCount}</div> */}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-4">
            <CardHeader className="flex flex-row justify-between items-center w-full">
              <div>
                <CardTitle>Lab List</CardTitle>
                <CardDescription>
                  {/* You have {labCount} image(s). */}
                </CardDescription>
              </div>
              <DialogTrigger onClick={() => setCurrentLab(null)}>
                <Button>Add Lab</Button>
              </DialogTrigger>
            </CardHeader>
            <CardContent className="pl-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-center">Image</TableHead>
                    {/* <TableHead className="text-right">Action</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labList.map((image: ILabList, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {image.name}
                      </TableCell>
                      <TableCell>{image.status}</TableCell>
                      <TableCell>{image.creation_date}</TableCell>
                      <TableCell className="text-center">
                        {image.image}
                      </TableCell>
                      {/* <TableCell className="underline font-medium text-right">
                        <DialogTrigger onClick={() => setCurrentLab(image)}>
                          <Button className="font-medium" variant="link">View</Button>
                        </DialogTrigger>
                        |<Button className="font-medium text-red-600" variant="link">Delete</Button>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <NewLabForm labDetails={currentLab} />
      </Dialog>
    </TabsContent>
  );
};

export default Labs;
