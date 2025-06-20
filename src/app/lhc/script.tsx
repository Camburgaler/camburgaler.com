import { Dispatch, SetStateAction } from "react";
import { LhcArgs, LhcScale } from "../lib/types/lhcArgs";
import { LhcResponse } from "../lib/types/lhcResponse";

const DEFAULT_DIMENSION_PREFIX = "dim";
const LHC_VERSION = "2";

export function updateNumber(
    setArgs: Dispatch<SetStateAction<LhcArgs>>,
    newNum: number,
    args: LhcArgs,
    customizeBaseScale: boolean,
    customizeScales: boolean
): void {
    let newBaseScale = {
        lower: customizeBaseScale ? args.base_scale?.lower! : 0,
        upper: customizeBaseScale ? args.base_scale?.upper! : Number(newNum),
    };

    let newScales: Record<number, LhcScale> = {};
    if (customizeScales) {
        newScales = args.scales!;
    } else {
        for (let i = 0; i < args.dimensions; i++) {
            newScales[i] = {
                lower: newBaseScale.lower,
                upper: newBaseScale.upper,
            };
        }
    }

    setArgs({
        ...args,
        number: Number(newNum),
        base_scale: newBaseScale,
        scales: newScales,
    });
}

export function updateCustomizeBaseScale(
    setCustomizeBaseScale: Dispatch<SetStateAction<boolean>>,
    value: boolean,
    setArgs: Dispatch<SetStateAction<LhcArgs>>,
    args: LhcArgs
): void {
    setCustomizeBaseScale(value);
    if (!value) {
        setArgs({
            ...args,
            base_scale: {
                lower: 0,
                upper: args.number,
            },
        });
    }
}

export function updateBaseScale(
    setArgs: Dispatch<SetStateAction<LhcArgs>>,
    args: LhcArgs,
    lower: number,
    upper: number,
    customizeScales: boolean
) {
    let newScales: Record<number, LhcScale> = {};
    if (customizeScales) {
        newScales = args.scales!;
    } else {
        for (let i = 0; i < args.dimensions; i++) {
            newScales[i] = {
                lower: lower,
                upper: upper,
            };
        }
    }

    return setArgs({
        ...args,
        base_scale: {
            lower: lower,
            upper: upper,
        },
        scales: newScales,
    });
}

export function updateScale(
    newLower: number,
    newUpper: number,
    i: number,
    setArgs: Dispatch<SetStateAction<LhcArgs>>,
    args: LhcArgs
) {
    let lower = newLower;
    let upper = newUpper;

    if (newLower > newUpper) {
        if (newLower != args.scales![i].lower) {
            upper = newLower;
        } else {
            lower = newUpper;
        }
    }

    let newScales = args.scales!;
    newScales[i] = {
        lower: lower,
        upper: upper,
    };

    setArgs({
        ...args,
        scales: newScales,
    });
}

export function constructColumnHeading(
    customizeColumnHeadings: boolean,
    args: LhcArgs,
    i: number
) {
    return customizeColumnHeadings
        ? args.column_headings?.[i]
        : DEFAULT_DIMENSION_PREFIX + i;
}

export function updateColumnHeadings(
    args: LhcArgs,
    i: number,
    newHeading: string,
    setArgs: Dispatch<SetStateAction<LhcArgs>>
) {
    let newHeadings = args.column_headings!;
    newHeadings[i] = newHeading;

    setArgs({
        ...args,
        column_headings: newHeadings,
    });
}

export function toggleRandom(
    checked: boolean,
    args: LhcArgs,
    i: number,
    setArgs: Dispatch<SetStateAction<LhcArgs>>
) {
    if (checked) {
        let random = args.random;
        if (typeof random === "string") {
            random = [];
        }
        random = (random as number[]).concat(i);
        setArgs({
            ...args,
            random: random,
        });
    } else {
        setArgs({
            ...args,
            random: (args.random as number[]).filter((x) => x !== i),
        });
    }
}

export async function fetchLhcJson(args: LhcArgs): Promise<LhcResponse> {
    const rawCsv = await fetch("api/lhc", {
        method: "POST",
        body: JSON.stringify(args),
    });
    return await rawCsv.json();
}

export function displayVersion() {
    const [major, minor, patch] = LHC_VERSION.split(".");
    let display = major + ".";
    if (minor) display += minor + ".";
    if (patch) display += patch;
    else display += "+";
    return display;
}

export function toggleDefaultDimensionHeadings(
    setCustomizeColumnHeadings: Dispatch<SetStateAction<boolean>>,
    checked: boolean,
    setArgs: Dispatch<SetStateAction<LhcArgs>>,
    args: LhcArgs
) {
    if (checked) {
        let newHeadings: string[] = [];
        for (let i = 0; i < args.dimensions; i++) {
            newHeadings[i] = DEFAULT_DIMENSION_PREFIX + i;
        }
        setArgs({
            ...args,
            column_headings: newHeadings,
        });
    }

    setCustomizeColumnHeadings(!checked);
}

export function updateDimensions(
    setArgs: Dispatch<SetStateAction<LhcArgs>>,
    args: LhcArgs,
    value: number
) {
    let newColumnHeadings = args.column_headings!;
    let newRandom = args.random!;
    let newScales: Record<number, LhcScale> = {};

    if (value < newColumnHeadings.length) {
        newColumnHeadings = newColumnHeadings.slice(0, value);
        if (typeof newRandom[0] === "number") {
            newRandom = (newRandom as number[]).filter((x) => x < value);
        }
        Object.keys(args.scales!).map((dim) => {
            if (Number(dim) < value) {
                newScales[Number(dim)] = args.scales![Number(dim)];
            }
        });
    } else {
        for (let i = newColumnHeadings.length; i < value; i++) {
            newColumnHeadings.push(DEFAULT_DIMENSION_PREFIX + i);
            newScales = args.scales!;
            newScales[i] = {
                lower: args.base_scale?.lower ?? 0,
                upper: args.base_scale?.upper ?? args.number,
            };
        }
    }

    setArgs({
        ...args,
        dimensions: value,
        column_headings: newColumnHeadings,
        random: newRandom,
        scales: newScales,
    });
}

export function toggleCustomizeScales(
    setCustomizeScales: Dispatch<SetStateAction<boolean>>,
    checked: boolean,
    args: LhcArgs,
    setArgs: Dispatch<SetStateAction<LhcArgs>>
) {
    setCustomizeScales(!checked);

    if (checked) {
        let newScales: Record<number, LhcScale> = {};
        for (let i = 0; i < args.dimensions; i++) {
            newScales[i] = {
                lower: args.base_scale?.lower ?? 0,
                upper: args.base_scale?.upper ?? args.number,
            };
        }
        setArgs({ ...args, scales: newScales });
    }
}
