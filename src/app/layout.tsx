import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const runtime = "edge";

export const metadata: Metadata = {
  title: "First Embroidery 初刺 | Embroidery Workshop HK",
  description: "學會刺繡，也學會過溫暖的日子。工作室地點：觀塘興業街。提供工作坊、訂製及材料包。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body
        className={`${notoSerifTC.variable} ${notoSansTC.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
