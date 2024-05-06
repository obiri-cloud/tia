import { ContentProps } from "@/app/types";
import { DialogContent } from "@/components/ui/dialog";
import React, { ReactNode } from "react";

const OrgDialog = ({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string | undefined;
  description?: string | undefined;
}) => {
  return (
    <div>
      <DialogContent className=" overflow-y-scroll">
        <div className="mb-6">
          <h3 className="text-black dark:text-white mb-1 font-semibold text-lg">
            {title}
          </h3>
          <div className="text-sm text-black dark:text-white ">{description}</div>
        </div>
        {children}
      </DialogContent>
    </div>
  );
};

export default OrgDialog;
