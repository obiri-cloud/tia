"use client";

import { useForm } from "react-hook-form";
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useCallback, useEffect, useState } from "react";
import { GroupMember } from "../types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CheckedState } from "@radix-ui/react-checkbox";
import OrgDialog from "./my-organization/org-dialog";
import { OrgGroup } from "../my-organization/groups/page";
import { useMutation, useQueryClient} from "react-query";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Items per page
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  let organization_id = session?.user.data.organization_id;



  const getSearchedMembers = async (query:any): Promise<GroupMember[] | undefined> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${organization_id}/members/?q=${query}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // if (response.data.status === 404) {
      //   alert("No members found for this organization.");
      //   return;
      // }

      setSelectedMembers(new Set(response.data.data));
      return response.data.data;
    } catch (error) {
      // setError("Failed to load members. Please try again.");
      setIsLoadingMembers(false);
      console.error(error);
    }
  };


  const getMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${organization_id}/group/${group?.id}/member/list/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
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

  const debounce = (func: (e: string) => void, delay: number) => {
    let timeoutId: any;
    return (...args: any) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };



  const { mutate: searchMutation } = useMutation(getSearchedMembers, {
    onSuccess: (data) => {
      queryClient.setQueryData("members", data);
      setSelectedMembers(new Set(data));
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  const debouncedFetchMembers = useCallback(
     debounce((query: string) => searchMutation(query), 400),
    [searchMutation]
  );



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

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setSearchQuery(event.target.value);
    debouncedFetchMembers(event.target.value);
  };


  const handleSearchQueryChange = (query: string) => {

  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentMembers = members?.filter((member) =>
  //     `${member.member.first_name} ${member.member.last_name}`
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase()) ||
  //     member.member.email.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil((members?.length || 0) / itemsPerPage);

  return (
    <OrgDialog
      title={`${group?.name} Members`}
      description="Select the members you want to add to the group"
    >
      <div className=" overflow-scroll flex flex-col flex-1 ">
        <Form {...form}>
          <form className="space-y-8 flex-1 overflow-scroll">
            <input
              type="text"
              placeholder="Search members"
              value={searchQuery}
              onChange={handleSearchChange}
              // onChange={(e) => handleSearchQueryChange(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <FormField
              name="image"
              render={() => (
                <FormItem>
                  {loadingMembers ? (
                    <p className="text-black dark:text-white text-center">
                      Loading members...
                    </p>
                  ) : !Array.isArray(members) || members.length === 0 ? (
                    <p className="text-center text-black dark:text-white">
                      No members in the group.
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
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-black dark:text-white">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
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
        Update Member List
      </Button>
    </OrgDialog>
  );
};

export default AddMembersModal;
