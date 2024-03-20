"use client";
import React, { SVGProps, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import secureLocalStorage from "react-secure-storage";
import { MetroSpinner } from "react-spinners-kit";
import { userCheck } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setCurrentImage } from "@/redux/reducers/userSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { driver } from "driver.js";
import arrow from "@/public/svgs/arrow.svg";
import Image from "next/image";

interface ILabListItem {
  id: number;
  name: string;
  image: number;
  ingress_url: string;
  creation_date: string;
}

const UserPage = () => {
  const [labs, setLabs] = useState<ILabListItem[]>();
  const [disabled, setDisabled] = useState(false);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const router = useRouter();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const [images, setImages] = useState<ILabImage[]>();

  useEffect(() => {
    getImages();
  }, []);
  useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: ".all-images-button",
          popover: {
            title: "Labs",
            description: "Click here to view all available labs.",
          },
        },
        {
          element: ".active-labs-button",
          popover: {
            title: "Active Labs",
            description: "Click here to view all your active labs.",
          },
        },
        {
          element: ".account-button",
          popover: {
            title: "Account",
            description: "View and update your account info here.",
          },
        },
        {
          element: ".logout-button",
          popover: { title: "Logout", description: "Click here to logout" },
        },
        {
          element: ".all-images-list",
          popover: {
            title: "Images",
            description: "Start a lab by clicking on one of the images.",
          },
        },
      ],
    });

    driverObj.drive();
  }, []);

  const getImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/image/list/`,
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

      setImages(response.data.results);
    } catch (error) {
      userCheck(error as AxiosError);
    }
  };

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

  const resumeLab = (data: ILabListItem) => {
    console.log("data", data);

    secureLocalStorage.setItem(
      "tialab_info",
      JSON.stringify({
        id: data.image,
        url: data.ingress_url,
        creation_date: data.creation_date,
      })
    );
    router.push(`/dashboard/labs?lab=${data.id}`);

    toast({
      title: "Lab Resumed",
      variant: "success",
    });
  };

  const deleteLab = async (id: number) => {
    setDisabled(true);
    let formData = JSON.stringify({ image: id });
    toast({
      title: "Hold on we are deleting your lab.",
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
        toast({
          title: response.data.message,
          variant: "success",
        });
        setDisabled(false);
        setLabs((prev) => prev?.filter((lab) => lab.image !== id));
      } else {
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      userCheck(error as AxiosError);

      toast({
        title: "Something went wrong. Try again",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const viewImage = (image: ILabImage) => {
    dispatch(setCurrentImage(image));
    router.push(`/dashboard/images?image=${image.id}`);
  };

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex gap-2 p-2">
        <span className="p-2 ">All Images</span>
        <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
      </div>
      <div className="p-4 ">
        {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 */}
        <div className="all-images-list flex flex-wrap w-full  gap-3">
          {images && images.length >= -1 ? (
            images.map((image, i) => (
              <div
                onClick={() => viewImage(image)}
                key={i}
                className={`lab-card rounded-2xl p-8 lg:w-[375px] w-full pl-6 neu-shadow sh bg-white cursor-pointer`}
              >
                <img
                  src={image.image_picture ?? ""}
                  alt=""
                  className="w-[60px] h-[60px]"
                />
                <div className="mt-[40px] ">
                  <h6 className="font-semibold leading-[140%] text-2xl app-text-clip h-[65px] max-h-[65px]">
                    {image.name}
                  </h6>
                  <p className="mt-2  app-text-clip ">
                    {image.description}
                    {/* Our Kubernetes Fundamentals Sandbox Lab provides a
                    comprehensive and beginner-friendly introduction to
                    Kubernetes. */}
                  </p>
                </div>
                <a
                  // href={image.link}
                  className="flex gap-[10px] items-center h-fit lg:mt-[36px] mt-[28px] font-medium "
                >
                  <h5 className="leading-[150%] font-medium">Go to lab</h5>
                  {/* <Arrow fill="black" /> */}
                  <Image className="pointer rot -rotate-45 transition-all delay-150" src={arrow} alt="" />
                </a>
              </div>
            ))
          ) : (
            <>
              {new Array(6).fill(1).map((_, i) => (
                <Skeleton key={i} className="lab-card rounded-2xl p-8 lg:w-[375px] w-full  h-[200px]" />
              ))}
            </>
          )}

          {images && images.length === 0 ? (
            <div className="w-full flex justify-center h-[400px] items-center">
              <p className="text-gray-600">No images found...</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserPage;

const ChevronRight = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 25a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42l7.3-7.29-7.3-7.29a1 1 0 1 1 1.42-1.42l8 8a1 1 0 0 1 0 1.42l-8 8A1 1 0 0 1 12 25Z"
      data-name="Layer 2"
      fill="#current"
      className="fill-2c2d3c"
    ></path>
    <path d="M0 0h32v32H0z" fill="none"></path>
  </svg>
);

// <Table>
// <TableHeader>
//   <TableRow>
//     <TableHead className="p-1">Name</TableHead>
//     <TableHead className="p-1">Difficulty Level</TableHead>
//     <TableHead className="text-right p-1">Action</TableHead>
//   </TableRow>
// </TableHeader>
// {images?.length === 0 && (
//   <TableCaption>No images found...</TableCaption>
// )}
// <TableBody>
//   {images
//     ? images.length > 0
//       ? images.map((image, i) => (
//           <TableRow key={i}>
//             <TableCell className="font-medium p-1">
//               {image.name}
//             </TableCell>
//             <TableCell className="p-1">
//               {image.difficulty_level}
//             </TableCell>
//             <TableCell className="underline font-medium text-right p-1">
//               <Button
//                 onClick={() => viewImage(image)}
//                 className="font-medium p-0"
//                 variant="link"
//               >
//                 View
//               </Button>
//             </TableCell>
//           </TableRow>
//         ))
//       : null
//     : null}
// </TableBody>
// </Table>
