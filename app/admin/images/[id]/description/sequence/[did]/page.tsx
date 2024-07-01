"use client";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { IInstruction, ILabImage } from "@/app/types";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import apiClient from "@/lib/request";

const SequencePage = () => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const params = useParams();
  const router = useRouter();

  const [info, setInfo] = useState<IInstruction>();
  const [sequence, setSequence] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<ILabImage>();
  const [heading, setHeading] = useState<string>("");

  const { data: session } = useSession();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  useEffect(() => {
    getSequenceInfo();
    getCurrentImage();
  }, []);

  const getSequenceInfo = async () => {
    const id = params.id;
    const siq = params.did;
    const response = await apiClient.get(
      `/moderator/image/${id}/image-descriptions/${siq}`
    );

    if (response.status === 200) {
      setInfo(response.data.data);
      setSequence(response.data.data.sequence);
      setTitle(response.data.data.title);
      setHeading(response.data.data.title);
    }
  };

  const updateSequenceInst2 = async () => {
    const id = params.id;
    const siq = params.did;

    let text = "";
    if (editorRef.current) {
      //@ts-ignore
      text = editorRef.current.getContent();
    }
    let formData = JSON.stringify({ title: heading, text, image: Number(id) });
    try {
      const response = await apiClient.patch(
        `/moderator/image/${id}/image-descriptions/${siq}`,
        formData
      );
      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Sequence Instruction updated",
        });
        router.push(`/admin/images/${id}/description`);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        //@ts-ignore
        title: error.response.data.message,
      });
    }
  };

  const updateSequenceInst = async () => {
    const id = params.id;
    const siq = params.did;

    let text = "";
    if (editorRef.current) {
      //@ts-ignore
      text = editorRef.current.getContent();
    }
    let formData = JSON.stringify({ title: heading, text, image: id });
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${id}/image-descriptions/${siq}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
          data: formData,
        }
      );
      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Sequence Instruction updated",
        });
        router.push(`/admin/images/${id}/description`);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        //@ts-ignore
        title: error.response.data.message,
      });
    }
  };

  const createSequenceInst = async () => {
    const id = params.id;

    let text = "";
    if (editorRef.current) {
      //@ts-ignore
      text = editorRef.current.getContent();
    }

    let formData = JSON.stringify({ title: heading, text, id });

    try {
      const response = await apiClient.post(
        `/moderator/image/${id}/image-descriptions/`,
        formData
      );

      if (response.status === 201) {
        toast({
          variant: "success",
          title: "Description created",
        });
        router.push(`/admin/images/${id}/description`);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to create description",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        //@ts-ignore
        title: error.response.data.message,
      });
    }
  };

  const getCurrentImage = async () => {
    const id = params.id;
    const response = await apiClient.get(`/moderator/image/${id}/retrieve/`);

    if (response.status === 200) {
      setCurrentImage(response.data.data); // Ensure response.data.data matches ILabImage
    }
  };

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          {currentImage?.name ? (
            <Link
              href={`/admin/images/${params.id}/instructions`}
              className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
            >
              {currentImage?.name}
            </Link>
          ) : (
            <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
          )}
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
          {currentImage?.name ? (
            <span className="p-2 rounded-md">{params.siq}</span>
          ) : (
            <Skeleton className="w-[30px] h-[16.5px] rounded-md" />
          )}
        </div>
        {session?.user && session?.user.data.is_admin ? (
          <Link href="/dashboard" className="font-medium text-mint">
            Go to labs
          </Link>
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex gap-2">
          <Input
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="title"
            type="text"
            className="shadow-md dark:text-white dark:bg-black/10 bg-white text-black mb-6 w-[200px]"
          />
        </div>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINY_MCE_URL}
          onInit={(evt, editor) => (editorRef.current = editor)}
          init={{
            plugins:
              "tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            tinycomments_mode: "embedded",
            tinycomments_author: "Author name",
            mergetags_list: [
              { value: "First.Name", title: "First Name" },
              { value: "Email", title: "Email" },
            ],
          }}
          initialValue={info ? info.text : ""}
        />
        <Button
          className="mt-2 ml-auto"
          onClick={() => {
            Number(params.siq) > 0
              ? updateSequenceInst()
              : createSequenceInst();
          }}
        >
          {Number(params.did) > 0 ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default SequencePage;
