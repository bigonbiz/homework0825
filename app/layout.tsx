import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "R&D Signal Radar | ICT R&D 전략 신호",
  description: "정책·기술·시장 신호로 다음 ICT R&D 기획의 근거를 발견하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
