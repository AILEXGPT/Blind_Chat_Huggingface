"use client";
import React from "react";
import { Hydrate as HydrationBoundary } from "@tanstack/react-query";

function Hydrate(props: { children: React.ReactNode }) {
  return <HydrationBoundary>{props.children}</HydrationBoundary>;
}

export default Hydrate;
