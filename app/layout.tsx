import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-jp";
import "@fontsource-variable/inconsolata";
import "./globals.css";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { ReactNode } from "react";
import { EmbedContextProvider } from "./terminal/embedContext";
import { AutoAnonymousLogin } from "./accountMenu";
import { SidebarMdProvider } from "./sidebar";
import { RuntimeProvider } from "./terminal/runtime";

export const metadata: Metadata = {
  title: {
    template: "%s - my.code();",
    default: "my.code();",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body className="w-screen h-screen bg-inherit! text-inherit! m-0!">
        {/* mocha.css がbodyに背景色などを設定してしまうので、それを上書きしている */}
        <AutoAnonymousLogin />
        <SidebarMdProvider>
          <div className="drawer lg:drawer-open">
            <input
              id="drawer-toggle"
              type="checkbox"
              className="drawer-toggle"
            />
            <div className="drawer-content flex flex-col">
              <Navbar />
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
              <Sidebar />
            </div>
          </div>
        </SidebarMdProvider>
      </body>
    </html>
  );
}
