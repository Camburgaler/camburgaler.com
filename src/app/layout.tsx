import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "./lib/components/Footer";

export const metadata: Metadata = {
    title: "Cameron Chrobocinski",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css?family=Montserrat&display=optional"
                    rel="stylesheet"
                />
            </head>
            <body
                className="column separate"
                style={{ padding: "2%", gap: "15px" }}
            >
                {children}
                <Footer />
            </body>
        </html>
    );
}
