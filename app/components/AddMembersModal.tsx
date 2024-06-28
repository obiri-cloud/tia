"use client";

import { useForm } from "react-hook-form";
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { useCallback, useEffect, useState } from "react";
import { GroupMember } from "../types";
import { useSession } from "next-auth/react";
import OrgDialog from "./my-organization/org-dialog";
import { OrgGroup } from "../my-organization/groups/page";
import { useMutation, useQueryClient } from "react-query";
import apiClient from "@/lib/request";
import { Input } from "@/components/ui/input";

export interface IMemberChanges {
  added: Set<string>;
  removed: Set<string>;
}

const AddMembersModal = ({
  members,
  onSubmit,
  group,
  handleNextPage,
  handlePreviousPage,
  previousPage,
  nextPage,
  loading,
  setMembers,
}: {
  members: GroupMember[] | undefined;
  onSubmit: (s: IMemberChanges) => void;
  group: OrgGroup | undefined;
  handleNextPage: any;
  handlePreviousPage: any;
  previousPage: any;
  nextPage: any;
  loading: boolean;
  setMembers: (data:any) => void;
}) => {
  const form = useForm();
  const { data: session } = useSession();
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const queryClient = useQueryClient();
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [changes, setChanges] = useState<IMemberChanges>({
    added: new Set(),
    removed: new Set(),
  });

  let organization_id = session?.user.data.organization_id;

  const getSearchedMembers = async (
    query: string
  ): Promise<GroupMember[] | undefined> => {
    try {
      const response = await apiClient.get(
        `/organization/${organization_id}/members/?q=${query}`
      );

      // setSelectedMembers(new Set(response.data.data));
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await apiClient.get(
        `/organization/${organization_id}/group/${group?.id}/member/list/`
      );

      let data = response.data.data;
      let newData = [];
      let list = data[0].member;

      if (list.length > 0) {
        newData = list ? list.map((d: any) => d.id) : [];
      }

      setSelectedMembers(new Set(newData));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    getMembers();
    return () => {
      setSelectedMembers(new Set());
    };
  }, [group]);

  const { mutate: searchMutation } = useMutation(getSearchedMembers, {
    onSuccess: (data) => {
      queryClient.setQueryData("members", data);
      setSelectedMembers(new Set(data));
      setMembers(data)
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
  
  const debounce = (func: (e: string) => void, delay: number) => {
    let timeoutId: any;
    return (...args: any) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };


  const debouncedFetchMembers = useCallback(
    debounce((query: string) => searchMutation(query), 400),
    [searchMutation]
  );


  const handleCheckedChange = (checked: string | boolean, memberId: string) => {
    const updatedSet = new Set(selectedMembers);
    const updatedChanges = { ...changes };

    if (checked) {
      updatedSet.add(memberId);
      updatedChanges.added.add(memberId);
      if (updatedChanges.removed.has(memberId)) {
        updatedChanges.removed.delete(memberId);
      }
    } else {
      updatedSet.delete(memberId);

      updatedChanges.removed.add(memberId);
      if (updatedChanges.added.has(memberId)) {
        updatedChanges.added.delete(memberId);
      }
    }

    setSelectedMembers(updatedSet);
    setChanges(updatedChanges);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
    debouncedFetchMembers(event.target.value);
  };

  return (
    <OrgDialog
      title={`${group?.name} Members`}
      description="Select the members you want to add to the group"
    >
      <div className=" overflow-scroll flex flex-col flex-1 ">
        <Form {...form}>
          <form className="space-y-8 flex-1 overflow-scroll">
            <Input
              placeholder="Search members"
              value={searchQuery}
              onChange={handleSearchChange}
              className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
              defaultValue=""
            />

            <FormField
              name="image"
              render={() => (
                <FormItem>
                  {loadingMembers || loading ? (
                    <p className="text-black dark:text-white text-center">
                      Loading members...
                    </p>
                  ) : !Array.isArray(members) || members.length === 0 ? (
                    <p className="text-center text-black dark:text-white">
                      No members found.
                    </p>
                  ) : (
                    members?.map((member: GroupMember) => (
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
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={handlePreviousPage}
          disabled={previousPage === null}
        >
          Previous
        </Button>

        <Button
          onClick={handleNextPage}
          disabled={nextPage === null}
        >
          Next
        </Button>
      </div>
      <Button
        onClick={() => onSubmit(changes)}
        disabled={Array.isArray(members) && members.length > 0 ? false : true}
        className="w-full mt-4"
        id="update-member-submit-button"
      >
        Update member list
      </Button>
    </OrgDialog>
  );
};

export default AddMembersModal;
