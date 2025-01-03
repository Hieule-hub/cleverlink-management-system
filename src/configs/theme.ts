"use client";

import { Theme, ThemeOptions, createTheme } from "@mui/material/styles";
import { RoleCode } from "common";

export type Themes = {
    [key in RoleCode]: Theme;
};

export const theme: ThemeOptions = {
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            xxl: 1920
        }
    },
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
    shape: {
        borderRadius: 8
    },
    components: {
        MuiSelect: {
            styleOverrides: {
                root: {
                    fieldset: {
                        transition: "all 0.3s ease",
                        borderColor: "var(--input-border-color)"
                    },

                    "&:hover": {
                        ".MuiSelect-select": {
                            borderColor: "var(--input-border-active-color)"
                        }
                    },

                    "& .MuiSelect-select": {
                        color: "var(--input-color)",
                        boxSizing: "border-box",
                        padding: "14px 12px"
                    },

                    "&.Mui-disabled": {
                        backgroundColor: "var(--bg-container-disabled)",
                        "& .MuiSelect-select": {
                            borderColor: "var(--palette-action-disabled)"
                        }
                    },

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--input-border-active-color)",
                        borderWidth: 1
                    }
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                root: {
                    "& .MuiDialog-paper": {
                        boxShadow: "var(--dialog-box-shadow)"
                    }
                }
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginLeft: 0
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        // height: "var(--input-height)",
                        fieldset: {
                            transition: "all 0.2s ease-in-out",
                            borderColor: "var(--input-border-color)"
                        },
                        input: {
                            WebkitBoxShadow: "0px 2px 4px white",
                            WebkitTextFillColor: "var(--input-color)",
                            caretColor: "var(--input-color)",
                            color: "var(--input-color)",
                            fontSize: "var(--input-font-size)",
                            padding: "var(--input-padding)"
                        },

                        "&.Mui-disabled": {
                            input: {
                                color: "var(--palette-text-disabled)",
                                WebkitTextFillColor: "var(--palette-text-disabled)"
                            }
                        },

                        "&:not(&.Mui-disabled):not(&.Mui-error)": {
                            "&:hover fieldset": {
                                borderColor: "var(--input-border-hover-color)"
                            }
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
                    },
                    "& .MuiInputBase-root": {
                        padding: 0,
                        fieldset: {
                            transition: "all 0.2s ease-in-out",
                            borderColor: "var(--input-border-color)",
                            top: 0
                        },
                        "& .MuiAutocomplete-input": {
                            color: "var(--input-color)",
                            fontSize: "var(--input-font-size)",
                            padding: "var(--input-padding)"
                        }
                    }
                }
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: "var(--input-color)",
                    "&.Mui-checked": {
                        color: "var(--input-checked-bg-color)"
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
                dark: "#51635D",
                contrastText: "#fff"
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
