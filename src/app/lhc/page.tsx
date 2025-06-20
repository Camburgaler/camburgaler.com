"use client";

import Link from "next/link";
import { JSX, useState } from "react";
import { LhcScaleInput } from "../lib/components/lhc/LhcScaleInput";
import { LhcArgs } from "../lib/types/lhcArgs";
import { LhcResponse } from "../lib/types/lhcResponse";
import {
    displayVersion,
    fetchLhcJson,
    toggleCustomizeScales,
    toggleDefaultDimensionHeadings,
    toggleRandom,
    updateBaseScale,
    updateColumnHeadings,
    updateCustomizeBaseScale,
    updateDimensions,
    updateNumber,
    updateScale,
} from "./script";

export default function LHC(): JSX.Element {
    const [customizeBaseScale, setCustomizeBaseScale] =
        useState<boolean>(false);
    const [customizeColumnHeadings, setCustomizeColumnHeadings] =
        useState<boolean>(false);
    const [customizeScales, setCustomizeScales] = useState<boolean>(false);
    const [args, setArgs] = useState<LhcArgs>({
        number: 1000,
        dimensions: 5,
        random: "true",
        base_scale: { lower: 0, upper: 1000 },
        scales: {
            0: { lower: 0, upper: 1000 },
            1: { lower: 0, upper: 1000 },
            2: { lower: 0, upper: 1000 },
            3: { lower: 0, upper: 1000 },
            4: { lower: 0, upper: 1000 },
        },
        column_headings: ["dim0", "dim1", "dim2", "dim3", "dim4"],
    });
    const [lhcOutput, setLhcOutput] = useState<string[][]>([]);
    const [lhcVersionDisplay, setLhcVersionDisplay] = useState<string>(
        displayVersion()
    );

    return (
        <div>
            <header className="row center">
                <h1>Latin Hypercube Generator (version {lhcVersionDisplay})</h1>
            </header>
            <h2>
                <Link href="/">Home</Link>
            </h2>
            <hr />
            <main>
                <section>
                    <article>
                        <div>
                            <label htmlFor="number">Number of points: </label>
                            <input
                                type="number"
                                name="number"
                                id="number"
                                min="1"
                                max={Number.MAX_VALUE}
                                value={args.number}
                                step={1}
                                required
                                onChange={(e) => {
                                    updateNumber(
                                        setArgs,
                                        Number(e.target.value),
                                        args,
                                        customizeBaseScale,
                                        customizeScales
                                    );
                                }}
                            />
                        </div>
                        {" | "}
                        <div>
                            <label htmlFor="dimensions">Dimensions: </label>
                            <input
                                type="number"
                                name="dimensions"
                                id="dimensions"
                                min="1"
                                max={Number.MAX_VALUE}
                                value={args.dimensions}
                                step={1}
                                onChange={(e) => {
                                    updateDimensions(
                                        setArgs,
                                        args,
                                        Number(e.target.value)
                                    );
                                }}
                            />
                        </div>
                        {" | "}
                        <div>
                            <label htmlFor="customize-base-scale">
                                Customize Base Scale?{" "}
                            </label>
                            <input
                                type="checkbox"
                                name="customize-base-scale"
                                id="customize-base-scale"
                                checked={customizeBaseScale}
                                onChange={(e) => {
                                    updateCustomizeBaseScale(
                                        setCustomizeBaseScale,
                                        e.target.checked,
                                        setArgs,
                                        args
                                    );
                                }}
                            />
                        </div>
                        {" | "}
                        <div>
                            <label htmlFor="base-scale">
                                Base Scale (lower:upper):{" "}
                            </label>
                            <LhcScaleInput
                                name="base-scale"
                                args={args}
                                requiredCondition={customizeBaseScale}
                                value={args.base_scale!}
                                onChange={{
                                    lower: (e) => {
                                        updateBaseScale(
                                            setArgs,
                                            args,
                                            Number(e.target.value),
                                            args.base_scale?.upper ??
                                                Number(e.target.value),
                                            customizeScales
                                        );
                                    },
                                    upper: (e) => {
                                        updateBaseScale(
                                            setArgs,
                                            args,
                                            args.base_scale?.lower ??
                                                Number(e.target.value),
                                            Number(e.target.value),
                                            customizeScales
                                        );
                                    },
                                }}
                            />
                        </div>
                    </article>
                    <article>
                        <table>
                            <tbody>
                                <tr>
                                    <th>
                                        Dimension Name (Default?{" "}
                                        <input
                                            type="checkbox"
                                            name="default"
                                            id="default"
                                            checked={!customizeColumnHeadings}
                                            onChange={(e) => {
                                                toggleDefaultDimensionHeadings(
                                                    setCustomizeColumnHeadings,
                                                    e.target.checked,
                                                    setArgs,
                                                    args
                                                );
                                            }}
                                        />
                                        )
                                    </th>
                                    <th>
                                        Slightly Randomize Values (All?{" "}
                                        <input
                                            type="checkbox"
                                            name="random"
                                            id="random"
                                            checked={args.random == "true"}
                                            onChange={(e) => {
                                                setArgs({
                                                    ...args,
                                                    random: e.target.checked
                                                        ? "true"
                                                        : "false",
                                                });
                                            }}
                                        />
                                        )
                                    </th>
                                    <th>
                                        Scale Override (Base Scale for All?{" "}
                                        <input
                                            type="checkbox"
                                            checked={!customizeScales}
                                            onChange={(e) => {
                                                toggleCustomizeScales(
                                                    setCustomizeScales,
                                                    e.target.checked,
                                                    args,
                                                    setArgs
                                                );
                                            }}
                                        />
                                        )
                                    </th>
                                </tr>
                                {[...Array(args.dimensions).keys()].map((i) => (
                                    <tr key={i}>
                                        <td>
                                            <input
                                                type="text"
                                                name={`column-heading-${i}`}
                                                disabled={
                                                    !customizeColumnHeadings
                                                }
                                                value={
                                                    args.column_headings?.[i]
                                                }
                                                style={{
                                                    width: "100%",
                                                }}
                                                onChange={(e) => {
                                                    updateColumnHeadings(
                                                        args,
                                                        i,
                                                        e.target.value,
                                                        setArgs
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name={`random-${i}`}
                                                id={`random-${i}`}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                                disabled={
                                                    args.random === "true"
                                                }
                                                checked={
                                                    typeof args.random ===
                                                    "string"
                                                        ? args.random === "true"
                                                        : args.random?.includes(
                                                              i
                                                          )
                                                }
                                                onChange={(e) => {
                                                    toggleRandom(
                                                        e.target.checked,
                                                        args,
                                                        i,
                                                        setArgs
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <LhcScaleInput
                                                name={`scale-${i}`}
                                                className="table-scale-input"
                                                args={args}
                                                requiredCondition={
                                                    customizeScales
                                                }
                                                value={args.scales?.[i]}
                                                onChange={{
                                                    lower: (e) => {
                                                        updateScale(
                                                            Number(
                                                                e.target.value
                                                            ),
                                                            args.scales?.[i]
                                                                .upper,
                                                            i,
                                                            setArgs,
                                                            args
                                                        );
                                                    },
                                                    upper: (e) => {
                                                        updateScale(
                                                            args.scales?.[i]
                                                                .lower,
                                                            Number(
                                                                e.target.value
                                                            ),
                                                            i,
                                                            setArgs,
                                                            args
                                                        );
                                                    },
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </article>
                    <button
                        type="submit"
                        onClick={() => {
                            fetchLhcJson(args).then((data: LhcResponse) => {
                                setLhcOutput(
                                    data.csv
                                        .split("\r\n")
                                        .map((x: string) => x.split(","))
                                );
                                setLhcVersionDisplay(data.version);
                            });
                        }}
                    >
                        Submit
                    </button>
                    {lhcOutput.length > 1 && (
                        <button
                            onClick={() => {
                                const csv = lhcOutput
                                    .filter((row) => row[0] !== "")
                                    .map((row) => row.join(","))
                                    .join("\r\n");
                                const blob = new Blob([csv], {
                                    type: "text/csv",
                                });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = "lhc.csv";
                                link.click();
                                URL.revokeObjectURL(url);
                            }}
                        >
                            Download
                        </button>
                    )}
                </section>
                <section>
                    {lhcOutput.length > 1 && (
                        <table>
                            <tbody>
                                {lhcOutput.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) =>
                                            i === 0 ? (
                                                <th key={j}>{cell}</th>
                                            ) : (
                                                <td key={j}>{cell}</td>
                                            )
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </div>
    );
}
