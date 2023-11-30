"use client";
import {
  setImageCount,
  setImageList,
  setLabCount,
  setLabList,
} from "@/redux/reducers/adminSlice";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { getImageListX, getLabListX } from "./overview";
import { useDispatch } from "react-redux";

const GetAdmin = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch()

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const getLabList = async () => {
    try {
      getLabListX(token).then((response) => {
        dispatch(setLabCount(response.data.count));
        dispatch(setLabList(response.data.results));
      });
    } catch (error) {}
  };
  const getImageList = async () => {
    try {
      getImageListX(token).then((response) => {
        dispatch(setImageCount(response.data.count));
        dispatch(setImageList(response.data.results));
      });
    } catch (error) {}
  };
  useEffect(() => {
    getLabList();
    getImageList();
  }, []);
  return <div></div>;
};

export default GetAdmin;
