import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React,{useState,useEffect} from "react";


const AltRouteCheck = () => {
  const { data: session } = useSession();

  //@ts-ignore
  let subscription_plan = session?.user.data.subscription_plan;
  //@ts-ignore

  let is_super = session?.user.data.is_superuser;
  //@ts-ignore
  let is_admin = session?.user.data.is_admin;



  function renderAltRoute() {
    if (is_super) {
      return (
        <div className="flex gap-2">
          <Link href="/my-organization" className="font-medium text-mint">
            Manage organization
          </Link>
          <Link href="/admin" className="font-medium text-mint">
            Go to Admin
          </Link>
        </div>
      );
    }
     else if (
      subscription_plan === "premium" ||  subscription_plan === "standard"
    ) {
      return (
        <div className="flex gap-4">
          <Link href="/my-organization" className="font-medium text-mint">
            Manage organization
          </Link>
        </div>
      );
    } else if (is_admin) {
      return (
        <div className="flex gap-4">
          <Link href="/admin" className="font-medium text-mint">
            Go to Admin
          </Link>
        </div>
      );
    }
  }

  return <div>{renderAltRoute()}</div>;
};

export default AltRouteCheck;
