"use client";
import React, { useEffect, useState } from "react";
import fullscreen from "@/public/svgs/fullscreen.svg";
import exit from "@/public/svgs/exit.svg";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

const Fullscreen = () => {
  const searchParams = useSearchParams();

  const [isFull, setIsFull] = useState<boolean>(false);

  var elem = document.documentElement;

  const toogleFullscreen = () => {
    setIsFull((isFull) => !isFull);
    !isFull ? elem.requestFullscreen() : document.exitFullscreen();
  };

  return (
    <>
      {searchParams.get("lab") ? (
        <li className="flex">
          <button onClick={toogleFullscreen}>
            {isFull ? (
              <Image src={exit} alt="exit" className="w-[20px]" />
            ) : (
              <Image src={fullscreen} alt="fullscreen" className="w-[20px]" />
            )}
          </button>
        </li>
      ) : null}
    </>
  );
};

export default Fullscreen;
