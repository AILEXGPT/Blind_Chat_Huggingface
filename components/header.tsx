"use client";
import Image from "next/image";

import HeaderImage from "@/assets/images/header_illustration.webp";

import { useInputGeneration } from "@/components/main/hooks/useInputGeneration";
import classNames from "classnames";

export const Header = () => {
  const { hasMadeFirstGeneration } = useInputGeneration();

  return (
    <header
      className={classNames(
        "bg-black z-[1] transition-all duration-1000 overflow-hidden",
        {
          "!max-h-[0px] mb-6": hasMadeFirstGeneration,
          "max-h-[450px]": !hasMadeFirstGeneration,
        }
      )}
    >
      <div className="relative bg-cover bg-fixed bg-black z-[1]">
        <div className="flex items-start px-6 mx-auto max-w-[1722px] relative pt-24 pb-20">
          <div className="w-full relative z-10">
            <h1 className="font-bold text-5xl lg:text-7xl text-white text-center lg:text-left">
              Fast Stable Diffusion XL ⚡
            </h1>
            <p className="text-3xl lg:text-4xl text-transparent bg-gradient-to-tr from-indigo-300 via-blue-500 to-pink-400 bg-clip-text font-bold text-left mt-2 block max-w-max mx-auto lg:ml-0">
              on TPU v5e
            </p>

            <p className="text-base text-white/70 mt-3 text-center lg:text-left">
              Generate your own images - all images generated are community
              shared.
            </p>
          </div>
          <div
            className="absolute w-full lg:w-1/3 right-0 xl:right-44 -bottom-32 lg:-bottom-32 bg-gradient-to-br from-blue-500 to-pink-500 blur-xl lg:blur-[130px] h-full z-[-1]"
            style={{ willChange: "transform" }}
          ></div>
        </div>
        <div className="absolute bottom-0 w-full h-full left-0 bg-gradient-to-b from-transparent to-black z-[1]" />
      </div>
    </header>
  );
};
