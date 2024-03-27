import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { FC, useRef } from "react";
import { IInstruction, ILabImage, ILabList } from "../types";

interface ILabInfo {
  id: number | null;
  url: string;
  creation_date: string;
}

interface IDeleteConfirmation {
  lab?: ILabInfo | ILabList | undefined;
  image?: ILabImage | undefined;
  instructions?: IInstruction | null;
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeDialog = () => {
    document.getElementById("closeDialog")?.click();
  };

  const end = () => {
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
      confirmFunc();
    }
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
          ref={buttonRef}
          onClick={() => end()}
          variant="destructive"
          className="mt-6 block py-2 px-4 rounded-md disabled:bg-red-900/90"
        >
          {confirmText}
        </Button>
      </div>
    </DialogContent>
  );
};

export default DeleteConfirmation;
