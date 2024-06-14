"use client";
import {
  setImageCount,
  setImageList,
  setLabCount,
  setLabList,
} from "@/redux/reducers/adminSlice";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { getImageListX, getLabListX, getOrgList } from "./overview";
import { useDispatch } from "react-redux";
import { setOrgData } from "@/redux/reducers/OrganizationSlice";

const GetAdmin = () => {
  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const dispatch = useDispatch();

  // @ts-ignore
  const getLabList = async () => {
    try {
      getLabListX(token).then((response) => {
        dispatch(setLabCount(response.data.count));
        dispatch(setLabList(response.data.data));
      });
    } catch (error) {}
  };

  const getOrg = async () => {
    try {
      getOrgList(token).then((response) => {
        console.log({ "response.data.data": response.data.data });
        dispatch(setOrgData(response.data.data));
      });
    } catch (error) {}
  };

  const getImageList = async () => {
    try {
      getImageListX(token).then((response) => {
        dispatch(setImageCount(response.data.count));
        dispatch(setImageList(response.data.data));
      });
    } catch (error) {}
  };
  useEffect(() => {
    getLabList();
    getImageList();
    getOrg();
  }, []);
  return <div></div>;
};

export default GetAdmin;
