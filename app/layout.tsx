import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIP — 旅の裏側を、暴きあえ。",
  description: "写真人狼型の記憶のスパイスWebアプリ",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {/* Grain texture overlay — subtle film-grain feel */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
