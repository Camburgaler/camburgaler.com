"use client";

import { LhcArgs } from "@camburgaler/latin-hypercube-shared";
import Link from "next/link";
import { JSX, useState } from "react";
import { LhcScaleInput } from "../lib/components/lhc/LhcScaleInput";
import { LHC_VERSION } from "../lib/constants";
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
    const [reqSubmitted, setReqSubmitted] = useState<boolean>(false);

    return (
        <div style={{ marginBottom: "30px" }}>
            <header className="row center">
                <h1>Latin Hypercube Generator (version {lhcVersionDisplay})</h1>
            </header>
            <h2>
                <Link href="/">Home</Link>
            </h2>
            <p>
                What this page does is simple. Here is the sequence of events:
            </p>

            <ol>
                <li>
                    The user (that&apos;s you!) configures the running
                    parameters of the LHC sampling tool via the interface below.
                </li>
                <li>The user clicks the &quot;Submit&quot; button.</li>
                <li>This page sends a request to the LHC API.</li>
                <li>
                    The LHC API uses the Github Metadata API to find the latest
                    version of the v{LHC_VERSION} LHC sampler executable.
                </li>
                <li>
                    The LHC API downloads the LHC sampler executable from
                    Github.
                </li>
                <li>
                    The LHC API runs the LHC sampler executable, using the
                    user-supplied parameters.
                </li>
                <li>
                    The LHC sampler writes the output to a temporary CSV file.
                </li>
                <li>
                    The LHC API reads the CSV file and returns it to this page.
                </li>
                <li>This page displays the output.</li>
                <li>
                    Optionally, the user can then download the output as a CSV
                    file.
                </li>
            </ol>

            <p>
                This is intended to demonstrate the capabilities of the LHC
                sampler tool. If you are interested in cutting out the middleman
                and using the tool for yourself, please feel free to navigate
                back to the Home page (using the &quot;Home&quot; link above),
                click the &quot;source&quot; link in the CLI Latin Hypercube
                Point Sampler heading, and download the latest version of the
                executable from Github for use on your own machine! The Github
                repo includes documentation for the arguments that the tool will
                accept.
            </p>
            <p>
                However, you might be asking yourself: What is the point of this
                tool? What is a &quot;hypercube&quot;? Why is it latin? All
                adequate questions.
            </p>
            <p>
                To begin with, consider the following: You are a statistician
                working at Los Alamos National Laboratory in the New Mexican
                Jemez mountains in 1979. You&apos;re working on simulated models
                of mid-air nuclear detonations. You need a way of quickly
                understanding the general impact of such an event, but it&apos;s
                difficult to run a large number of simulations when you have to
                manually tweak the inputs between runs. There are a variety of
                inputs to tweak. Some examples include: height of detonation
                above the surface, height of detonation above sea-level, what
                kind of surface is below the detonation, surface topography,
                wind speed, wind direction, amount of nuclear material
                triggering the detonation, and so on. You need a way to generate
                lots of random, meaningful values for these inputs ahead of time
                so that you can queue a bunch of simulations, then analyze the
                results en masse. The solution you devise: a generalization of
                Latin squares that allows for any number of
                &quot;dimensions&quot; on the square. Each dimension equates to
                a parameter of the simulation, and each point of the Latin
                square equates to a set of values for all of the
                simulation&apos;s parameters.
            </p>
            <p>
                If that explanation is not clear enough, simply click
                &quot;Submit&quot; below. This webpage will proceed with the
                default parameters, and you will see 1000 five-dimensional
                points sampled. Alternatively, my email is displayed at the
                bottom of the page. If you have any questions or comments,
                please reach out to me!
            </p>
            <p>- Cameron Chrobocinski</p>
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
                            setReqSubmitted(true);
                            fetchLhcJson(args).then((data: LhcResponse) => {
                                setLhcOutput(
                                    data.csv
                                        .split("\n")
                                        .map((x: string) => x.split(","))
                                );
                                setLhcVersionDisplay(data.version);
                                setReqSubmitted(false);
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
                    {reqSubmitted && (
                        <p>Request submitted. Awaiting Response...</p>
                    )}
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
