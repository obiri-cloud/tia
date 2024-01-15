"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Panel, PanelGroup } from "react-resizable-panels";
import { MagicSpinner } from "react-spinners-kit";
import { Drawer } from "vaul";
import info from "@/public/svgs/info.svg";
import info_white from "@/public/svgs/info-white.svg";
import secureLocalStorage from "react-secure-storage";
import double_arrow_left from "@/public/svgs/double_arrow_left.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { driver } from "driver.js";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ILabInfo {
  id: number | null;
  url: string;
  creation_date: string;
}

const LabsPage = () => {
  const { data: session } = useSession();

  const [labInfo, setLabInfo] = useState<ILabInfo>({
    id: -1,
    url: "",
    creation_date: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // @ts-ignore

  const token = session?.user!.tokens?.access_token;
  const { systemTheme, theme, setTheme } = useTheme();

  const [isNotDesktop, setIsNotDesktop] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const drawerButton = useRef<HTMLButtonElement>(null);
  const reviewDrawerButton = useRef<HTMLButtonElement>(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("image");

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
    let tialab_info: ILabInfo | null = null;

    if (secureLocalStorage.getItem("tialab_info")) {
      tialab_info = JSON.parse(
        (secureLocalStorage.getItem("tialab_info") as string) || ""
      );
    }

    if (
      tialab_info &&
      tialab_info.hasOwnProperty("id") &&
      tialab_info.hasOwnProperty("url")
    ) {
      console.log("labInfo ==>", labInfo);

      setLabInfo(tialab_info as ILabInfo);
    } else {
      setLabInfo({
        id: null,
        url: "",
        creation_date: "",
      });
    }
  }, []);

  useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: ".instructions",
          popover: {
            title: "Instructions",
            description: "Instructions about the lab and be found here",
          },
        },
        {
          element: ".playground",
          popover: {
            title: "Playground",
            description: "Play around and experiment here.",
          },
        },
        {
          element: ".countdown",
          popover: {
            title: "Countdown",
            description:
              "This timer keep track of how much you have left on your lab.",
          },
        },
      ],
    });

    driverObj.drive();
  }, []);

  // useEffect(() => {
  //   try {
  //     getCurrentImage();
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       userCheck(error as AxiosError);
  //     }
  //     if (axios.isCancel(error)) {
  //       toast({
  //         title: "Image Retrieval Error",
  //         variant: "destructive",
  //         description: "Error when retrieving image info",
  //       });
  //     } else {
  //       // Handle other errors
  //     }
  //   }
  // }, []);

  // const getCurrentImage = async () => {
  //   const response = await axios.get(
  //     `${process.env.NEXT_PUBLIC_BE_URL}/user/image/${id}/retrieve/`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         // @ts-ignore
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   console.log("response", response);
  //   if (response.status === 200) {
  //     setLabInfo(response.data);
  //   }
  // };

  const endLab = async () => {
    setDeleting(true);
    console.log("formData", labInfo);

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
        secureLocalStorage.removeItem("tialab_info");
        toast({
          title: "Lab Deleted Successfully...",
          variant: "success",
        });

        let countdown = document.getElementById("countdown");
        if (countdown) {
          //@ts-ignore
          countdown?.classList.add("hidden");
        }

        if (reviewDrawerButton) {
          document.getElementById("closeDialog")?.click();
          document.getElementById("sheet-trigger")?.click();
          // reviewDrawerButton.current?.click();
        }
        // router.push("/dashboard");
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
    if (drawerButton) {
      drawerButton.current?.click();
      // reviewDrawerButton.current?.click();
    }
  };

  if (!labInfo.id) {
    return (
      <div className="container">
        Umm...seems you are trying to access an expire.
      </div>
    );
  }

  return (
    <Dialog>
      {JSON.stringify(labInfo)}
      <div className="h-full">
        <PanelGroup
          className="h-full "
          autoSaveId="tia-lab"
          direction="horizontal"
        >
          <Panel
            className={`h-full relative instructions  hidden ${
              showInstructions ? "lg:block" : "hidden"
            }`}
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
            <div className="absolute bottom-4 left-4 countdown">
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
              <div className="h-full flex justify-center items-center instructions">
                <MagicSpinner size={100} color="#686769" loading={isLoading} />
              </div>
            ) : null}
            <div className="h-full playground">
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
            className={` bottom-10 right-10 glassBorder p-5 rounded-full fixed ${
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
      <ReviewDrawer />
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
import { cn, userCheck } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";

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
    <div className="p-2 overflow-x-auto text-black ">
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

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { DialogTitle } from "@radix-ui/react-dialog";

const ReviewDrawer = () => {
  const ratings = [
    {
      value: "1",
      label: "1 - Poor",
    },
    {
      value: "2",
      label: "2 - Fair",
    },
    {
      value: "3",
      label: "3 - Good",
    },
    {
      value: "4",
      label: "4 - Very Good",
    },
    {
      value: "5",
      label: "5 - Excellent",
    },
  ];

  const { data: session } = useSession();
  //@ts-ignore
  const token = session?.user!.tokens?.access_token;
  const router = useRouter();

  //@ts-ignore
  const user = session?.user;

  const searchParams = useSearchParams();
  const id = searchParams.get("image");
  const [value, setValue] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const submitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData = { comments: comment, review: value, image: id, user: "" };

    let formSchema = z.object({
      image: z.string().optional(),
      comments: z.string().optional(),
      review: z.string().optional(),
      user: z.string().optional(),
    });

    try {
      formSchema.parse(formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/lab/review/create/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response", response);

      toast({
        title: "Review submitted.",
        variant: "success",
      });
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((err) =>
          toast({
            variant: "destructive",
            title: "An error occured when submitting your review.",
            description: err.message,
          })
        );
      }
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: "An error occured when submitting your review.",
          description: error?.response?.data.message,
        });
      }
    } finally {
      // if (buttonRef.current) {
      //   buttonRef.current.disabled = false;
      // }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="invisible" id="sheet-trigger"></Button>
      </DialogTrigger>
      <DialogContent
        onClickOutside={() => router.push("/dashboard")}
        onEsc={() => router.push("/dashboard")}
      >
        <DialogHeader>
          <DialogTitle className="text-black font-bold text-xl">
            Review this lab
          </DialogTitle>
          <DialogDescription>
            Your reviews help us make the lab better for other users.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submitReview} className="grid gap-4 py-4 text-black">
          <div className="">
            <Label htmlFor="name" className=" block">
              Rating
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className=" mt-1 justify-between dark:bg-comboBg bg-white theme-selector w-full
                  glassBorder  bg-white dark:bg-dashboardDarkInput dark:border-dashboardDarkInputBorder border-dashboardLightInputBorder border text-whiteDark dark:text-dashboardLightInputBorder  fbdyXp  focus-visible:ring-ring focus-visible:ring-offset-0 p-[12px_16px] resize-none
                  
                  "
                >
                  {value
                    ? ratings.find((rating) => rating.value == value)?.label
                    : "Select rating..."}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandEmpty>No ratings found.</CommandEmpty>
                  <CommandGroup className="dark:bg-comboBg bg-white">
                    {ratings.map((rating) => (
                      <CommandItem
                        key={rating.value}
                        value={rating.value}
                        onSelect={(currentValue) => {
                          console.log("currentValue", currentValue);

                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                        className="capitalize"
                      >
                        {rating.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === rating.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="">
            <Label htmlFor="comment" className="text-right">
              Comment
            </Label>
            <div className="relative">
              <Textarea
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setComment(e.target.value)
                }
                className="glassBorder  bg-white dark:bg-dashboardDarkInput dark:border-dashboardDarkInputBorder border-dashboardLightInputBorder border text-whiteDark dark:text-dashboardLightInputBorder  fbdyXp  focus-visible:ring-ring focus-visible:ring-offset-0 p-[12px_16px] resize-none"
                placeholder="Leave a review"
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Submit</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
