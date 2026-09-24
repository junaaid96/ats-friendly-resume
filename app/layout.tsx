import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/Toast";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

const fraunces = Fraunces({
    variable: "--font-fraunces",
    subsets: ["latin"],
    display: "swap",
    axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
    title: "Arvix Resume Builder - ATS Friendly Resume Creator",
    description:
        "Create professional, ATS-friendly resumes with a live preview, AI writing help and a job match checker. Free, private, and ready to print.",
};

export const viewport: Viewport = {
    themeColor: "#faf8f5",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // Font variables go on <html> so the theme's --font-* tokens (defined on :root) can resolve them.
        <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
            <body
                className="font-sans antialiased"
                suppressHydrationWarning
            >
                {children}
                <ToastContainer />
            </body>
        </html>
    );
}
