"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { FormEvent, useEffect, useState } from "react";

import { GroupMember } from "../types";
import axios from "axios";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { CheckedState } from "@radix-ui/react-checkbox";
import OrgDialog from "./my-organization/org-dialog";
import { OrgGroup } from "../my-organization/groups/page";

export interface IMemberChanges {
  added: Set<string>;
  removed: Set<string>;
}

const AddMembersModal = ({
  members,
  onSubmit,
  group,
}: {
  members: GroupMember[] | undefined;

  onSubmit: (s: IMemberChanges) => void;
  group: OrgGroup | undefined;
}) => {
  const form = useForm();
  const { data: session } = useSession();
  const token = session?.user!.tokens?.access_token;
  const [loadingMembers, setIsLoadingMembers] = useState<boolean>(false);

  const getMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${group?.id}/member/list/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = response.data.data;
      let newData = [];
      let list = data[0].member;

      if (list.length > 0) {
        newData = list ? list.map((d: any) => d.id) : [];
      }

      setSelectedMembers(new Set(newData));

      setIsLoadingMembers(false);
    } catch (error) {
      console.log(error);
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    getMembers();

    return () => {
      setSelectedMembers(new Set());
    };
  }, [group]);

  const [selectedMembers, setSelectedMembers] = useState(new Set());

  // State to track the changes - additions and deletions
  const [changes, setChanges] = useState<IMemberChanges>({
    added: new Set(),
    removed: new Set(),
  });

  const handleCheckedChange = (checked: CheckedState, memberId: string) => {
    const updatedSet = new Set(selectedMembers);
    const updatedChanges = { ...changes };

    if (checked) {
      updatedSet.add(memberId);

      // Track addition
      updatedChanges.added.add(memberId);
      // If this was previously removed, we should untrack the removal
      if (updatedChanges.removed.has(memberId)) {
        updatedChanges.removed.delete(memberId);
      }
    } else {
      updatedSet.delete(memberId);

      // Track removal
      updatedChanges.removed.add(memberId);
      // If this was previously added, we should untrack the addition
      if (updatedChanges.added.has(memberId)) {
        updatedChanges.added.delete(memberId);
      }
    }

    setSelectedMembers(updatedSet);
    setChanges(updatedChanges);
  };

  return (
    <OrgDialog
      title={`${group?.name} Members`}
      description="Select the members you want to add to the group"
    >
      <div className=" overflow-scroll flex flex-col flex-1 ">
        <Form {...form}>
          <form className="space-y-8 flex-1 overflow-scroll">
            <FormField
              name="image"
              render={() => (
                <FormItem>
                  {loadingMembers ? (
                    <p className="text-black dark:text-white text-center">
                      Loading members...
                    </p>
                  ) : !Array.isArray(members) || members.length === 0 ? (
                    <p className="ftext-center text-black dark:text-white">
                      No members in the group.
                    </p>
                  ) : (
                    members.map((member: GroupMember) => (
                      <FormItem
                        key={member.member.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={selectedMembers?.has(member.member.id)}
                            onCheckedChange={(checked) =>
                              handleCheckedChange(checked, member.member.id)
                            }
                          />
                          <div className="bg-muted text-black dark:text-white font-bold p-4 w-4 h-4 flex justify-center items-center uppercase rounded-full">
                            {member.member.first_name[0]}
                          </div>

                          <div className="flex-1">
                            <div className="font-medium text-black dark:text-white">
                              {`${member.member.first_name} ${member.member.last_name}`}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {member.member.email}
                            </div>
                          </div>
                        </div>
                      </FormItem>
                    ))
                  )}
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <Button
        onClick={() => onSubmit(changes)}
        disabled={Array.isArray(members) && members.length > 0 ? false : true}
        className="w-full"
        id="update-member-submit-button"
      >
        Update Member List
      </Button>
    </OrgDialog>
  );
};

export default AddMembersModal;
