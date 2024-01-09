import React from 'react';

function Modal({
  children,
  closeModal,
}: {
  children: React.ReactNode;
  closeModal: () => void;
}) {
  return (
    <div className="absolute bg-white w-10/12 z-99 min-w-fit md:max-w-5xl  dark:bg-boxdark top-20 py-10 min-h-screen right-0 ">
      <h1
        className="text-danger text-3xl text-end mx-10 cursor-pointer"
        onClick={closeModal}
      >
        X
      </h1>
      {children}
    </div>
  );
}

export default Modal;
