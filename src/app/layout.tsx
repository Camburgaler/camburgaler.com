import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "./lib/components/Footer";
import { NavLinks } from "./lib/components/NavLinks";

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
                <NavLinks />
                {children}
                <Footer />
            </body>
        </html>
    );
}
