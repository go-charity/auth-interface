import "@/styles/globals.scss";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import icon from "@/app/favicon.ico";
import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GO.Charity Authentication",
  description: "The authentication UI for the GO.Charity platform",
  icons: { icon: icon.src },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
          {...{ crossorigin: "anonymous" }}
          {...{ referrerpolicy: "no-referrer" }}
        />
      </head>
      <body className={poppins.className}>
        <Suspense
          fallback={
            <div
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(to bottom, #fff1f3, #ffc0cb)",
              }}
            >
              Loading...
            </div>
          }
        >
          {children}
          <NextTopLoader color="#fe6e8b" />
        </Suspense>
      </body>
    </html>
  );
}
