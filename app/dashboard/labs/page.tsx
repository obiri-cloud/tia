"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Panel, PanelGroup } from "react-resizable-panels";
import { MagicSpinner } from "react-spinners-kit";
import { Drawer } from "vaul";
import info from "@/public/svgs/info.svg";
import info_white from "@/public/svgs/info-white.svg";
import secureLocalStorage from "react-secure-storage";
import double_arrow_left from "@/public/svgs/double_arrow_left.svg";
import { Dialog } from "@/components/ui/dialog";
interface ILabInfo {
  id: number | null;
  url: string;
  creation_date: string;
}

const LabsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [labInfo, setLabInfo] = useState<ILabInfo>();
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // @ts-ignore

  const token = session?.user!.tokens?.access_token;
  const { systemTheme, theme, setTheme } = useTheme();

  const [isNotDesktop, setIsNotDesktop] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const drawerButton = useRef<HTMLButtonElement>(null);

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setIsNotDesktop(true);
    } else {
      setIsNotDesktop(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  const handleLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    let tialab_info: ILabInfo | null = JSON.parse(
      (secureLocalStorage.getItem("tialab_info") as string) || ""
    );
    console.log("tialab_info", tialab_info);

    if (
      tialab_info &&
      tialab_info.hasOwnProperty("id") &&
      tialab_info.hasOwnProperty("url")
    ) {
      console.log("labInfo ==>", labInfo);

      setLabInfo(tialab_info);
    } else {
      setLabInfo({
        id: null,
        url: "",
        creation_date: "",
      });
    }
  }, []);

  const endLab = async () => {
    setDeleting(true);
    let formData = JSON.stringify({ image: labInfo!.id });
    toast({
      title: "Hold on we are cleaning your lab environment.",
    });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/lab/delete/`,
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
        secureLocalStorage.removeItem("tialabs_info");
        toast({
          title: "Lab Deleted Successfully...",
          variant: "success",
        });
        router.push("/dashboard/explore");
      } else {
        toast({
          title: "Something went wrong. Try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong. Try again",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleClick = () => {
    console.log("click");

    if (drawerButton) {
      drawerButton.current?.click();
    }
  };

  return (
    <Dialog>
      <div className="h-full">
        <PanelGroup
          className="h-full "
          autoSaveId="tia-lab"
          direction="horizontal"
        >

            <Panel
              className={`h-full relative instructions  hidden ${showInstructions? 'lg:block': 'hidden'}`}
              collapsible={true}
            >
              <div className="flex justify-end p-3">
                <button
                  onClick={() =>
                    setShowInstructions(
                      (setShowInstructions) => !setShowInstructions
                    )
                  }
                  className="bg-gray-300 shadow-md p-3 w-fit rounded-full instructions-toggle"
                >
                  <Image
                    src={double_arrow_left}
                    alt="double_arrow_left"
                    className="arrow-img"
                  />
                </button>
              </div>
              <Instructions />
              <div className="absolute bottom-4 left-4">
                <CountdownClock
                  startTime={labInfo?.creation_date || ""}
                  endLab={endLab}
                />
              </div>
              <DialogTrigger className="w-full text-left">
                <Button
                  disabled={deleting}
                  variant="destructive"
                  className="absolute bottom-4 right-4 disabled:bg-red-900/90"
                >
                  {deleting ? "Ending Lab..." : "End Lab"}
                </Button>
              </DialogTrigger>
            </Panel>
          {showInstructions ? <ResizeHandle /> : null}
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
        {isNotDesktop ? (
          <button
            onClick={handleClick}
            className={` bottom-10 left-10 glassBorder p-5 rounded-full fixed ${
              theme == "dark" ? "bg-white" : "bg-black"
            }`}
          >
            {theme === "dark" ? (
              <Image alt="info" src={info} />
            ) : (
              <Image alt="info" src={info_white} />
            )}
          </button>
        ) : null}

        {isNotDesktop ? (
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <button ref={drawerButton}></button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0">
                <div className=" bg-white rounded-t-[10px] flex-1">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
                  <div className="max-w-md mx-auto">
                    <Instructions />
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        ) : null}

        {!showInstructions ? (
          <button
            onClick={() =>
              setShowInstructions((setShowInstructions) => !setShowInstructions)
            }
            className="bg-gray-300 shadow-md p-3 w-fit rounded-full absolute instructions-toggle bottom-10 left-10 glassBorder rotate-180 "
          >
            <Image
              src={double_arrow_left}
              alt="double_arrow_left"
              className="arrow-img"
            />
          </button>
        ) : null}
      </div>
      <DeleteConfirmation
        lab={labInfo}
        text="Do you want to delete this lab"
        noText="No, resume lab"
        confirmText="Yes, Delete this lab"
        confirmFunc={() => endLab()}
      />
    </Dialog>
  );
};

export default LabsPage;

import { PanelResizeHandle } from "react-resizable-panels";
import Image from "next/image";
import { useTheme } from "next-themes";
import { CountdownClock } from "@/components/Labs/countdown";
import { DialogTrigger } from "@/components/ui/dialog";
import DeleteConfirmation from "@/app/components/delete-confirmation";

function ResizeHandle({ id }: { id?: string }) {
  return (
    <PanelResizeHandle
      className="resize-handler-outer bg-[#eee] hover:bg-black/30  lg:block hidden"
      id={id}
    >
      <div className="resize-handler-inner hidden rotate-90">
        <svg className="icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
          />
        </svg>
      </div>
    </PanelResizeHandle>
  );
}

const Instructions = () => {
  return (
    <div className="p-2 overflow-x-auto">
      <h1 className="font-bold text-3xl">Instructions</h1>
      <p className="">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
        dignissimos vel similique impedit praesentium, labore deserunt iure
        excepturi, odio illo facere quis illum, maiores vitae atque ipsum. Aut,
        cupiditate quod.
      </p>
    </div>
  );
};
