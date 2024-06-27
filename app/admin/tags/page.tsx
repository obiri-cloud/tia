"use client";
import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import apiClient from "@/lib/request";
import { ChevronRight } from "lucide-react";
import AltRouteCheck from "@/app/components/alt-route-check";
import { AxiosResponse } from "axios";

import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import TailLoader from "@/app/loaders/tail";
import { createRoot } from "react-dom/client";

type Tag = {
  id: number;
  name: string;
};

type TagResponse = {
  data: Tag[];
};
const TagsPage = () => {
  const fetchTags = async () => {
    const response: AxiosResponse<TagResponse> = await apiClient.get(
      "/moderator/tags/"
    );
    return response.data.data;
  };

  const [name, setName] = useState("");

  const { data: tags } = useQuery(["tags"], fetchTags);

  const [currentTag, setCurrentTag] = useState<Tag | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    name: z.string().min(3, {
      message: "Tag name has to be 3 characters or more",
    }),
  });

  let formData = {
    name,
  };

  const addTag = async () => {
    try {
      formSchema.parse(formData);

      let response;
      if (currentTag) {
        response = await apiClient.put(
          `/moderator/tags/${currentTag.id}`,
          formData
        );
      } else {
        response = await apiClient.post(`/moderator/tags/`, formData);
      }

      return response;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((err) =>
          toast({
            variant: "destructive",
            title: "Tag Creation Error",
            description: err.message,
            duration: 2000,
          })
        );
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
        const root = createRoot(buttonRef.current);
        root.unmount();
        buttonRef.current.innerHTML = "Add";
      }
      if (deleteButtonRef.current) {
        deleteButtonRef.current.disabled = false;
        const root = createRoot(deleteButtonRef.current);
        root.unmount();
        deleteButtonRef.current.innerHTML = "Delete";
      }
    }
  };
  const deleteTag = async () => {
    try {
      let response = await apiClient.delete(
        `/moderator/tags/${currentTag?.id}`
      );

      return response;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((err) =>
          toast({
            variant: "destructive",
            title: "Tag Deletion Error",
            description: err.message,
            duration: 2000,
          })
        );
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      if (deleteButtonRef.current) {
        deleteButtonRef.current.disabled = false;
        const root = createRoot(deleteButtonRef.current);
        root.unmount();
        deleteButtonRef.current.innerHTML = "Delete";
      }

      if (buttonRef.current) {
        buttonRef.current.disabled = false;
        const root = createRoot(buttonRef.current);
        root.unmount();
        buttonRef.current.innerHTML = "Add";
      }
    }
  };

  const { mutate: addTagMutation } = useMutation(addTag, {
    onSuccess: () => {
      toast({
        title: "Tag Created",
        variant: "success",
        description: `Tag ${currentTag ? "updated" : "created"} successfully`,
        duration: 2000,
      });
      queryClient.invalidateQueries("tags");
      document.getElementById("closeDialog")?.click();
    },
  });
  const { mutate: deleteTagMutation } = useMutation(deleteTag, {
    onSuccess: () => {
      toast({
        title: "Tag Deleted",
        description: `Tag deleted successfully`,
        duration: 2000,
      });
      queryClient.invalidateQueries("tags");
      document.getElementById("closeDialog")?.click();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonRef.current) {
      buttonRef.current.disabled = true;
      const root = createRoot(buttonRef.current);
      root.render(<TailLoader />);
    }

    if (deleteButtonRef.current) {
      deleteButtonRef.current.disabled = true;
      const root = createRoot(deleteButtonRef.current);
      root.render(<TailLoader />);
    }

    addTagMutation();
  };

  const handleDelete = async () => {
    if (deleteButtonRef.current) {
      deleteButtonRef.current.disabled = true;
      const root = createRoot(deleteButtonRef.current);
      root.render(<TailLoader />);
    }

    if (buttonRef.current) {
      buttonRef.current.disabled = true;
      const root = createRoot(buttonRef.current);
      root.render(<TailLoader />);
    }

    deleteTagMutation();
  };

  return (
    <div>
      <Dialog>
        <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
          <div className="flex items-center">
            <span className="p-2 ">All Tags</span>
            <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
          </div>
          <AltRouteCheck />
        </div>
        <div className="p-4">
          <div className="flex justify-end">
            <DialogTrigger onClick={() => setCurrentTag(null)}>
              <Button className="mr-auto">Add Tag</Button>
            </DialogTrigger>
          </div>
          <div className="grid grid-cols-3 gap-4 overflow-auto md:grid-cols-5 lg:grid-cols-7 mt-4">
            {tags &&
              tags.map((tag, i) => (
                <DialogTrigger key={i} onClick={() => setCurrentTag(tag)}>
                  <div className="flex cursor-pointer capitalize flex-col items-center justify-center rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                    <div className="mb-2 text-4xl  font-bold">
                      {tag.name[0]}
                    </div>
                    <div className="text-sm font-medium">{tag.name}</div>
                  </div>
                </DialogTrigger>
              ))}
          </div>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">
              Add Tag
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input
              onChange={(e) => setName(e.target.value)}
              defaultValue={currentTag?.name}
              placeholder="Tag Name"
              className="text-black dark:text-white"
            />
            <div className="flex gap-4 mt-3">
              {currentTag && (
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  id="add-tag-button"
                  className="w-full"
                  ref={deleteButtonRef}
                >
                  Delete
                </Button>
              )}
              <Button
                type="submit"
                id="add-tag-button"
                className="w-full "
                ref={buttonRef}
              >
                {currentTag ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagsPage;
