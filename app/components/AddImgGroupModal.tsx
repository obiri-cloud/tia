"use client";

import { useForm } from "react-hook-form";
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { useEffect, useState, useCallback } from "react";
import { GroupMember, ILabImage } from "../types";
import { useSession } from "next-auth/react";
import OrgDialog from "./my-organization/org-dialog";
import { OrgGroup } from "../my-organization/groups/page";
import { useMutation, useQueryClient } from "react-query";
import apiClient from "@/lib/request";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export interface IImageChanges {
  added: Set<string>;
  removed: Set<string>;
}

const AddImgGroupModal = ({
  images,
  group,
  onSubmit,
  handleNextImgPage,
  handlePreviousImgPage,
  previousImgPage,
  nextImgPage,
  loading,
  setImages
}: {
  images: ILabImage[] | undefined;
  group: OrgGroup | undefined;
  onSubmit: (s: IImageChanges) => void;
  handleNextImgPage: any;
  handlePreviousImgPage: any;
  previousImgPage: any;
  nextImgPage: any;
  loading: boolean;
  setImages:(data:any)=>void
}) => {
  const form = useForm();
  const { data: session } = useSession();
  const [loadingImages, setLoadingImages] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const queryClient = useQueryClient();
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [changes, setChanges] = useState<IImageChanges>({
    added: new Set(),
    removed: new Set(),
  });

  let organization_id = session?.user.data.organization_id;

  const getImages = async (
    query: string
  ): Promise<ILabImage[] | undefined> => {
    try {
      const response = await apiClient.get(
        `/organization/${organization_id}/images/?q=${query}`
      );

      setSelectedImages(new Set(response.data.data));
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGroupImages = async () => {
    setLoadingImages(true);
    try {
      const response = await apiClient.get(
        `/organization/${organization_id}/group/${group?.id}/image/list/`
      );

      let data = response.data.data;
      let newData = [];
      let list = data[0].lab_image;

      if (list.length > 0) {
        newData = list ? list.map((d: any) => String(d.id)) : [];
      }

      setSelectedImages(new Set(newData));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    fetchGroupImages();
    return () => {
      setSelectedImages(new Set());
    };
  }, [group]);

  const { mutate: searchMutation } = useMutation(getImages, {
    onSuccess: (data) => {
      queryClient.setQueryData("orgImages", data);
      setSelectedImages(new Set(data));
      setImages(data)
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

  const debouncedFetchImages = useCallback(
    debounce((query: string) => searchMutation(query), 400),
    [searchMutation]
  );

  const handleCheckedChange = (checked: string | boolean, imageId: string) => {
    const updatedSet = new Set(selectedImages);
    const updatedChanges = { ...changes };

    if (checked) {
      updatedSet.add(imageId);
      updatedChanges.added.add(imageId);
      if (updatedChanges.removed.has(imageId)) {
        updatedChanges.removed.delete(imageId);
      }
    } else {
      updatedSet.delete(imageId);
      updatedChanges.removed.add(imageId);
      if (updatedChanges.added.has(imageId)) {
        updatedChanges.added.delete(imageId);
      }
    }

    setSelectedImages(updatedSet);
    setChanges(updatedChanges);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
    debouncedFetchImages(event.target.value);
  };

  return (
    <OrgDialog
      title={`${group?.name} Images`}
      description="Select the Images you want to add to the group"
    >
      <div className=" overflow-scroll flex flex-col flex-1 ">
        <Form {...form}>
          <form className="space-y-8 flex-1 overflow-scroll">
            <Input
              placeholder="Search images"
              value={searchQuery}
              onChange={handleSearchChange}
              className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
              defaultValue=""
            />

            <FormField
              name="image"
              render={() => (
                <FormItem>
                  {loadingImages || loading ? (
                    <>
                      {new Array(6).fill(1).map((_, i) => (
                        <Skeleton key={i} className="p-2 w-full h-10 border rounded-md" />
                      ))}
                    </>
                  ) : !Array.isArray(images) || images.length === 0 ? (
                    <p className="text-center text-black dark:text-white">
                      No images found.
                    </p>
                  ) : (
                    images?.map((item: ILabImage) => (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={selectedImages?.has(String(item.id))}
                            onCheckedChange={(checked) =>
                              handleCheckedChange(checked, String(item.id))
                            }
                          />
                          <div className="bg-muted text-black dark:text-white font-bold p-4 w-4 h-4 flex justify-center items-center uppercase rounded-full">
                            {item.name[0]}
                          </div>

                          <div className="flex-1">
                            <div className="font-medium text-black dark:text-white">
                              {`${item.name} `}
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
          onClick={handlePreviousImgPage}
          disabled={previousImgPage === null}
        >
          Previous
        </Button>

        <Button
          onClick={handleNextImgPage}
          disabled={nextImgPage === null}
        >
          Next
        </Button>
      </div>
      <Button
        onClick={() => onSubmit(changes)}
        disabled={Array.isArray(images) && images.length > 0 ? false : true}
        className="w-full mt-4"
        id="add-image-to-grp-button"
      >
        Update images list
      </Button>
    </OrgDialog>
  );
};

export default AddImgGroupModal;
