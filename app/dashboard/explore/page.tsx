import LabList from "@/components/Explore/lablist";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ExplorePage() {

  return (
    <main className="pt-6">
      <div className="flex justify-center">
        <h1 className="md:text-[clamp(6rem,calc(2.73214rem_+_4.28571vw),7.875rem)] 
      text-[clamp(5rem,calc(2.73214rem_+_4.28571vw),7.875rem)]
      mb-8 leading-[110px] dec-text dark:text-white text-black md:tracking-[-10px] tracking-[-5px]  font-extrabold uppercase text-center">
          Explore
        </h1>
      </div>
      <div className="container">
        <LabList/>
      </div>
    </main>
  );
}

