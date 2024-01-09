"use client";
import React from "react";

const page = () => {
  const click = () => {
    fetch("/api/poll?key=ejdjdj", {
      method: "GET",
    });
  };

  return (
    <div>
      <button onClick={click}>click</button>
    </div>
  );
};

export default page;
