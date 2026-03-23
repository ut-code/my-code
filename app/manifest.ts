import type { MetadataRoute } from "next";
import { metadata as pageMetadata } from "./page";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "my.code();",
    short_name: "my.code();",
    description: pageMetadata.description as string,
    start_url: "/",
    display: "standalone",
    background_color: "#fef7f2", // base-100
    theme_color: "#ba6900", // primary
    icons: [
      {
        src: "/icon_pad.png", // これだけ背景色もついている
        sizes: "512x512",
        purpose: "maskable",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
