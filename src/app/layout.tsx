import type { Metadata } from "next";
import "./globals.css";

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
                    href="https://fonts.googleapis.com/css?family=Montserrat"
                    rel="stylesheet"
                />
            </head>
            <body
                className="column separate"
                style={{ padding: "2%", gap: "15px" }}
            >
                {children}
            </body>
        </html>
    );
}
