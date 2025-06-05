"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
    const pathname = usePathname();

    return (
        <nav>
            <h3>
                <Link href="/" className={pathname === "/" ? "current" : ""}>
                    Home
                </Link>
            </h3>
        </nav>
    );
}
