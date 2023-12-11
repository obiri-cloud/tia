import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { FC } from "react";


interface ILabInfo {
    id: number | null;
    url: string;
    creation_date: string;
  }

interface IDeleteConfirmation {
  lab: ILabInfo | undefined;
  text: string;
  noText: string;
  confirmText: string;
  confirmFunc: () => void;
}
const DeleteConfirmation: FC<IDeleteConfirmation> = ({
  lab,
  text,
  noText,
  confirmText,
  confirmFunc,
}) => {
  const closeDialog = () => {
    document.getElementById("closeDialog")?.click();
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{lab?.id}</DialogTitle>
        <DialogDescription>{text}</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={closeDialog}
          className=" mt-6 disabled:bg-black-900/10 w-full bg-black text-white  glassBorder"
          variant="black"
        >
          {noText}
        </Button>
        <Button
          onClick={() => confirmFunc()}
          variant="destructive"
          className="mt-6 block py-2 px-4 rounded-md"
        >
          {confirmText}
        </Button>
      </div>
    </DialogContent>
  );
};

export default DeleteConfirmation;
