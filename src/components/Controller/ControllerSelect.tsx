import { Select, type SelectProps } from "@components/Select";
import { type Control, Controller as ControllerRHF } from "react-hook-form";

import { useAppStore } from "@/providers/AppStoreProvider";

interface ControllerProps {
    keyName?: string;
    placeholder?: string;
    selectProps?: SelectProps;
    control: Control<any>;
}

export const ControllerSelect = ({ keyName, control, placeholder, selectProps }: ControllerProps) => {
    return (
        <ControllerRHF
            control={control}
            name={keyName}
            render={({ field }) => (
                <Select {...field} id={keyName} placeholder={placeholder} fullWidth {...selectProps} />
            )}
        />
    );
};

export const ControllerOrganizationSelect = ({ keyName, control, placeholder, selectProps }: ControllerProps) => {
    const { organizations } = useAppStore((state) => state);

    return (
        <ControllerRHF
            control={control}
            name={keyName}
            render={({ field }) => (
                <Select
                    {...field}
                    id={keyName}
                    placeholder={placeholder}
                    fullWidth
                    options={organizations.map((org) => ({
                        value: org.code,
                        label: org.name
                    }))}
                    {...selectProps}
                />
            )}
        />
    );
};
