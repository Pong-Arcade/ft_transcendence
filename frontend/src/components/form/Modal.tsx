import React, { useEffect, useRef } from "react";

const Modal = ({
  open,
  setOpen,
  width,
  height,
  content,
  x,
  y,
  backgroundcolor,
}: any) => {
  const modalRef = useRef<any>();
  useEffect(() => {
    const handler = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  if (open) {
    return (
      <div
        ref={modalRef}
        style={{
          position: "relative",
          top: y,
          left: x,
          width: width,
          height: height,
          backgroundColor: backgroundcolor,
        }}
      >
        {content}
      </div>
    );
  } else return null;
};

export default Modal;
