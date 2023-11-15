import LabList from "@/components/Explore/lablist";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ExplorePage() {

  return (
    <main className="pt-6">
      <div className="flex justify-center">
        <h1 className="text-center text-[clamp(6rem,calc(1.73214rem_+_3.28571vw),5.875rem)] mb-8 leading-[110px] dec-text dark:text-white text-black   tracking-[-10px]  font-extrabold uppercase ">
          Explore
        </h1>
      </div>
      <div className="container">
        <LabList/>
      </div>
    </main>
  );
}

