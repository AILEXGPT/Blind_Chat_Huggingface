import { useMemo } from "react";
import { motion } from "framer-motion";
import classNames from "classnames";
import { AiFillEyeInvisible, AiFillCheckCircle } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";

import { Image } from "@/utils/type";
import { useInputGeneration } from "@/components/main/hooks/useInputGeneration";
import { useUser } from "@/utils/useUser";
import { useCollection } from "@/components/modal/useCollection";

interface Props {
  index: number;
  category: string;
  collection: Image;
  className?: string;
  onOpen: (id: string) => void;
}

export const Collection: React.FC<Props> = ({
  collection,
  index,
  category,
  className,
  onOpen,
}) => {
  const { user } = useUser();
  const { setPrompt } = useInputGeneration();
  const { updateVisibility, remove } = useCollection(collection?.id);

  const formatDate = useMemo(() => {
    const date = new Date(collection.createdAt);
    return date.toLocaleDateString();
  }, [collection.createdAt]);

  const isNotVisible = useMemo(() => {
    return category !== "my-own" && !collection.is_visible;
  }, [collection.is_visible, category]);

  return (
    <div className={`h-[377px] w-full relative ${className}`}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-id={collection.id}
        transition={{
          duration: 0.35,
          delay: (index % 15) * 0.1,
        }}
        className="rounded-[33px] h-[377px] cursor-pointer group overflow-hidden relative z-[1] group"
        onClick={() => onOpen(collection.id)}
      >
        <div className="absolute top-0 left-0 w-full h-full translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex items-end p-3">
          <div className="bg-[#292424] backdrop-blur-sm bg-opacity-60 rounded-xl p-3 border-white/20 border w-full">
            <p className="text-xs font-semibold text-white/60 mb-0.5">
              {formatDate}
            </p>
            <p className="text-lg font-medium text-white lowercase leading-snug">
              {collection.prompt?.length > 200
                ? `${collection.prompt.slice(0, 200)}...`
                : collection.prompt}
            </p>
            <p
              className="text-white text-sm text-right font-semibold mt-2"
              onClick={(e) => {
                e.stopPropagation();
                setPrompt(collection.prompt);
              }}
            >
              Try it now
            </p>
          </div>
        </div>
        <div
          style={{
            backgroundImage: `url(https://huggingface.co/datasets/enzostvs/stable-diffusion-tpu-generations/resolve/main/images/${collection.file_name}.png)`,
          }}
          className={classNames(
            "rounded-[33px] bg-gray-950 bg-cover absolute top-0 left-0 w-full h-full z-[-1] transition-all duration-200 group-hover:scale-110 bg-center",
            {
              "opacity-40": isNotVisible,
            }
          )}
        />
        {isNotVisible && (
          <div
            className={classNames("flex items-center gap-2", {
              "justify-between py-3 pr-5 pl-3": user?.is_admin,
              "justify-end py-6 px-5": !user?.is_admin,
            })}
          >
            {user?.is_admin ? (
              <div className="flex items-center justify-start gap-2 p-2 bg-black/20 backdrop-blur rounded-full hover:bg-black/50">
                <div
                  className="rounded-full bg-white w-8 h-8 flex items-center justify-center p-1 transition-all duration-200 hover:-translate-y-1"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await updateVisibility();
                  }}
                >
                  <AiFillCheckCircle className="w-full h-full text-gray-800" />
                </div>
                <div
                  className="rounded-full bg-red-500 w-8 h-8 flex items-center justify-center p-1.5 transition-all duration-200 hover:-translate-y-1.5"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await remove();
                  }}
                >
                  <BsFillTrashFill className="w-full h-full text-white" />
                </div>
              </div>
            ) : (
              <span />
            )}
            <AiFillEyeInvisible className="text-white/70 text-2xl" />
          </div>
        )}
      </motion.div>
    </div>
  );
};
