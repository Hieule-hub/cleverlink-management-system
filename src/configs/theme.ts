"use client";

import { ThemeOptions } from "@mui/material/styles";

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

export const theme: ThemeOptions = {
    typography: {
        dashboardTitleCard: {
            fontSize: "1rem",
            fontWeight: "bold"
        },
        aiTitleCard: {
            fontSize: "1.25rem",
            fontWeight: "bold"
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
        // MuiDrawer: {
        // 	styleOverrides: {
        // 		paper: {
        // 			backgroundColor: '#040849',
        // 			color: 'white',
        // 		},
        // 	},
        // },
    }
};
