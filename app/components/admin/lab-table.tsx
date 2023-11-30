import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React, { FC, useState } from "react";
import NewLabForm from "./new-lab-form";
import { Skeleton } from "@/components/ui/skeleton";

interface ILabTable {
  labList: ILabList[];
}
const LabTable: FC<ILabTable> = ({ labList }) => {
  const [currentLab, setCurrentLab] = useState<ILabList | null>(null);

  return (
    <Dialog>
      <div className="space-y-8">
        {labList && labList.length ? (
          labList.map((lab, i) => (
            <div key={i} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback className="uppercase">
                  {lab.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <DialogTrigger
                className="w-full text-left"
                onClick={() => setCurrentLab(lab)}
              >
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{lab.name}</p>
                  <p className="text-sm text-muted-foreground">{lab.status}</p>
                </div>
              </DialogTrigger>
            </div>
          ))
        ) : (
          <>
            {new Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="ml-4 space-y-1">
                  <Skeleton className="h-3 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <div className="ml-auto font-medium">
                  <Skeleton className="h-9 w-[80px]" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <NewLabForm labDetails={currentLab} />
    </Dialog>
  );
};

export default LabTable;
