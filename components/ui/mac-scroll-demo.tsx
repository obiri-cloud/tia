import React from "react";
import Link from "next/link";
import { MacbookScroll } from "@/app/components/home/macbook-scroll";


export function MacbookScrollDemo() {
  return (
    <div className="overflow-hidden  w-full">
      <MacbookScroll
        showGradient={false}
      />
    </div>
  );
}