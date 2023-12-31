import React from 'react';

function Modal({
  children,
  closeModal,
}: {
  children: React.ReactNode;
  closeModal: () => void;
}) {
  return (
    <div className="absolute bg-white  dark:bg-body top-20 py-10  w-2/5 right-0 ">
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
