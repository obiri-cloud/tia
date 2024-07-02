import React, { useState, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface DescriptionIframeProps
  extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  children: ReactNode;
}

const DescriptionIframe: React.FC<DescriptionIframeProps> = ({
  children,
  ...props
}) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const mountNode = contentRef?.contentWindow?.document?.body;
  console.log("mountNode", mountNode);

  // if (mountNode) {
  //   mountNode.style.fontFamily = "CURSIVE";
  // }

  useEffect(() => {
    if (
      contentRef &&
      contentRef.contentWindow &&
      contentRef.contentWindow.document
    ) {
      const mountNode = contentRef.contentWindow.document.body;
      if (mountNode && !mounted) {
        const styleElement =
          contentRef.contentWindow.document.createElement("style");
        const linkElement =
          contentRef.contentWindow.document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href =
          "https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700;800;900&display=swap";
        contentRef.contentWindow.document.head.appendChild(linkElement);

        styleElement.innerHTML = `
      
          * {
        font-family: 'Inter', sans-serif !important;

          }
        `;
        contentRef.contentWindow.document.head.appendChild(styleElement);
        setMounted(true);
      }
    }
  }, [contentRef, mounted]);
  return (
    <iframe width="100%" height="100%" {...props} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      ></link>
    </iframe>
  );
};

export default DescriptionIframe;
