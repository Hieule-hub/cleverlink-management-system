"use client";

import { Theme, ThemeOptions, createTheme } from "@mui/material/styles";
import { RoleCode } from "common";

export const colorsFormControl = {
    //border color
    borderColor: "#d0d5dd",
    borderHoverColor: "#667085",
    borderFocusColor: "#0074ff",
    borderRadius: "0.5rem",
    //background color
    backgroundColor: "#fff",

    //text color
    color: "#667085",
    //font size
    fontSize: "1rem"
};

export type Themes = {
    [key in RoleCode]: Theme;
};

export const theme: ThemeOptions = {
    typography: {
        dashboardTitleCard: {
            fontSize: "1rem",
            fontWeight: "bold"
        },
        userName: {
            color: "var(--palette-primary-main)",
            fontSize: "0.8rem",
            fontWeight: 500,
            marginLeft: "0.5rem"
        },
        body2: {
            color: "red"
        },
        body3: {
            fontSize: "0.875rem",
            color: "darkgray",
            lineHeight: "1.875rem"
        },
        body4: {
            fontSize: "1.2rem"
        },
        fontFamily: ["var(--font-poppins)", "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(",")
    },
    components: {
        MuiSelect: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        ".MuiSelect-select": {
                            borderColor: "var(--input-border-active-color)"
                        }
                    },
                    "& .MuiSelect-select": {
                        transition: "all 0.3s ease",
                        border: "1px solid var(--input-border-color)",
                        color: "var(--input-color)",
                        borderRadius: "var(--input-border-radius) !important",
                        boxSizing: "border-box",
                        height: "var(--input-height) !important",
                        padding: "11px 12px"
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "transparent !important"
                    }
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                root: {
                    "& .MuiDialog-paper": {
                        borderRadius: "var(--input-border-radius)",
                        boxShadow: "var(--dialog-box-shadow)"
                    }
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        height: "var(--input-height)",
                        borderRadius: "var(--input-border-radius)",
                        fieldset: {
                            transition: "all 0.2s ease-in-out",
                            borderColor: "var(--input-border-color)"
                        },
                        input: {
                            color: "var(--input-color)",
                            fontSize: "var(--input-font-size)",
                            padding: "var(--input-padding)"
                        },

                        "&:hover fieldset": {
                            borderColor: (props) => (props.disabled ? "transparent" : "var(--input-border-hover-color)")
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "var(--input-border-active-color)",
                            borderWidth: 1
                        },
                        "&.Mui-disabled fieldset": {
                            backgroundColor: "var(--bg-container-disabled)"
                        }
                    }
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    "& .MuiInputLabel-root": {
                        display: "none"
                    },
                    "& .MuiAutocomplete-inputRoot": {
                        legend: {
                            display: "none"
                        }
                    }
                }
            }
        }
    }
};

const getTheme = (themeOptions: ThemeOptions) => {
    return createTheme({
        cssVariables: {
            cssVarPrefix: ""
        },
        ...theme,
        ...themeOptions
    });
};

export const userThemes: Themes = {
    CIP: getTheme({
        palette: {
            primary: {
                main: "#0074FF",
                dark: "#193F72"
            }
        }
    }),
    TU: getTheme({
        palette: {
            primary: {
                main: "#FFC821",
                dark: "#595549"
            }
        }
    }),
    BU: getTheme({
        palette: {
            primary: {
                main: "#30B689",
                dark: "#51635D"
            }
        }
    }),
    GU: getTheme({
        palette: {
            primary: {
                main: "#FF6C00"
            }
        }
    })
};
