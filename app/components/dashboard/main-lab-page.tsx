"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  ChangeEvent,
  FC,
  FormEvent,
  SVGProps,
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
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Toaster, toast as sooner } from "sonner";
import apiClient from "@/lib/request";

interface ILabInfo {
  id: number | null;
  url: string;
  creation_date: string;
  lab_status_key?: string;
  duration: number | null;
}

const MainLabPage = ({
  labDeletionUrl,
  redirectUrl,
}: {
  labDeletionUrl: string;
  redirectUrl: string;
}) => {
  const { data: session } = useSession();

  const [labInfo, setLabInfo] = useState<ILabInfo>({
    id: -1,
    url: "",
    creation_date: "",
    duration: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const token = session?.user!.tokens?.access_token;
  const { systemTheme, theme, setTheme } = useTheme();

  const [isNotDesktop, setIsNotDesktop] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [instructions, setInstructions] = useState<IInstruction[]>([]);
  const [prevTheme, _] = useState<string | undefined>(theme);
  const [term, setTerm] = useState<string>("");
  const drawerButton = useRef<HTMLButtonElement>(null);
  const reviewDrawerButton = useRef<HTMLButtonElement>(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("image");
  const labId = searchParams.get("id");
  let lab_key = `tialab_info_${labId}`;

  let intervalId: string | number | NodeJS.Timeout | undefined;

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

  let cnt = 0;
  let timeoutId;

  useEffect(() => {
    setTheme("light");

    return () => setTheme(prevTheme ?? systemTheme ?? "light");
  });

  useEffect(() => {
    getInstructions();
    let tialab_info: ILabInfo | null = null;

    if (secureLocalStorage.getItem(lab_key)) {
      tialab_info = JSON.parse(
        (secureLocalStorage.getItem(lab_key) as string) || ""
      );
    }

    if (
      tialab_info &&
      tialab_info.hasOwnProperty("id") &&
      tialab_info.hasOwnProperty("url")
      // tialab_info.hasOwnProperty("lab_status_key")
    ) {
      setLabInfo(tialab_info as ILabInfo);
      if (tialab_info?.lab_status_key) {
        const startPolling = () => {
          if (cnt < 5 && !term.includes("namespace")) {
            timeoutId = setTimeout(() => {
              pollStatus(tialab_info?.lab_status_key ?? "");
              cnt++;
              startPolling();
            }, 5000);
          }
        };

        startPolling();
      }
    } else {
      setLabInfo({
        id: null,
        url: "",
        creation_date: "",
        duration: null,
      });
    }

    return () => clearInterval(intervalId);
  }, []);

  const getInstructions = async () => {
    const response = await apiClient.get(`/user/image/${id}/instruction/`);
    if (response.status === 200) {
      setInstructions(response.data.data);
    }
  };

  const endLab = async () => {
    setDeleting(true);

    let formData = JSON.stringify({ image: labInfo!.id });
    toast({
      title: "Hold on we are cleaning your lab environment.",
      duration: 2000,
    });
    try {
      const response = await apiClient.post(`${labDeletionUrl}`, formData);
      if (response.data.status === 200) {
        secureLocalStorage.removeItem(`tialab_info_${lab_key}`);
        toast({
          title: "Lab Deleted Successfully...",
          variant: "success",
          duration: 2000,
        });

        let countdown = document.getElementById("countdown");
        if (countdown) {
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

  const pollStatus = async (
    key: string | null,
    delay: number = 8000,
    maxRetries: number = 10
  ) => {
    try {
      const response = await fetch(
        `/api/pollStatus?key=${key}&token=${token}`,
        {
          method: "GET",
        }
      );
      const { data } = await response.json();

      if (cnt >= 5) {
        clearInterval(intervalId);
        sooner.info("Response found and populated.");
        return;
      }

      sooner.info(data?.data ? data?.data : data?.message);
      setTerm(data?.data);
    } catch (error) {
      console.error("Error occurred:", error);
      if (maxRetries > 0) {
        setTimeout(() => pollStatus(key, delay, maxRetries - 1), delay);
      }
    }
  };

  return (
    <Dialog>
      <Toaster position="bottom-right" />
      <div className="h-full flex flex-col">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={40} minSize={30} className="">
            <div className="">
              <div className="flex justify-between p-3 border-b border-b-gray-200">
                <div className="countdown">
                  <CountdownClock
                    startTime={labInfo?.creation_date || ""}
                    time={labInfo?.duration || 0}
                    endLab={endLab}
                  />
                </div>
                <DialogTrigger className=" text-left">
                  <Button
                    disabled={deleting}
                    variant="destructive"
                    className=" disabled:bg-red-900/90 font-normal"
                  >
                    {deleting ? "Ending Lab..." : "End Lab"}
                  </Button>
                </DialogTrigger>
              </div>

              <div className="h-full playground">
                <CustomIframe>
                  <Instructions instructions={instructions} />
                </CustomIframe>
                {/* <iframe
                width="100%"
                height="100%"
              >
                <Instructions instructions={instructions} />

              </iframe> */}
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle={true} />
          <ResizablePanel defaultSize={60} minSize={50}>
            {isLoading ? (
              <div className="h-full flex justify-center items-center instructions">
                <MagicSpinner size={100} color="#686769" loading={isLoading} />
              </div>
            ) : null}
            <div className="h-full playground relative">
              <div className="absolute top-10 left-10 bg-white rounded-full p-2">
                <ArrowLeftFromLineIcon className="w-5 h-5 text-black" />
              </div>
              <iframe
                allow="clipboard-write; clipboard-read"
                src={(labInfo && labInfo.url) || ""}
                width="100%"
                height="100%"
                onLoad={handleLoad}
              ></iframe>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

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
                <div className=" bg-white rounded-t-[10px] flex-1 overflow-y-scroll">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
                  <div className="max-w-md mx-auto">
                    <Instructions instructions={instructions} />
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
      <ReviewDrawer redirectUrl={redirectUrl} />
    </Dialog>
  );
};

export default MainLabPage;

import Image from "next/image";
import { useTheme } from "next-themes";
import { CountdownClock } from "@/components/Labs/countdown";
import { DialogTrigger } from "@/components/ui/dialog";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { cn, userCheck } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const Instructions: FC<{ instructions: IInstruction[] | null }> = ({
  instructions,
}) => {
  const [currentInstruction, setCurrentInstruction] = useState<number>(0);

  return (
    <div className="">
      {instructions ? (
        <div className="p-2 overflow-x-auto text-black overflow-y-scroll  mb-[100px]">
          <h1 className="font-bold text-3xl mb-3">
            {instructions && instructions.length > 0
              ? instructions[currentInstruction].title
              : ""}
          </h1>
          <div className="flex justify-between">
            {currentInstruction - 1 > -1 ? (
              <BackIcon
                onClick={() => setCurrentInstruction(currentInstruction - 1)}
                className="w-7 h-7"
              />
            ) : (
              <span></span>
            )}

            {Array.isArray(instructions) ? (
              !(currentInstruction + 1 >= instructions.length) ? (
                <ForwardIcon
                  onClick={() => setCurrentInstruction(currentInstruction + 1)}
                  className="w-7 h-7"
                />
              ) : (
                <span></span>
              )
            ) : null}
          </div>
          {Array.isArray(instructions) ? (
            instructions.length === 0 ? (
              <p className="text-white ft-mt">
                No instructions found for this lab...
              </p>
            ) : (
              <PrismComponent
                content={
                  Array.isArray(instructions) && instructions.length > 0
                    ? instructions && instructions[currentInstruction]
                      ? instructions[currentInstruction].text
                      : ""
                    : ""
                }
              />
            )
          ) : (
            <div className="flex flex-col gap-2">
              <Skeleton className={`w-full h-[16.5px] rounded-md`} />
              <Skeleton className={`w-full h-[16.5px] rounded-md`} />
              <Skeleton className={`w-[90%] h-[16.5px] rounded-md`} />

              <div className="mt-5 flex flex-col gap-2">
                <Skeleton className={`w-[40%] h-[26.5px] rounded-md`} />
                <Skeleton className={`w-full h-[16.5px] rounded-md`} />
                <Skeleton className={`w-full h-[16.5px] rounded-md`} />
                <Skeleton className={`w-[80%] h-[16.5px] rounded-md`} />
              </div>
              <div className="mt-5 flex flex-col gap-2">
                <div className="flex justify-center">
                  <Skeleton className={`w-[40%] h-[26.5px] rounded-md`} />
                </div>
                <Skeleton className={`w-full h-[200px] rounded-md`} />
                <div className="flex justify-center">
                  <Skeleton className={`w-[80%] h-[12.5px] rounded-md`} />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-2">
          <Skeleton className="w-[70%] h-8 mb-[70px]" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-[70%] h-4 mb-2" />

          <Skeleton className="w-full h-[300px] my-4" />

          <Skeleton className="w-[70%] h-8 mb-4" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-[70%] h-4 mb-2" />

          <Skeleton className="w-full h-[300px] my-4" />
        </div>
      )}
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
import { Skeleton } from "@/components/ui/skeleton";
import PrismComponent from "@/app/components/PrismComponent";
import { ContentProps, IInstruction } from "@/app/types";
import { Label } from "@/components/ui/neo-label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CustomIframe from "@/app/components/custom-iframe";
import { ArrowLeftFromLineIcon } from "lucide-react";

const ReviewDrawer = ({ redirectUrl }: { redirectUrl: string }) => {
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
  const token = session?.user!.tokens?.access_token;
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("image");
  const [value, setValue] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = useState<string>("");

  const handleOnEsc = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      router.push(redirectUrl);
    }
  };

  const handleOnClickOutside = (e: ContentProps["onPointerDownOutside"]) => {
    router.push(redirectUrl);
  };

  const submitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value === "") {
      toast({
        variant: "destructive",
        title: "Select a rating or click out the modal to exit.",
      });
    }
    let formData = { comments: comment, review: value, image: id, user: "" };

    let formSchema = z.object({
      image: z.string().optional(),
      comments: z.string().optional(),
      review: z.string().optional(),
      user: z.string().optional(),
    });

    try {
      formSchema.parse(formData);
      await apiClient.post(
        `/user/lab/review/create/`,
        JSON.stringify(formData)
      );

      toast({
        title: "Review submitted.",
        variant: "success",
      });
      router.push(`${redirectUrl}`);
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
        <Button
          className="visible absolute top-[-1000px]"
          id="sheet-trigger"
        ></Button>
      </DialogTrigger>
      <DialogContent
        onEsc={(e) => handleOnEsc(e)}
        onClickOutside={(e) => handleOnClickOutside(e)}
      >
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white font-bold text-xl">
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
                  className=" mt-1 justify-between bg-white theme-selector w-full
                  glassBorde dark:bg-dashboardDarkInput dark:border-dashboardDarkInputBorder border-dashboardLightInputBorder border text-whiteDark dark:text-dashboardLightInputBorder  fbdyXp  focus-visible:ring-ring focus-visible:ring-offset-0 p-[12px_16px] resize-none
                  
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

const ForwardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <title />
    <g>
      <path d="M1,16A15,15,0,1,1,16,31,15,15,0,0,1,1,16Zm28,0A13,13,0,1,0,16,29,13,13,0,0,0,29,16Z" />
      <path d="M12.13,21.59,17.71,16l-5.58-5.59a1,1,0,0,1,0-1.41h0a1,1,0,0,1,1.41,0l6.36,6.36a.91.91,0,0,1,0,1.28L13.54,23a1,1,0,0,1-1.41,0h0A1,1,0,0,1,12.13,21.59Z" />
    </g>
  </svg>
);

const BackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <title />
    <g>
      <path d="M31,16A15,15,0,1,1,16,1,15,15,0,0,1,31,16ZM3,16A13,13,0,1,0,16,3,13,13,0,0,0,3,16Z" />
      <path d="M19.87,10.41,14.29,16l5.58,5.59a1,1,0,0,1,0,1.41h0a1,1,0,0,1-1.41,0L12.1,16.64a.91.91,0,0,1,0-1.28L18.46,9a1,1,0,0,1,1.41,0h0A1,1,0,0,1,19.87,10.41Z" />
    </g>
  </svg>
);
