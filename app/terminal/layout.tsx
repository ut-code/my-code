import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Runtime Test Page",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
