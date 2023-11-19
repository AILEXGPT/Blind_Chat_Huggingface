"use client";

import { useState } from "react";
import { HiUserGroup, HiHeart, HiAdjustmentsHorizontal } from "react-icons/hi2";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import { createBreakpoint } from "react-use";

import { InputGeneration } from "@/components/input-generation";
import { Button } from "@/components/button";
import { useUser } from "@/utils/useUser";

import { useInputGeneration } from "./hooks/useInputGeneration";
import { Collections } from "./collections";
import { Settings } from "./settings";

const categories = [
  {
    key: "community",
    label: "Community",
    icon: <HiUserGroup className="text-lg lg:text-2xl" />,
  },
  {
    key: "my-own",
    label: "My generations",
    isLogged: true,
    icon: <HiHeart className="text-lg lg:text-2xl" />,
  },
];

const useBreakpoint = createBreakpoint({ XL: 1280, L: 1024, S: 768, XS: 640 });

export const Main = () => {
  const { openWindowLogin, user } = useUser();
  const breakpoint = useBreakpoint();
  const { list_styles, style, setStyle, loading } = useInputGeneration();
  const [category, setCategory] = useState<string>("community");
  const [advancedSettings, setAdvancedSettings] = useState<boolean>(false);

  return (
    <main className="px-6 z-[2] relative max-w-[1722px] mx-auto">
      <div className="bg-black bg-opacity-30 backdrop-blur-sm lg:sticky lg:top-4 z-10 rounded-full p-2 lg:py-2 lg:pl-2 lg:pr-3">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full">
          <InputGeneration />
          <div className="items-center justify-center flex-col lg:flex-row lg:justify-end gap-5 w-full mt-6 lg:mt-0 flex">
            {categories.map(({ key, label, icon, isLogged }) =>
              isLogged && !user ? (
                <Image
                  key={key}
                  src={`https://huggingface.co/datasets/huggingface/badges/resolve/main/sign-in-with-huggingface-${
                    ["XS", "S"].includes(breakpoint) ? "lg" : "xl"
                  }.svg`}
                  width="100"
                  height="32"
                  alt="Sign in with Hugging Face"
                  className="cursor-pointer hover:-translate-y-1 transition-all duration-200 w-auto object-contain"
                  onClick={openWindowLogin}
                />
              ) : (
                <Button
                  key={key}
                  disabled={loading}
                  theme={key !== category ? "white" : "primary"}
                  onClick={() => setCategory(key)}
                >
                  {icon}
                  {label}
                </Button>
              )
            )}
          </div>
        </div>
      </div>
      <div
        className={classNames(
          "flex items-center justify-center lg:justify-end text-right gap-1 mt-4 lg:mt-0",
          {
            "text-gray-300 text-sm": !user?.sub,
            "text-white text-sm": user?.sub,
          }
        )}
      >
        {user?.sub ? (
          <>
            Logged as
            <Link
              href={user?.profile}
              target="_blank"
              className="hover:text-blue-500 flex items-center justify-end gap-2"
            >
              @{user?.preferred_username}
              <Image
                src={user?.picture}
                width={24}
                height={24}
                className="rounded-full ring-1 ring-white/60 border border-black"
                alt={user?.preferred_username}
              />
            </Link>
          </>
        ) : (
          "to persist your images in your own gallery"
        )}
      </div>
      <p
        className="text-white/70 font-medium text-sm flex items-center justify-center lg:justify-start gap-2 hover:text-white cursor-pointer mt-3"
        onClick={() => setAdvancedSettings(!advancedSettings)}
      >
        <HiAdjustmentsHorizontal className="w-5 h-5" />
        Advanced settings
      </p>
      <Settings
        open={advancedSettings}
        style={style}
        setStyle={setStyle}
        list_styles={list_styles}
      />
      <Collections category={category} />
    </main>
  );
};
