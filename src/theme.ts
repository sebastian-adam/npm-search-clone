"use client";
// Use fonts used on npm
import { Poppins, Fira_Mono } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const firaMono = Fira_Mono({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily,
  },
});

export default theme;
