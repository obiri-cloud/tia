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

export interface IMemberChanges {
  added: Set<string>;
  removed: Set<string>;
}

const AddMembersModal = ({
  members,
  onSubmit,
  gId,
}: {
  members: GroupMember[] | undefined;

  onSubmit: (e: FormEvent<HTMLFormElement>, s: IMemberChanges) => void;
  gId: number | undefined;
}) => {
  const form = useForm();
  const { data: session } = useSession();
  const token = session?.user!.tokens?.access_token;
  const [data, setData] = useState<string[]>([]);

  const getMembers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${gId}/member/list/`,
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
      if (data[0].member.length > 0) {
        newData = data ? data.map((d: any) => d.member[0].id) : [];
      }

      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data) {
      setSelectedMembers(new Set(data));
    }
    return () => {
      setSelectedMembers(new Set());
    };
  }, [data]);

  useEffect(() => {
    getMembers();

    return () => {
      setData([]);
    };
  }, [gId]);

  const [selectedMembers, setSelectedMembers] = useState(new Set(data));

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
  console.log("selectedMembers", selectedMembers);

  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={(e) => onSubmit(e, changes)} className="space-y-8">
          <FormField
            name="image"
            render={() => (
              <FormItem>
                <div className="mb-6">
                  <h3 className="text-black dark:text-white mb-1 font-semibold text-lg">
                    Organization Members
                  </h3>
                  <FormDescription className="text-sm">
                    Select the members you want to add to the group
                  </FormDescription>
                </div>
                {members &&
                  members.map((member: GroupMember) => (
                    <FormItem
                      key={member.member.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          className="text-black dark:text-white"
                          checked={selectedMembers?.has(member.member.id)}
                          onCheckedChange={(checked) =>
                            handleCheckedChange(checked, member.member.id)
                          }
                          // onCheckedChange={(checked: boolean) => {
                          //   const updatedSet = new Set(selectedMembers);
                          //   if (checked) {
                          //     updatedSet.add(member.member.id);
                          //   } else {
                          //     updatedSet.delete(member.member.id);
                          //   }
                          //   setSelectedMembers(updatedSet);
                          // }}
                        />
                        <div className="bg-muted text-black dark:text-white font-bold p-4 w-4 h-4 flex justify-center items-center uppercase  rounded-full">
                          {member.member.first_name[0]}
                        </div>

                        <div className="flex-1">
                          <div className="font-medium text-black dark:text-white ">
                            {`${member.member.first_name} ${member.member.last_name}`}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {member.member.email}
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  ))}
              </FormItem>
            )}
          />
          {members && members.length > 0 ? (
            <Button className="w-full" id="update-member-submit-button">
              Update Member List
            </Button>
          ) : null}
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddMembersModal;
