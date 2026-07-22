import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaratSense AI — Consultative AI & Software Studio",
  description:
    "CaratSense AI is a consultative AI and software studio. We go deep into your operations, find where things are breaking down, and build tailored tech to fix it.",
  icons: {
    icon: [
      { url: "/logo-symbol.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/logo-symbol.png",
    apple: "/logo-symbol.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="icon" type="image/png" href="/logo-symbol.png" />
        <link rel="shortcut icon" href="/logo-symbol.png" />
        <link rel="apple-touch-icon" href="/logo-symbol.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.10/dist/dotlottie-wc.js"
          type="module"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
