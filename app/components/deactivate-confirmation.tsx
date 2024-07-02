import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { FC } from "react";
import { useRef } from "react";

interface IDeactivateConfirmation {
  text: string;
  noText: string;
  confirmText: string;
  confirmFunc: () => void;
  deactivateButtonRef:any
}
const DeactivateConfirmation: FC<IDeactivateConfirmation> = ({
  text,
  noText,
  confirmText,
  confirmFunc,
  deactivateButtonRef
}) => {
  const closeDialog = () => {
    document.getElementById("closeDialog")?.click();
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogDescription>{text}</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={closeDialog}
          className=" mt-6 disabled:bg-black-900/10 w-full bg-black text-white  glassBorder"
          variant="black"
          id=""
        >
          {noText}
        </Button>
        <Button
          id="closeDialog"
          onClick={() => confirmFunc()}
          variant="destructive"
          className="mt-6 block py-2 px-4 rounded-md"
          ref={deactivateButtonRef}
        >
          {confirmText}
        </Button>
      </div>
    </DialogContent>
  );
};

export default DeactivateConfirmation;
