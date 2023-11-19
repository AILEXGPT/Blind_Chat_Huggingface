import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useKeyPressEvent } from "react-use";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";

import { useCollection } from "./useCollection";
import { Button } from "../button";
import { useUser } from "@/utils/useUser";

interface Props {
  id: string;
  onClose: () => void;
}

const dropIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
  },
};

export const Modal: React.FC<Props> = ({ id, onClose }) => {
  const { collection, updateVisibility, remove, next, previous } =
    useCollection(id);
  const { user } = useUser();

  useKeyPressEvent("ArrowLeft", previous);
  useKeyPressEvent("ArrowRight", next);

  const formatDate = useMemo(() => {
    if (!collection) return;
    const date = new Date(collection?.createdAt);
    return date.toLocaleDateString();
  }, [collection?.createdAt]);

  return (
    <motion.div
      onClick={onClose}
      className="fixed top-0 w-screen h-screen left-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl h-auto w-full z-[10] rounded-3xl overflow-hidden relative flex items-center justify-center flex-col gap-4 bg-white/30 backdrop-blur-sm px-2 pb-2 pt-2"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {user?.is_admin && (
          <div className="absolute p-2 rounded-full top-4 left-4 flex items-center justify-start gap-2 bg-black/20 backdrop-blur">
            {!collection?.is_visible && (
              <Button theme="white" onClick={updateVisibility}>
                <AiFillCheckCircle />
                Validate
              </Button>
            )}
            <Button theme="danger" onClick={remove}>
              <BsFillTrashFill />
              Delete
            </Button>
          </div>
        )}
        <Image
          src={`https://huggingface.co/datasets/enzostvs/stable-diffusion-tpu-generations/resolve/main/images/${collection?.file_name}.png?expose=true`}
          alt="Generated image"
          className="object-center object-contain w-full h-full rounded-2xl"
          width={1024}
          height={1024}
        />
        <div
          className="bg-cover bg-center w-full h-full rounded-2xl bg-no-repeat z-[-1] absolute top-0 left-0 opacity-90 blur-xl"
          style={{
            backgroundImage: `url(https://huggingface.co/datasets/enzostvs/stable-diffusion-tpu-generations/resolve/main/images/${collection?.file_name}.png?expose=true)`,
          }}
        />
        <div className="text-left w-full px-4 pb-3 pt-2">
          <p className="text-sm font-medium text-white/60 mb-1">{formatDate}</p>
          <div className="flex flex-col lg:flex-row items-start lg:items-end lg:justify-between">
            <p className="text-xl font-semibold text-white lowercase leading-snug">
              {collection?.prompt}
            </p>
            <div className="flex items-center justify-end gap-2">
              <BsFillArrowLeftSquareFill
                className="text-white/60 text-2xl inline-block mr-2 hover:text-white cursor-pointer"
                onClick={previous}
              />
              <BsFillArrowRightSquareFill
                className="text-white/60 text-2xl inline-block hover:text-white cursor-pointer"
                onClick={next}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
