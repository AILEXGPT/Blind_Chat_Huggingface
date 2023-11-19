"use client";

import { useCookie, useUpdateEffect } from "react-use";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useUser = () => {
  const [value, setValue, remove] = useCookie("auth_hf_token");

  const {
    data: user,
    refetch,
    isFetching: loading,
    remove: clear,
  }: any = useQuery(
    ["user.me"],
    async () => {
      if (!value) return null;
      if (user) return user;
      const request = await fetch("/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${value}`,
        },
      })

      const res = await request.clone().json().catch(() => ({}));

      if (!res.ok) {
        remove();
        clear();
        return null;
      }
      return res?.user;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );
  
  useUpdateEffect(() => {
    if (value) {
      refetch()
    }
  }
  , [value]);

  const openWindowLogin = async () => {
    const response = await fetch(`/api/login`);
    const { ok, redirect } = await response.json();
    if (ok && redirect) {
      window.open(redirect, "_blank");
    }
  };

  const getAuthorization = async (code: string) => {
    const request = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({
        code,
      }),
    });
    const res = await request.clone().json().catch(() => ({}));
    if (!res.ok) {
      return null;
    }
    setValue(res.access_token, {
      expires: res.experes_in,
      sameSite: "none",
      path: "/",
      secure: true,
    });
  }

  return {
    openWindowLogin,
    user,
    refetch,
    loading,
    token: `Bearer ${value}`,
    getAuthorization
  }
}