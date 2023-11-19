import { motion } from "framer-motion";
import { FaSadCry } from "react-icons/fa";
import classNames from "classnames";

interface Props {
  prompt: string;
  error?: string;
  className?: string;
}

export const CollectionLoading: React.FC<Props> = ({
  prompt,
  error,
  className,
}) => {
  return (
    <div className={`h-[377px] w-full relative ${className}`}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className={classNames(
          "rounded-3xl h-[377px] cursor-pointer group relative group flex flex-col justify-between p-8 z-[1]",
          {
            "bg-primary/70": !error,
            "bg-red-500/80 ring-8 ring-red-400/20": error,
          }
        )}
      >
        {error ? (
          <FaSadCry className="text-white/60 text-5xl" />
        ) : (
          <div className="loading-dots translate-y-[5px]">
            <span />
            <span />
            <span />
          </div>
        )}
        <p className="text-white/70 font-semibold text-xl">
          {error
            ? error
            : prompt?.length > 180
            ? `${prompt.slice(0, 180)}...`
            : prompt}
        </p>
      </motion.div>
    </div>
  );
};
