export type LhcScale = { lower: number; upper: number };

export type LhcArgs = {
    //  -n, --number arg           Required. Number of points (default: 1000)
    number: number;
    //  -d, --dimensions arg       Required. Number of dimensions (default: 1)
    dimensions: number;
    //   -r, --random arg           Optional. Select randomness: 'false' = none,
    //                              'true' = all, or a comma-separated list of
    //                              dimension indices (default: false)
    random?: "true" | "false" | number[];
    //  -b, --base-scale arg       Optional. Default scale for all dimensions in
    //                             the form lower:upper (default: 0:1)
    base_scale?: LhcScale;
    //  -s, --scales arg           Optional. Comma-separated
    //                             dimension:lower:upper overrides
    scales?: Record<number, LhcScale>;
    //  -c, --column-headings arg  Optional. Column names for CSV output (only
    //                             alphanumeric and underscore characters)
    column_headings?: string[];
};
