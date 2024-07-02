"use client";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { IInstruction, ILabImage } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/request";

const InstructionPage = () => {
  const params = useParams();
  const router = useRouter();

  const [currentImage, setCurrentImage] = useState<ILabImage>();
  const [instruction, setInstruction] = useState<IInstruction | null>(null);
  const [currentInstruction,setCurrentInstruction]=useState<IInstruction | null>(null)

  const { data: session } = useSession();
  const token = session?.user!.tokens?.access_token;

  useEffect(() => {
    try {
      getCurrentImage();
      getInstruction();
    } catch (error) {
      if (axios.isCancel(error)) {
        toast({
          title: "Image Retrieval Error",
          variant: "destructive",
          description: "Error when retrieving image info",
        });
      } else {
        // Handle other errors
      }
    }
  }, []);

  const getCurrentImage = async () => {
    const id = params.id;

    const response = await apiClient.get(`/moderator/image/${id}/retrieve/`);
    if (response.status === 200) {
      setCurrentImage(response.data);
    }
  };

  const getInstruction = async () => {
    const id = params.id;
    const response = await apiClient.get(`/moderator/image/${id}/image-descriptions/retrieve`);

    if (response.data.status === 200) {
      setInstruction(response.data.data);
    }
  };

  const deleteInstruction = async (siq: number | undefined) => {
    const id = params.id;
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${String(id)}/image-descriptions/delete/`,
    {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
   );
    if (response.status === 204) {
      toast({
        variant: "success",
        title: "description Deleted",
      });
      setInstruction(null);
      document.getElementById("closeDialog")?.click();
    }
  };

  return (
    <Dialog>
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          {currentImage?.name ? (
            <span className="p-2 rounded-md">{currentImage?.name}</span>
          ) : (
            <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
          )}
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
        </div>
        {session?.user && session?.user.data.is_admin ? (
          <Link href="/dashboard" className="font-medium text-mint">
            Go to labs
          </Link>
        ) : null}
      </div>
      <div className="p-4">
        {currentImage?.name ? (
          <div className="flex justify-between">
            <p></p>
            <h1 className="text-center font-bold text-2xl">
              {currentImage?.name}
            </h1>
            <Button
              onClick={() =>
                router.push(
                  `/admin/images/${params.id}/description/sequence/-1`
                )
              }
            >
              Add description
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Skeleton className="w-[300px] h-[30px] rounded-md" />
          </div>
        )}
        {instruction ? (
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex flex-col gap-2">
              <p className="p-2 shadow-md rounded-md ">
                <span className="font-bold">{instruction.sequence}</span>.{" "}
                <span className="all-initial font-sans">{instruction.title}</span>
              </p>
            </div>
            <div className="gap-2 flex">
              <Button
                onClick={() =>
                  router.push(
                    `/admin/images/${params.id}/description/sequence/${instruction.id}`
                  )
                }
              >
                Edit
              </Button>
              <DialogTrigger>
                <Button
                  onClick={() => setCurrentInstruction(instruction)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </DialogTrigger>
            </div>
          </div>
        ) : (
          <p className="">No description for this Image...</p>
        )}
      </div>
      <DeleteConfirmation
        instructions={currentInstruction}
        text="Do you want to delete this description"
        noText="No"
        confirmText="Yes, Delete this sequence"
        confirmFunc={() => deleteInstruction(currentInstruction?.id)}
      />
    </Dialog>
  );
};

export default InstructionPage;
