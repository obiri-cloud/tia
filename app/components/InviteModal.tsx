"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import OrgDialog from "./my-organization/org-dialog";
import { Badge } from "@/components/ui/badge";
import { TrashIcon } from "lucide-react";

type InviteModalProps = {
  onSubmit: () => void;
  setEmailInput: (email: string) => void;
  emailInput: any;
  bulkEmails: any[];
  onRemoveEmail: (email: string) => void;
  onSend: () => void;
};
const InviteModal = ({
  onSubmit,
  emailInput,
  setEmailInput,
  bulkEmails,
  onRemoveEmail,
  onSend,
}: InviteModalProps) => {

  return (
    <OrgDialog
      title="Invite Members"
      description="Invites users to your organization"
    >
      {bulkEmails.length === 0 && (
        <div className="flex items-center justify-center">
          <p className=" capitalize dark:text-white text-black">
            No added email
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-4">
        {bulkEmails.map((email, i: number) => (
          <div key={i} className="flex items-center">
            <Badge variant="outline">{email.email}</Badge>
            <button onClick={() => onRemoveEmail(email)}>
              <TrashIcon className="text-red-500 stroke-2 w-4 h-4 " />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
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

      {bulkEmails.length > 0 && (
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
