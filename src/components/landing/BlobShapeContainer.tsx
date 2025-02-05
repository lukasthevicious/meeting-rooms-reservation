import { FC } from "react";
import { ReactNode } from "react";

type BlobShapeProps = {
  children: ReactNode;
};

const BlobShapeContainer: FC<BlobShapeProps> = ({ children }) => {
  return (
    <div
      className="h-80 md:h-96 w-80 md:w-105 mt-5 md:mt-14 border rounded-lg bg-gray-50 shadow-lg overflow-x-hidden overflow-y-scroll scrollbar-hide opacity-80  border-gray-300 "
      style={{ borderRadius: "40% 85% 15% 55%" }}
    >
      {children}
    </div>
  );
};

export default BlobShapeContainer;
