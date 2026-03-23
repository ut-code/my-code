import type { Metadata } from "next";
import "@fontsource-variable/inconsolata";
// import "@fontsource/m-plus-rounded-1c/400.css";
// import "@fontsource/m-plus-rounded-1c/700.css";
import "@/m-plus-rounded-1c-nohint/400.css";
import "@/m-plus-rounded-1c-nohint/700.css";
import "./globals.css";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { ReactNode } from "react";
import { EmbedContextProvider } from "@/terminal/embedContext";
import { AutoAnonymousLogin } from "./accountMenu";
import { SidebarMdProvider } from "./sidebar";
import { RuntimeProvider } from "@my-code/runtime/context";
import { getPagesList } from "@/lib/docs";
import { Footer } from "./footer";

export const metadata: Metadata = {
  title: {
    template: "%s - my.code();",
    default: "my.code();",
  },
  metadataBase: new URL("https://my-code.utcode.net"),
  openGraph: {
    type: "website",
    siteName: "my.code();",
    images: "/icon_title.png",
  },
  twitter: {
    card: "summary",
    site: "@utokyo_code",
    images: "/icon_pad.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pagesList = await getPagesList();
  return (
    <html lang="ja">
      <body className="w-full min-h-screen bg-transparent! text-inherit! m-0!">
        {/* mocha.css がbodyに背景色などを設定してしまうので、それを上書きしている */}
        <AutoAnonymousLogin />
        <SidebarMdProvider>
          <div className="drawer has-sidebar:drawer-open min-h-screen">
            <input
              id="drawer-toggle"
              type="checkbox"
              className="drawer-toggle"
            />
            <div className="drawer-content flex flex-col">
              <Navbar pagesList={pagesList} />
              <EmbedContextProvider>
                <RuntimeProvider>{children}</RuntimeProvider>
              </EmbedContextProvider>
            </div>
            <div className="drawer-side shadow-md z-50">
              <label
                htmlFor="drawer-toggle"
                aria-label="close sidebar"
                className="drawer-overlay"
              />
              <Sidebar pagesList={pagesList} />
            </div>
          </div>
        </SidebarMdProvider>
        <Footer />
      </body>
    </html>
  );
}
