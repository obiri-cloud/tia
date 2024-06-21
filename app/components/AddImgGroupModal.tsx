"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import OrgDialog from "./my-organization/org-dialog";
import { GroupMember, ILabImage } from "../types";
import { OrgGroup } from "../my-organization/groups/page";
import apiClient from "@/lib/request";

export interface IImageChanges {
  added: Set<string>;
  removed: Set<string>;
}

function AddImgGroupModal({
  images,
  group,
  onSubmit,
}: {
  images: ILabImage[] | undefined;
  group: OrgGroup | undefined;
  onSubmit: (s: IImageChanges) => void;
}) {
  const form = useForm();

  const { data: session } = useSession();

  const [loadingImages, setIsLoadingImages] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState(new Set());
  let organization_id = session?.user.data.organization_id;

  const getImages = async () => {
    setIsLoadingImages(true);
    try {
      const response = await apiClient.get(
        `/organization/${organization_id}/group/${group?.id}/image/list/`
      );

      let data = response.data.data;
      console.log("data", data);

      let newData = [];
      let list = data[0].lab_image;

      if (list.length > 0) {
        newData = list ? list.map((d: any) => String(d.id)) : [];
      }

      setSelectedImages(new Set(newData));

      setIsLoadingImages(false);
    } catch (error) {
      console.log(error);
      setIsLoadingImages(false);
    }
  };

  useEffect(() => {
    getImages();

    return () => {
      setSelectedImages(new Set());
    };
  }, [group]);

  const [changes, setChanges] = useState<IImageChanges>({
    added: new Set(),
    removed: new Set(),
  });

  const handleCheckedChange = (checked: string | boolean, imageId: string) => {
    console.log({ checked, imageId });

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

  return (
    <OrgDialog
      title={`${group?.name} Images`}
      description="Select the Images you want to add to the group"
    >
      <div className=" overflow-scroll flex flex-col flex-1 ">
        <Form {...form}>
          <form className="space-y-8 flex-1 overflow-scroll">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  {images &&
                    images.map((item: ILabImage) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="image"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormLabel className="flex items-center space-x-4">
                                <Checkbox
                                  checked={selectedImages?.has(String(item.id))}
                                  onCheckedChange={(checked) =>
                                    handleCheckedChange(
                                      checked,
                                      String(item.id)
                                    )
                                  }
                                />
                                <div className="bg-muted text-black dark:text-white font-bold p-4 w-4 h-4 flex justify-center items-center uppercase  rounded-full">
                                  {item.name[0]}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-black dark:text-white ">
                                    {`${item.name} `}
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}

                  {images?.length === 0 || !images ? (
                    <p className="text-center text-black dark:text-white">
                      No image in your organization...
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <Button
        onClick={() => onSubmit(changes)}
        disabled={images?.length === 0 || !images ? true : false}
        id="add-image-to-grp-button"
        type="submit"
        className="w-full"
      >
        Update images List
      </Button>
    </OrgDialog>
  );
}

export default AddImgGroupModal;
