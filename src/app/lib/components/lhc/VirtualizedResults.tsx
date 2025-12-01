"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export function VirtualizedResults({ rows }: { rows: string[][] }) {
    const parentRef = useRef<HTMLDivElement>(null);

    // Virtualizer for body rows only (exclude header)
    const bodyRows = rows.slice(1);

    const rowVirtualizer = useVirtualizer({
        count: bodyRows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 28, // row height
        overscan: 5,
    });

    return (
        <div
            ref={parentRef}
            style={{
                height: "600px",
                overflow: "auto",
                borderRadius: "0.5rem",
            }}
        >
            <table>
                <thead>
                    <tr>
                        {rows[0].map((cell, i) => (
                            <th key={i}>{cell}</th>
                        ))}
                    </tr>
                </thead>

                {/* Virtualized tbody */}
                <tbody
                    style={{
                        height: rowVirtualizer.getTotalSize(),
                        position: "relative",
                        width: "100%",
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const row = bodyRows[virtualRow.index];
                        return (
                            <tr
                                key={virtualRow.key}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    transform: `translateY(${virtualRow.start}px)`,
                                    display: "flex",
                                    width: "100%",
                                }}
                            >
                                {row.map((cell, j) => (
                                    <td key={j}>{cell}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
