import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import React, { FC, useState } from "react";

interface IDeactivateConfirmation {
  text: string;
  noText: string;
  confirmText: string;
  confirmFunc: () => void;
}

const DeactivateConfirmation: FC<IDeactivateConfirmation> = ({
  text,
  noText,
  confirmText,
  confirmFunc,
}) => {
  const [loading, setLoading] = useState(false);

  const closeDialog = () => {
    document.getElementById("closeDialog")?.click();
  };

  const handleConfirmClick = async () => {
    setLoading(true);
    try {
      await confirmFunc();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogDescription>{text}</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={closeDialog}
          className="mt-6 disabled:bg-black-900/10 w-full bg-black text-white glassBorder"
          variant="black"
        >
          {noText}
        </Button>
        <Button
          onClick={handleConfirmClick}
          variant="destructive"
          className="mt-6 block py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </div>
    </DialogContent>
  );
};

export default DeactivateConfirmation;
