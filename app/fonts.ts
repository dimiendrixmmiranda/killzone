import { Teko } from "next/font/google";
import { Lato } from "next/font/google";

export const teko = Teko({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-teko",
  display: "swap",
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: "--font-lato",
  display: "swap",
});
