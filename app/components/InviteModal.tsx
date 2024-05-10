"use client";
import React, { FormEvent, useRef} from "react";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import * as z from "zod";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import OrgDialog from "./my-organization/org-dialog";

type InviteModalProps = {
  onSubmit: () => void; 
  setemailInput: (email: string) => void;
  emailInput: any; 
  bulkEmails: any[]; 
  onRemoveEmail: (email: string) => void; 
  onSend: () => void;
};
const InviteModal = (
  {
    onSubmit,
    emailInput,
    setemailInput,
    bulkEmails,
    onRemoveEmail,
    onSend
  }: InviteModalProps
) => {
  const form = useForm();



  return (
    <OrgDialog
      title="Invite Members"
      description="Invites users to your organization"
    >
{bulkEmails.length===0&&(
    <div className="flex items-center justify-center">
     <p className=" capitalize dark:text-white text-black">no added email</p>
    </div>
)}

<div className="grid grid-cols-2 gap-4 mb-4">


      {bulkEmails.map((email, index) => (
        <div key={index} className="dark:bg-white dark:text-black overflow-hidden text-white bg-black rounded p-2 flex items-center justify-between">
          <div className="w-32 overflow-hidden text-white text-ellipsis whitespace-nowrap">
            {email.email}
          </div>
          <button
            type="button"
            onClick={() => onRemoveEmail(email)}
            className="bg-red-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs"
          >
            x
          </button>
        </div>
      ))}
    </div>

 
    <div className="flex items-center gap-2">
  <Input
    value={emailInput}
    onChange={(e) => setemailInput(e.target.value)}
    placeholder="Email"
    type="text"
    className="flex-grow glassBorder bg-white dark:bg-black/10 dark:text-white text-black"
  />
  <Button
    id="submit-button"
    className="shrink-0 bg-black text-white disabled:bg-black-900/10"
    variant="black"
    onClick={onSubmit}
  >
    Add Email
  </Button>
</div>

{bulkEmails.length>0&&(
          <Button
          id="submit-btn"
          className="w-full disabled:bg-black-900/10 mt-6 dark:bg-white dark:text-black bg-black text-white "
          variant="black"
          onClick={onSend}
        >
          Send Invitation Link
        </Button>
)}

    </OrgDialog>
  );
};

export default InviteModal;
