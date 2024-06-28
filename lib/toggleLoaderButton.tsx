import TailLoader from "@/app/loaders/tail";
import { RefObject } from "react";

import { createRoot } from "react-dom/client";

export const disableButton = (buttonRef: RefObject<HTMLButtonElement>) => {
  if (buttonRef.current) {
    buttonRef.current.disabled = true;
    const root = createRoot(buttonRef.current);
    root.render(<TailLoader />);
  }
};

export const enableButton = (
  buttonRef: RefObject<HTMLButtonElement>,
  text: string
) => {
  if (buttonRef.current) {
    buttonRef.current.disabled = false;
    const root = createRoot(buttonRef.current);
    root.unmount();
    buttonRef.current.innerHTML = text;
  }
};
