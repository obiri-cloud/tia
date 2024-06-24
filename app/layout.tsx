import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import "./app.css";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/context/client-provider";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PathnameProvider from "@/context/pathname-provider";
import { ThemeProvider } from "next-themes";
import ThemeProviderWrapper from "./components/theme-provider-wrapper";
import ThemeToggle from "./components/home/themetoggle";
import authOptions from "./api/auth/[...nextauth]/options";
import { ReactQueryClientProvider } from "./components/ReactQueryClientProvider";

const inter = Inter({ subsets: ["latin"] });
// const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TIA Labs",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body
          className={`${inter.className} flex flex-col min-h-screen h-screen `}
        >
          <ThemeProviderWrapper>
            <PathnameProvider />
            <div className="flex-1">
              <Provider session={session}>{children}</Provider>
            </div>
          </ThemeProviderWrapper>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          ></link>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css"
          />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
          <script>hljs.highlightAll();</script>
          <Toaster />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
