"use client";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { IInstruction, ILabImage } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { userCheck } from "@/lib/utils";
import axios, { AxiosError } from "axios";
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
  const [instructions, setInstructions] = useState<IInstruction[] | null>(null);
  const [currentInstruction, setCurrentInstruction] =
    useState<IInstruction | null>(null);

  const { data: session } = useSession();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  useEffect(() => {
    try {
      getCurrentImage();
      getInstructions();
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


  const getInstructions = async () => {
    const id = params.id;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${id}/image-descriptions/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      setInstructions(response.data.data);
    }
  };

  const deleteInstruction2 = async (siq: number | undefined) => {
    const id = params.id;
    console.log(id,siq)
    try {
      const response = await apiClient.delete(`/moderator/image/${String(id)}/image-descriptions/${String(siq)}/`);
      console.log({response})
      if (response.status === 204) {
        toast({
          variant: "success",
          title: "description Deleted",
        });
        if (instructions) {
          let temp = instructions.filter((ins) => ins.id !== siq);
          setInstructions(temp);
          document.getElementById("closeDialog")?.click();
        }
      }
    } catch (error) {
        console.log("error", error);
    }
  };



  const deleteInstruction = async (siq: number | undefined) => {
    const id = params.id;
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${String(id)}/image-descriptions/${String(siq)}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('==--|--|->',response)

    if (response.status === 204) {
        toast({
          variant: "success",
          title: "description Deleted",
        });
        if (instructions) {
          let temp = instructions.filter((ins) => ins.id !== siq);
          setInstructions(temp);
          document.getElementById("closeDialog")?.click();
        }
      }

    
  };

  console.log({currentInstruction})

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
        {instructions ? (
          instructions.length > 0 ? (
            <div className="">
              {instructions.map((ins, i) => (
                <div key={ins.id} className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex flex-col gap-2">
                    <p className="p-2 shadow-md rounded-md ">
                      <span className="font-bold">{ins.sequence}</span>.{" "}
                      <span className="all-initial font-sans">{ins.title}</span>
                    </p>
                  </div>
                  <div className="gap-2 flex">
                    <Button
                      onClick={() =>
                        router.push(
                          `/admin/images/${params.id}/description/sequence/${ins.id}`
                        )
                      }
                    >
                      Edit
                    </Button>
                    <DialogTrigger>
                      <Button
                        onClick={() => setCurrentInstruction(ins)}
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="">No description for this Image...</p>
          )
        ) : (
          <div className="">
            {new Array(5).fill(0).map((_, i) => (
              <div key={i} className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-full h-[70px] rounded-md" />
                </div>
                <div className="gap-2 flex">
                  <Skeleton className="w-[100px] h-[40px] rounded-md" />
                  <Skeleton className="w-[100px] h-[40px] rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <DeleteConfirmation
        instructions={currentInstruction}
        text="Do you want to delete this sequence"
        noText="No"
        confirmText="Yes, Delete this sequence"
        confirmFunc={() => deleteInstruction(currentInstruction?.id)}
      />
    </Dialog>
  );
};

export default InstructionPage;
