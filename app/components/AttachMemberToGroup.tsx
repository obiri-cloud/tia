"use client";

import { useForm } from "react-hook-form";
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
import { useSession } from "next-auth/react";
import { OrgGroup } from "../my-organization/groups/page";

const AttachMemberToGroup = ({
  groups,
  onSubmit,
}: {
  groups: OrgGroup[] | undefined;

  onSubmit: (e: FormEvent<HTMLFormElement>, s: Set<string>) => void;
}) => {
  const form = useForm();
  const { data: session } = useSession();
  const token = session?.user!.tokens?.access_token;
  const [data, setData] = useState<string[]>([]);

  let organization_id = session?.user.data.organization_id;

  const getGroups = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${organization_id}/group/list/`,
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

  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set(data)
  );

  useEffect(() => {
    if (data) {
      setSelectedMembers(new Set(data));
    }
    return () => {
      setSelectedMembers(new Set());
    };
  }, [data]);


  function renderIni(str: string){
    let d: string[] = str.split(" ")
    if (d.length > 1){
        return `${d[0][0]}${d[1][0]}`
    }else{
        return `${d[0]}${d[1]}`
    }
  }

  return (
    <DialogContent>
      <Form {...form}>
        <form
          onSubmit={(e) => onSubmit(e, selectedMembers)}
          className="space-y-8"
        >
          <FormField
            name="image"
            render={() => (
              <FormItem>
                <div className="mb-6">
                  <h3 className="text-black dark:text-white mb-1 font-semibold text-lg">
                    Organization Groups
                  </h3>
                  <FormDescription className="text-sm">
                    Select the groups you want to attach the user to
                  </FormDescription>
                </div>
                {groups &&
                  groups.map((group: OrgGroup) => (
                    <FormItem
                      key={group.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          className="text-black dark:text-white"
                        //   checked={selectedMembers?.has(member.member.id)}
                        //   onCheckedChange={(checked: boolean) => {
                        //     const updatedSet = new Set(selectedMembers);
                        //     if (checked) {
                        //       updatedSet.add(member.member.id);
                        //     } else {
                        //       updatedSet.delete(member.member.id);
                        //     }
                        //     setSelectedMembers(updatedSet);
                        //   }}
                        />
                        <div className="bg-muted text-black dark:text-white font-bold p-4 w-4 h-4 flex justify-center items-center uppercase  rounded-full">
                          <span>{renderIni(group.name)}</span>
                        </div>

                        <div className="flex-1">
                          <div className="font-medium text-black dark:text-white ">
                          {group.name}

                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {group.organization.name}
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  ))}
              </FormItem>
            )}
          />
          {groups && groups.length > 0 ? (
            <Button className="w-full" id="add-member-submit-button">
              Update Member List
            </Button>
          ) : null}
        </form>
      </Form>
    </DialogContent>
  );
};

export default AttachMemberToGroup;
