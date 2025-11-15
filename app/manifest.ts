import type { MetadataRoute } from "next";
import { metadata as pageMetadata } from "./page";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "my.code();",
    short_name: "my.code();",
    description: pageMetadata.description as string,
    start_url: "/",
    display: "standalone",
    // TODO:
    // background_color: "#fff",
    // theme_color: "#fff",
    icons: [
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
