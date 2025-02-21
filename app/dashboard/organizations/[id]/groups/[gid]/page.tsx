"use client";
import { ILabImage, ISession, NoInvitationsResponse } from "@/app/types";
import { Skeleton } from "@/components/ui/skeleton";
import { userCheck } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useQuery } from "react-query";
import { Arrow } from "@/public/svgs/Arrow";
import AltRouteCheck from "@/app/components/alt-route-check";
import apiClient from "@/lib/request";

const OrganizationGroupImagePage = () => {
  console.log("OrganizationGroupImagePage");

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id;
  const gid = params.gid;
  const name = searchParams.get("name");
  const group = searchParams.get("group_name");
  const { data: session } = useSession();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const getOrgnaizationGroupImages = async (): Promise<
    ILabImage[] | undefined
  > => {
    try {
      const response = await apiClient.get(
        `/user/org/${id}/group/${gid}/images/`
      );

      return response.data.data;
    } catch (error) {
      userCheck(error as AxiosError);
    }
  };

  const { data: images, isLoading } = useQuery(
    ["organization-group-images", id, gid],
    () => getOrgnaizationGroupImages()
  );

  const viewImage = (image: ILabImage) => {
    router.push(
      `/dashboard/organizations/${id}/groups/${gid}/images?image=${image.id}&name=${name}&group_name=${group}`
    );
  };

  console.log("images", images);

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <Link
            href={`/dashboard/organizations`}
            className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
          >
            Organizations
          </Link>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />

          {name ? (
            <Link
              className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
              href={`/dashboard/organizations/${id}/groups?name=${name}`}
            >
              {name}
            </Link>
          ) : (
            <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
          )}
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />

          {group ? (
            <span className="p-2 rounded-md">{group}</span>
          ) : (
            <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
          )}
        </div>
        <AltRouteCheck />
      </div>

      <div className="p-4 ">
        <div>
          {!isLoading && images ? (
            isNoInvitationsResponse(images) ? (
              <p className="dark:text-white text-black w-full text-center">
                {images.message}...
              </p>
            ) : (
              <div className="all-images-list xl:flex grid lg:grid-cols-3  flex-wrap w-full  gap-3">
                {images.map((image: ILabImage, i: number) => (
                  <div
                    onClick={() => viewImage(image)}
                    key={i}
                    className={`lab-card rounded-2xl p-8 lg:w-[375px] w-full pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer`}
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
                    </div>
                    <span className="flex gap-[10px] items-center h-fit lg:mt-[36px] mt-[28px] font-medium ">
                      <h5 className="leading-[150%] font-medium">Go to lab</h5>
                      <Arrow className="pointer  -rotate-45 transition-all delay-150 dark:fill-white fill-black" />
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : !isLoading && images === undefined ? (
            <p className="dark:text-white text-black w-full text-center">
              Organization have not assigned Labs to this group yet
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationGroupImagePage;

function isNoInvitationsResponse(
  images: NoInvitationsResponse | ILabImage[]
): images is NoInvitationsResponse {
  return (
    (images as NoInvitationsResponse).message !== undefined &&
    (images as NoInvitationsResponse).status === 404
  );
}
