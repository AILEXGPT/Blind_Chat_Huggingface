import classNames from "classnames";
import { useRef, useState } from "react";
import { FaMagic } from "react-icons/fa";
import { HiLightBulb } from "react-icons/hi";
import { useUpdateEffect } from "react-use";
import { useInputGeneration } from "./main/hooks/useInputGeneration";

export const InputGeneration: React.FC = () => {
  const { prompt, setPrompt, submit, loading } = useInputGeneration();
  const [value, setValue] = useState<string>(prompt);
  const input = useRef<HTMLInputElement>(null);

  useUpdateEffect(() => setValue(prompt), [prompt]);

  return (
    <div
      className="bg-white rounded-full p-3 w-full max-w-3xl flex items-center justify-between group transition-all duration-200 focus-within:ring-[6px] focus-within:ring-primary border-[2px] border-white focus-within:ring-opacity-40 focus-within:border-primary gap-3"
      onClick={() => input.current?.focus()}
    >
      <div className="flex items-center gap-3 pl-3 w-full">
        <HiLightBulb className="text-2xl text-gray-400 group-focus-within:text-primary transition-all duration-200" />
        <input
          ref={input}
          value={value}
          type="text"
          className="h-full text-lg placeholder:text-gray-400 text-gray-900 font-medium w-full outline-none truncate"
          placeholder="A red car, forest in the background"
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setPrompt(value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (value || prompt) && !loading) {
              setPrompt(value);
              setTimeout(() => {
                submit();
              }, 10);
            }
          }}
        />
      </div>
      <button
        disabled={!prompt && !value}
        className={classNames(
          "bg-primary disabled:bg-gray-300 disabled:text-gray-500 uppercase text-white font-semibold rounded-full px-2 lg:px-4 py-2 text-base transition-all duration-200",
          {
            "animate-pulse": loading,
          }
        )}
        onClick={() => {
          if ((!value && !prompt) || loading) return;
          submit();
        }}
      >
        <span className="hidden lg:block">
          {loading ? "Generating..." : "Generate"}
        </span>
        <FaMagic className="w-5 h-5 lg:hidden" />
      </button>
    </div>
  );
};
