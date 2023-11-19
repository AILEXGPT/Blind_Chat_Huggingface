import { cache } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryClient } from "@tanstack/react-query";

import "@/assets/globals.css";
import Providers from "@/components/react-query/providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const getQueryClient = () => cache(() => new QueryClient());

export const metadata: Metadata = {
  title: "Fast Stable Diffusion XL ⚡",
  description: `
Generate your own images - all images generated are community shared.
`,
  metadataBase: new URL("https://enzostvs-stable-diffusion-tpu.hf.space"),
  openGraph: {
    type: "website",
    url: "https://enzostvs-stable-diffusion-tpu.hf.space",
    title: "Fast Stable Diffusion XL ⚡",
    description: `
Generate your own images - all images generated are community shared.
`,
    images: "/banner.png",
  },
  twitter: {
    site: "https://enzostvs-stable-diffusion-tpu.hf.space",
    card: "summary_large_image",
    images: "/banner.png",
    title: "Fast Stable Diffusion XL ⚡",
    description: `
Generate your own images - all images generated are community shared.
`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <Script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.1/iframeResizer.contentWindow.min.js" /> */}
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
