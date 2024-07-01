"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OrgDialog from "./my-organization/org-dialog";

type MembersModalProps = {
  setEmailInput: (email:string) => void;
  emailInput: string;
  onSend: () => void;
};

const MemberModal = ({
    emailInput,
    onSend,
    setEmailInput
}: MembersModalProps) => {
  return (
    <OrgDialog
      title="add Member"
      description="Add members directly to your organization"
    >

      <div className="flex items-center gap-2">
        <Input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          placeholder="Email"
          type="text"
          className="flex-grow glassBorder bg-white dark:bg-black/10 dark:text-white text-black"
        />
      </div>

        <Button
          id="submit-btn"
          className="w-full disabled:bg-black-900/10 mt-6 dark:bg-white dark:text-black bg-black text-white "
          variant="black"
          onClick={onSend}
        >
          Add member
        </Button>
      {/* )} */}
    </OrgDialog>
  );
};

export default MemberModal;
