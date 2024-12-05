import React, { useCallback, useEffect, useMemo, useState } from "react";

import { CircularProgress, TextField } from "@mui/material";
import Autocomplete, { AutocompleteRenderOptionState } from "@mui/material/Autocomplete";
import { debounce } from "@mui/material/utils";
import { type Control, Controller as ControllerRHF } from "react-hook-form";

interface ControllerProps {
    keyName?: string;
    placeholder?: string;
    control: Control<any>;
    disabled?: boolean;
    request?: (query?: string) => Promise<Option[]>;
    onchangeField?: (value?: Option) => void;
    renderOption?: (
        props: React.HTMLAttributes<HTMLLIElement>,
        option: Option,
        state: AutocompleteRenderOptionState
    ) => React.ReactNode;
}

export interface Option {
    label: string;
    value: string | number;
    id?: string | number;
}

export const ControllerAsyncSearchSelect = ({
    keyName,
    control,
    placeholder,
    disabled,
    request = () => Promise.resolve([]),
    onchangeField = () => "",
    renderOption = (props, option) => {
        return (
            <li {...props} key={option.value}>
                {option.label}
            </li>
        );
    }
}: ControllerProps) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOptions("");
    }, []);

    const fetchOptions = useCallback(async (query: string) => {
        setLoading(true);

        try {
            const options = await request(query);

            setOptions(options);
        } catch (error) {
            console.log("🚀 ~ fetchOptions ~ error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Memoize the debounced fetch function
    const debouncedFetch = useMemo(() => debounce(fetchOptions, 500), [fetchOptions]);

    const handleSearchInput = useCallback(
        (_: React.SyntheticEvent, value: string) => {
            debouncedFetch(value || "");
            // if (value) {
            // } else {
            //     setOptions([]);
            // }
        },
        [debouncedFetch]
    );

    return (
        <ControllerRHF
            control={control}
            name={keyName}
            render={({ field }) => {
                const { onChange, value, ref, onBlur } = field;

                return (
                    <Autocomplete
                        disabled={disabled}
                        onBlur={onBlur}
                        id={keyName}
                        onChange={(_, newValue) => {
                            onChange(newValue ? newValue : null);
                            onchangeField(newValue);
                        }}
                        value={value ? (options.find((o) => o.value === field.value) ?? value) : null}
                        options={options}
                        loading={loading}
                        getOptionLabel={(option) => {
                            return option?.label || "";
                        }}
                        onInputChange={handleSearchInput}
                        renderOption={renderOption}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputRef={ref}
                                placeholder={placeholder}
                                slotProps={{
                                    input: {
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        )
                                    }
                                }}
                            />
                        )}
                    />
                );
            }}
        />
    );
};
