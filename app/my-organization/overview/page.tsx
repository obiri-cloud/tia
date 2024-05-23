'use client'
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { ChevronRight} from "lucide-react"
import { useSession } from "next-auth/react";
import Link from "next/link"
import { ResponsiveLine } from "@nivo/line";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useQuery } from "react-query";

 const  OverView=()=> {
    const { data: session } = useSession();
    const token = session?.user!.tokens?.access_token;
    const org_id = session?.user!.data?.organization_id;

console.log(typeof org_id);



const getOverview = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/statistics/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log({statistics:response.data})
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };



  const{
    isLoading,
    data: overviewData,
  } = useQuery(["orgOverview"], () => getOverview());

  



  return (
 <div className="">
    <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
    <div className="flex items-center ml-2">
      <span className="p-2 ">Organzation</span>
      <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
      Overview
    </div>

    {session?.user && session?.user.data.is_admin ? (
      <Link href="/dashboard" className="font-medium text-mint mr-9">
        Go to dashboard
      </Link>
    ) : null}

   </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 p-4">
        {
            isLoading?
            (<>
             <Skeleton
              className="rounded-lg p-8 lg:w-[375px] w-full  h-[150px]"
              />
              <Skeleton
              className="rounded-lg p-8 lg:w-[375px] w-full  h-[150px]"
              />
              <Skeleton
              className="rounded-lg p-8 lg:w-[375px] w-full  h-[150px]"
              />
              <Skeleton
              className="rounded-lg p-8 lg:w-[375px] w-full  h-[150px]"
              />
            </>)

          :(
         <>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Total Members</CardTitle>
                <CardDescription>Number of members in the organization</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center flex-1">
                <span className="text-4xl font-bold">{overviewData?.total_members}</span>
              </CardContent>
            </Card>
          </div>
    
          <div className="rounded-lg border border-gray-200 dark:border-gray-800">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Total Groups</CardTitle>
                <CardDescription>Number of groups in the organization</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center flex-1">
                <span className="text-4xl font-bold">{overviewData?.total_groups}</span>
              </CardContent>
            </Card>
          </div>
    
          <div className="rounded-lg border border-gray-200 dark:border-gray-800">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Total Labs</CardTitle>
                <CardDescription>Number of labs the organization</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center flex-1">
                <span className="text-4xl font-bold">{overviewData?.total_labs}</span>
              </CardContent>
            </Card>
          </div>
    
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 mr-4">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Number of pending invitations</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center flex-1">
                <span className="text-4xl font-bold">{overviewData?.total_pending_invitations}</span>
              </CardContent>
            </Card>
          </div>
        </>
          )
        }


    </div>
</div>

  )
}

export default OverView


function LineChart(props:any) {
    return (
      <div {...props}>

      </div>
    )
  }