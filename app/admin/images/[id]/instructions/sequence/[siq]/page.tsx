"use client";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const SequencePage = () => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const params = useParams();
  console.log("params", params);

  const [info, setInfo] = useState<IInstruction>();
  const [sequence, setSequence] = useState<string>();

  const { data: session } = useSession();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  useEffect(() => {
    getSequenceInfo();
  }, []);

  const log = () => {
    if (editorRef.current) {
      //@ts-ignore
      console.log(editorRef.current.getContent());
    }
  };

  const getSequenceInfo = async () => {
    const id = params.id;
    const siq = params.siq;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${id}/instruction/${siq}/retrieve/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response ==>", response);
    if (response.status === 200) {
      setInfo(response.data.data);
    }
  };

  const updateSequenceInst = async () => {
    const id = params.id;
    const siq = params.siq;

    let text = "";
    if (editorRef.current) {
      //@ts-ignore
      text = editorRef.current.getContent();
    }
    let formData = JSON.stringify({ sequence: siq, text });

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${id}/instruction/${siq}/update/`,
        formData,

        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Sequence Instruction update",
        });
      }
    } catch (error) {}
  };

  const createSequenceInst = async () => {
    const id = params.id;

    let text = "";
    if (editorRef.current) {
      //@ts-ignore
      text = editorRef.current.getContent();
    }
    let formData = JSON.stringify({ sequence: Number(sequence), text });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${id}/instruction/create/`,
        formData,

        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        toast({
          variant: "success",
          title: "Sequence Instruction created",
        });
      }
    } catch (error) {}
  };

  return (
    <div className="p-4">
      <Input
        onChange={(e) => setSequence(e.target.value)}
        placeholder="Sequence Number"
        type="text"
        className="shadow-md dark:text-white dark:bg-black/10 bg-white text-black mb-6"
      />
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
          //   ai_request: (request, respondWith) =>
          //     respondWith.string(() =>
          //       Promise.reject("See docs to implement AI Assistant")
          //     ),
        }}
        initialValue={info ? info.text : ""}
      />
      <button onClick={log}>Log editor content</button>
      <Button
        onClick={() => {
          Number(params.siq)> 0 ? updateSequenceInst() : createSequenceInst();
        }}
      >
        {Number(params.siq) > 0  ? "Update" : "Save"}
      </Button>
    </div>
  );
};

export default SequencePage;
