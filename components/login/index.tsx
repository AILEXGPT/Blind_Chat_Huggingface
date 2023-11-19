"use client";

import { useMount, useUpdateEffect } from "react-use";
import Image from "next/image";
import { FaUserAstronaut } from "react-icons/fa";

import { useUser } from "@/utils/useUser";
import HFLogo from "@/assets/images/hf-logo.svg";
import classNames from "classnames";
import { HiCheckBadge } from "react-icons/hi2";

export const Login = ({ code }: { code?: string }) => {
  const { getAuthorization, user } = useUser();

  useMount(() => getAuthorization(code as string));

  useUpdateEffect(() => {
    if (user) {
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, [user]);

  return (
    <div className="p-6 min-h-screen flex items-center justify-center">
      <div className="mx-auto bg-white w-full max-w-sm rounded-3xl p-6">
        <p
          className={classNames(
            "text-center text-gray-400 uppercase font-bold text-sm whitespace-pre-line",
            {
              "!text-green-600": user,
            }
          )}
        >
          {user
            ? "You have been logged in successfully. \nRedirecting..."
            : "Retrieving your information..."}
        </p>
        <div className="flex items-center justify-evenly mt-3">
          <Image src={HFLogo} alt="HF Logo" width={100} height={100} />
          {user ? (
            <HiCheckBadge className="w-[30px] h-[30px] text-green-500" />
          ) : (
            <div className="loading-dots grey translate-y-[5px]">
              <span />
              <span />
              <span />
            </div>
          )}
          <div className="w-[80px] h-[80px] rounded-full ring-4 ring-indigo-200 border-2 border-white bg-indigo-50 p-3">
            <FaUserAstronaut className="w-full h-full text-indigo-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
