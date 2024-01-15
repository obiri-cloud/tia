"use client";
import axios, { AxiosError } from "axios";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import edit from "@/public/svgs/edit.svg";
import cancel from "@/public/svgs/cancel.svg";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import * as z from "zod";
import { userCheck } from "@/lib/utils";
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
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { driver } from "driver.js";


const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const themes = [
  {
    value: "dark",
    label: (
      <span>
        <div className="sc-hLBbgP jouEsA">
          <div aria-hidden="true" className="sc-gMHJKX GATXs">
            <span className="sc-bcXHqe sc-csNZvx cvSnkm jlBvVU">Aa</span>
          </div>
          <span className="sc-bcXHqe sc-cxiiTX clfcKZ dvLDyp">Dark</span>
        </div>
      </span>
    ),
  },
  {
    value: "light",
    label: (
      <span>
        <div className="sc-hLBbgP jouEsA">
          <div aria-hidden="true" className="sc-gMHJKX GATXs">
            <span className="sc-bcXHqe sc-csNZvx cvSnkm dnrtPT">Aa</span>
          </div>
          <span className="sc-bcXHqe sc-cxiiTX chGwny dvLDyp">Light</span>
        </div>
      </span>
    ),
  },
];
const AccountPage = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<IUserProfile>();
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");


  const { systemTheme, theme, setTheme } = useTheme();

  const form = useForm();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const deactivateButtonRef = useRef<HTMLButtonElement>(null);

  const formSchema = z.object({
    first_name: z.string().min(3, {
      message: "Name has to be 3 characters or more",
    }),
    last_name: z.string().min(3, {
      message: "Name has to be 3 characters or more",
    }),
  });

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const getUser = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/auth/user/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUserData(response.data);
  };
  useEffect(() => {
    try {
      getUser();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const changeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFiles = e.target.files;
      const image = imageFiles[0];
      const formData = new FormData();
      formData.append("video", image);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BE_URL}auth/avatar/change/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast({
            title: "Avatar Updated",
            variant: "success",
          });
          getUser();
        } else {
          toast({
            title: "Error when updating.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
            variant: "destructive",
          });
        }
      } catch (error) {
        userCheck(error as AxiosError);

        toast({
          title: "Error when updating.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }
    let formData = {
      first_name: firstNameRef.current?.value,
      last_name: lastNameRef.current?.value,
    };

    try {
      formSchema.parse(formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/user/update/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        toast({
          variant: "success",
          title: "Profile Updated Successfully",
        });
        setEditMode(false);
        getUser();
      } else {
        toast({
          variant: "destructive",
          title: "Profile Update Error",
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);

      if (error instanceof z.ZodError) {
        error.issues.map((err) =>
          toast({
            variant: "destructive",
            title: "Profile Update Error",
            description: err.message,
          })
        );
      }
    } finally {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
      }
    }
  };

  const deactivateAccount = async () => {
    if (deactivateButtonRef.current) {
      deactivateButtonRef.current.disabled = true;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}auth/account/deactivate/`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Account deactivated successfully!",
          variant: "success",
        });
        signOut({ callbackUrl: "/login" });
      } else {
        toast({
          title: "Something went deactivating your account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);

      console.log("error", error);

      toast({
        title: "Something went deactivating your account.",
        variant: "destructive",
      });
    } finally {
      if (deactivateButtonRef.current) {
        deactivateButtonRef.current.disabled = false;
      }
    }
  };
useEffect(()=>{
  const driverObj = driver({
    showProgress: true,
    steps: [
      { element: '.theme-selector', popover: { title: 'Themes', description: 'Switch between light and dark mode.' } },
   
    ]
  });
  
  driverObj.drive();
},[])

  return (
    <div className="sc-hLBbgP sc-fLjoTV jAQqIz jVzpQn">
      <div className="sc-jEJXZe cyvxRV"></div>
      <div className="sc-hLBbgP sc-cTUoWY ioYMmf jlBsiO">
        <div className="sc-hLBbgP cAyNtX">
          <div className="sc-hLBbgP gUrCBj">
            <span className="text-left leading-8 text-2xl font-medium tracking-widest-[-0.01rem] dark:text-dashboardDarkHeadText text-whiteDark">Profile</span>
          </div>
          <div className="sc-bcXHqe sc-cRIgaW cpMQpB htAZxf">
            Manage your Tialabs profile
          </div>
        </div>
        <div className="border-b dark:border-b-dashboardDarkSeparator border-b-whiteEdge my-6"></div>
        <form onSubmit={handleSubmit}>
          <div className="sc-gGfaQS gna-dsN">
            <div className="sc-hLBbgP sc-lcKFhQ ePdqdi gvNIOZ">
              <div className="sc-hLBbgP ioYMmf">
                <label>
                  <span className="text-[0.8125rem] text-whiteDark dark:text-dashboardDarkHeadText font-medium">Profile picture</span>
                </label>
                <div className="sc-hLBbgP fHykyP">
                  <div
                    role="button"
                    className="sc-hLBbgP sc-igtUOe jKWMTP Vihrj sc-lgpvUy dHFqIb"
                  >
                    <input
                      className="hidden"
                      accept="image/png, image/jpeg"
                      type="file"
                      id="avatarUrl"
                    />
                    <div className="sc-gJqSRm bPFOEz sc-hRXZVh iZhvmM">
                      <div
                        aria-label="Avatar with initials SA"
                        className="sc-fHSyak bhauWF"
                      >
                        SA
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sc-hLBbgP ePdqdi mb-[24px]">
            <span className="text-[0.8125rem] text-whiteDark dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">Email</span>
            <div className="sc-hLBbgP sc-svekf hDbocA lhdcYD">
              <div className="sc-hLBbgP fHykyP">
                {userData?.email ? (
                  <span className="sc-bcXHqe sc-kgMPZw cpMQpB tJsVO">
                    {userData.email}
                  </span>
                ) : (
                  <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
                )}
              </div>
            </div>
          </div>
          <div className="sc-hLBbgP ePdqdi mb-[24px]">
            <span className="text-[0.8125rem] text-whiteDark dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">Username</span>
            <div className="sc-hLBbgP sc-svekf hDbocA lhdcYD">
              <div className="sc-hLBbgP fHykyP">
                {userData?.username ? (
                  <span className="sc-bcXHqe sc-kgMPZw cpMQpB tJsVO">
                    {userData.username}
                  </span>
                ) : (
                  <Skeleton className="w-[100px] h-[16.5px] rounded-md" />
                )}
              </div>
            </div>
          </div>
          <div className="sc-gGfaQS gna-dsN">
            <div className="sc-hLBbgP sc-lcKFhQ ePdqdi gvNIOZ">
              <div className="sc-hLBbgP ioYMmf">
                <label>
                  <span className="dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">First name</span>
                </label>
                <div className="sc-hLBbgP fHykyP">
                  <input
                    placeholder="First name"
                    className="kFBAIE bg-white dark:bg-dashboardDarkInput dark:border-dashboardDarkInputBorder border-dashboardLightInputBorder border text-whiteDark dark:text-dashboardLightInputBorder"
                    defaultValue={userData?.first_name}
                    ref={firstNameRef}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="sc-gGfaQS gna-dsN">
            <div className="sc-hLBbgP sc-lcKFhQ ePdqdi gvNIOZ">
              <div className="sc-hLBbgP ioYMmf">
                <label>
                  <span className="dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">Last name</span>
                </label>
                <div className="sc-hLBbgP fHykyP">
                  <input
                    placeholder="Last name"
                    className="kFBAIE bg-white dark:bg-dashboardDarkInput dark:border-dashboardDarkInputBorder border-dashboardLightInputBorder border text-whiteDark dark:text-dashboardLightInputBorder"
                    defaultValue={userData?.last_name}
                    ref={lastNameRef}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            ref={buttonRef}
            type="submit"
            className="sc-fbYMXx dxdUZf bg-pink-200 border border-pink-200"
          >
            Update
          </button>
        </form>

        <div className="sc-jEJXZe cyvxRV"></div>

        <div className="sc-hLBbgP cAyNtX ">
          <div className="sc-hLBbgP gUrCBj">
            <span className="text-left leading-8 text-2xl font-medium tracking-widest-[-0.01rem] dark:text-dashboardDarkHeadText whiteDark">Display</span>
          </div>
          <div className="sc-bcXHqe sc-cRIgaW cpMQpB htAZxf">
            Manage your theme and colors
          </div>
        </div>
        <div className="border-b dark:border-b-dashboardDarkSeparator border-b-whiteEdge my-6"></div>
        <div className="">
          <span className=" text-whiteDark text-[1.125rem] dark:text-dashboardDarkHeadText font-medium block mb-4 text-left ">Theme</span>
          <div className="sc-hLBbgP sc-islFiG ioYMmf tboTn">
            <div className="sc-hLBbgP gUrCBj">
              <div className="sc-hLBbgP sc-eAeVAz dIPdRh hOuTWu">
                <label className="text-[0.8125rem] text-whiteDark dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">
                  Interface theme
                </label>
                <span className="sc-bcXHqe sc-iuxOeI wRSCb jhSxJJ">
                  Select or customize your interface color scheme.
                </span>
              </div>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between dark:bg-comboBg bg-white theme-selector"
                  >
                    {value
                      ? themes.find((theme) => theme.value === value)?.label
                      : "Select theme..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandEmpty>No themes found.</CommandEmpty>
                    <CommandGroup className="dark:bg-comboBg bg-white">
                      {themes.map((theme) => (
                        <CommandItem
                          key={theme.value}
                          value={theme.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                            setTheme(theme.value)
                          }}
                          className="capitalize"
                        >
                          {theme.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              value === theme.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// driver

export default AccountPage;

// <div className="container pt-10">
// <div className="sm:flex block justify-between items-center">
//   <div className="flex items-center gap-4">
//     <div className="bg-gray-200 text-black   text-3xl font-bold w-[100px] h-[100px] rounded-full flex justify-center items-center">
//       {userData?.first_name[0]}
//       {userData?.last_name[0]}
//     </div>
//     <div className="relative">
//       <button className="underline underline-offset-4 font-medium ">
//         Change avatar
//       </button>
//       <input
//         onChange={changeAvatar}
//         type="file"
//         className="absolute left-0 w-auto z-10 opacity-0"
//         accept=".jpg, .jpeg, .png"
//       />
//     </div>
//   </div>
//   <button
//     ref={deactivateButtonRef}
//     onClick={deactivateAccount}
//     className="bg-red-700 sm:w-fit sm:mt-0 w-full mt-6 text-white h-auto py-3 px-6 rounded-2xl disabled:bg-red-700/60"
//   >
//     Deactivate Account
//   </button>
// </div>

// <div className="mt-10">
//   <Form {...form}>
//     <form onSubmit={handleSubmit}>
//       <div className="flex justify-between items-center">
//         <h1 className="font-medium ">Personal Information</h1>
//         {editMode ? (
//           <Button
//             type="submit"
//             ref={buttonRef}
//             className="disabled:bg-black-900/10"
//             variant="black"
//           >
//             Save
//           </Button>
//         ) : null}
//       </div>
//       <div className="relative">
//         <div
//           onClick={() => setEditMode(!editMode)}
//           className="border w-fit p-3 rounded-full absolute cursor-pointer bg-white right-[-20px] top-[-10px] "
//         >
//           <Image src={editMode ? cancel : edit} alt="edit" width={20} />
//         </div>
//         <div className="w-full grid sm:grid-cols-2 grid-cols-1 border rounded-xl mt-4 p-9 gap-4">
//           <div className="sm:mb-6 mb-3">
//             <h2 className="font-medium ">First Name</h2>
//             {editMode ? (
//               <FormField
//                 control={form.control}
//                 name="first_name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Input
//                         defaultValue={userData?.first_name}
//                         placeholder="First Name"
//                         type="text"
//                         {...field}
//                         ref={firstNameRef}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             ) : (
//               <>
//                 {userData?.first_name ? (
//                   <p className="dark:text-white text-black/70">{userData?.first_name}</p>
//                 ) : (
//                   <Skeleton className="w-full h-[25px] rounded-md" />
//                 )}
//               </>
//             )}
//           </div>
//           <div className="">
//             <h2 className="font-medium ">Last Name</h2>
//             {editMode ? (
//               <FormField
//                 control={form.control}
//                 name="last_name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Input
//                         defaultValue={userData?.last_name}
//                         placeholder="Last Name"
//                         type="text"
//                         {...field}
//                         ref={lastNameRef}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             ) : (
//               <>
//                 {userData?.last_name ? (
//                   <p className="dark:text-white text-black/70">{userData?.last_name}</p>
//                 ) : (
//                   <Skeleton className="w-full h-[25px] rounded-md" />
//                 )}
//               </>
//             )}
//           </div>
//           <div className="">
//             <h2 className="font-medium ">Email</h2>
//             <>
//               {userData?.email ? (
//                 <p className="dark:text-white text-black/70">{userData?.email}</p>
//               ) : (
//                 <Skeleton className="w-full h-[25px] rounded-md" />
//               )}
//             </>
//           </div>
//           <div className="">
//             <h2 className="font-medium ">Username</h2>
//             <>
//               {userData?.username ? (
//                 <p className="dark:text-white text-black/70">{userData?.username}</p>
//               ) : (
//                 <Skeleton className="w-full h-[25px] rounded-md" />
//               )}
//             </>
//           </div>
//         </div>
//       </div>
//     </form>
//   </Form>
// </div>
// </div>
