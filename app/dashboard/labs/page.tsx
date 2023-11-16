"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Panel, PanelGroup } from "react-resizable-panels";
import { MagicSpinner } from "react-spinners-kit";

interface ILabInfo {
  id: number | null;
  url: string;
}

const LabsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [labInfo, setLabInfo] = useState<ILabInfo>();
  const [isLoading, setIsLoading] = useState(true);

  // @ts-ignore

  const token = session?.user!.tokens?.access_token;

  const handleLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    let tialab_info: ILabInfo | null = JSON.parse(
      localStorage.getItem("tialab_info") || ""
    );
    if (
      tialab_info &&
      tialab_info.hasOwnProperty("id") &&
      tialab_info.hasOwnProperty("url")
    ) {
      setLabInfo(tialab_info);
    } else {
      setLabInfo({
        id: null,
        url: "",
      });
    }
  }, []);

  const endLab = async () => {
    let formData = JSON.stringify({ image: labInfo!.id });
    toast({
      title: "Hold on we are deleting your lab.",
    });
    try {
      const response = await axios.post(
        `https://tialabs-api.tiapod.tiacloud.dev/api/v1/user/lab/delete/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        toast({
          title: response.data.message,
          variant: "success",
        });
        router.push("/dashboard/explore");
      } else {
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong. Try again",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="h-full">
      <PanelGroup
        className="h-full "
        autoSaveId="tia-lab"
        direction="horizontal"
      >
        <Panel className="h-full relative instructions" collapsible={true}>
          <div className="p-5 overflow-x-auto">
            <h1 className="font-bold text-3xl">Instructions</h1>
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
              dignissimos vel similique impedit praesentium, labore deserunt
              iure excepturi, odio illo facere quis illum, maiores vitae atque
              ipsum. Aut, cupiditate quod.
            </p>
          </div>
          <Button
            onClick={endLab}
            variant="destructive"
            className="absolute bottom-4 right-4"
          >
            End Lab
          </Button>
        </Panel>

        <ResizeHandle />
        <Panel className="h-full" collapsible={true}>
          {isLoading ? (
            <div className="h-full flex justify-center items-center">
              <MagicSpinner size={100} color="#686769" loading={isLoading} />
            </div>
          ) : null}
          <div className="h-full">
            <iframe
              src={(labInfo && labInfo.url) || ""}
              width="100%"
              height="100%"
              onLoad={handleLoad}
            ></iframe>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default LabsPage;

import { PanelResizeHandle } from "react-resizable-panels";

function ResizeHandle({ id }: { id?: string }) {
  return (
    <PanelResizeHandle className="resize-handler-outer bg-[#eee]" id={id}>
      {/* <div className="resize-handler-inner rotate-90">
        <svg className="icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
          />
        </svg>
      </div> */}
    </PanelResizeHandle>
  );
}
