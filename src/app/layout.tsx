import Header from "@/components/Header";
import UserContextProvider from "@/context/UserContext";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "roc8 | Anmol Kumar",
  description: "roc8 assignment for developer job",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
      <UserContextProvider>
          <Header/>
            <main className="h-[calc(100vh-128px)] flex items-center justify-center">
              {children}
              <Toaster position="top-center"/>
            </main>
        </UserContextProvider>
      </body>
    </html>
  );
}
