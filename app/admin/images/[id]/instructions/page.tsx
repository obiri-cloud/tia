"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { userCheck } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const InstructionPage = () => {
  const params = useParams();
  const router = useRouter();

  const [currentImage, setCurrentImage] = useState<ILabImage>();
  const [instructions, setInstructions] = useState<IInstruction[]>([]);

  const { data: session } = useSession();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  console.log("params", params.id);
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
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${id}/retrieve/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response", response);
    if (response.status === 200) {
      setCurrentImage(response.data);
    }
  };

  const getInstructions = async () => {
    const id = params.id;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${id}/instruction/list/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response ==>", response);
    if (response.status === 200) {
      setInstructions(response.data.data);
    }
  };

  const deleteInstruction = async (siq: number) => {
    const id = params.id;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${id}/instruction/${siq}/delete/`,
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
        toast({
          variant: "success",
          title: "Sequence Instruction Deleted",
        });
        let temp = instructions.filter((ins) => ins.sequence !== siq);
        setInstructions(temp);
      }
    } catch (error) {}
  };

  return (
    <div className="p-4">
      {currentImage?.name ? (
        <div className="flex justify-between">
          <p></p>
          <h1 className="text-center font-bold text-2xl">
            {currentImage?.name}
          </h1>
          <Button
            onClick={() =>
              router.push(`/admin/images/${params.id}/instructions/sequence/-1`)
            }
          >
            Add Instruction
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Skeleton className="w-[300px] h-[30px] rounded-md" />
        </div>
      )}
      {instructions.length >0 ? (
        <div className="">
          {instructions.map((ins, i) => (
            <div key={i} className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex flex-col gap-2">
                <p className="p-2 shadow-md rounded-md ">
                  <span className="font-bold">{ins.sequence}</span>.{" "}
                  <span
                    className="all-initial font-sans"
                    dangerouslySetInnerHTML={{ __html: ins.text.slice(0, 200) }}
                  ></span>
                </p>
              </div>
              <div className="gap-2 flex">
                <Button
                  onClick={() =>
                    router.push(
                      `/admin/images/${params.id}/instructions/sequence/${ins.sequence}`
                    )
                  }
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteInstruction(ins.sequence)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
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
  );
};

export default InstructionPage;
