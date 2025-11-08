import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Arvix Resume Builder - ATS Friendly Resume Creator",
    description:
        "Create professional, ATS-friendly resumes that pass applicant tracking systems and impress recruiters. Build your dream career with Arvix.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} font-sans antialiased`}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
