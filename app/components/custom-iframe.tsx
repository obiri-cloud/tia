import React, { useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface CustomIframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  children: ReactNode;
}

const CustomIframe: React.FC<CustomIframeProps> = ({
  children,
  ...props
}) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);

  const mountNode = contentRef?.contentWindow?.document?.body;

  return (
    <iframe 
    width="100%"
    height="100%"
    {...props} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};

export default CustomIframe;