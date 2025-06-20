"use client";

import { ChangeEvent, JSX } from "react";
import { SMALLEST_INCREMENT } from "../../constants";
import { LhcArgs, LhcScale } from "../../types/lhcArgs";

export function LhcScaleInput(props: {
    name: string;
    args: LhcArgs;
    requiredCondition: boolean;
    value: LhcScale;
    onChange: {
        lower: (e: ChangeEvent<HTMLInputElement>) => void;
        upper: (e: ChangeEvent<HTMLInputElement>) => void;
    };
    className?: string;
}): JSX.Element {
    console.log(props);
    return (
        <span
            className={props.className ?? ""}
            style={{
                display: "inline-flex",
                alignItems: "center",
            }}
        >
            (
            <input
                type="number"
                name={props.name}
                id={props.name + "-lower"}
                max={Number.MAX_VALUE}
                value={props.value.lower}
                required={props.requiredCondition}
                step={SMALLEST_INCREMENT}
                onChange={props.onChange.lower}
                disabled={!props.requiredCondition}
            />
            :
            <input
                type="number"
                name={props.name}
                id={props.name + "-upper"}
                max={Number.MAX_VALUE}
                value={props.value.upper}
                step={SMALLEST_INCREMENT}
                required={props.requiredCondition}
                onChange={props.onChange.upper}
                disabled={!props.requiredCondition}
            />
            )
        </span>
    );
}
