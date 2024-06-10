"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import OrgDialog from "./my-organization/org-dialog";
type BulkInviteModalProps = {
  setfile: (file:any) => void;
  onSend: () => void;
};
const BulkInviteModal = (
  {
    setfile,
    onSend
  }: BulkInviteModalProps
) => {
  const form = useForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setfile(file); 
    }
  };

  return (
    <OrgDialog
      title="Invite Members"
      description="send bulk invitation through a csv file"
    >
     
     <a href='/email.csv' download="sample.csv" className="text-blue-500 underline flex justify-center">Download a sample CSV file with the correct format to send bulk invite</a>

    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input
        onChange={handleFileChange} 
        accept=".csv"
        id="email" 
        type="file"
        className=" dark:text-white text-black"
       />
    </div>

          <Button
          id="submit-btn"
          className="w-full disabled:bg-black-900/10 mt-6 dark:bg-white dark:text-black bg-black text-white "
          variant="black"
          onClick={onSend}
        >
          Submit file
        </Button>


    </OrgDialog>
  );
};

export default BulkInviteModal;
