import "@mui/material/Typography";
import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface TypographyVariants {
        dashboardTitleCard: React.CSSProperties;
        aiTitleCard: React.CSSProperties;
        body3: React.CSSProperties;
        body4: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        dashboardTitleCard?: React.CSSProperties;
        aiTitleCard?: React.CSSProperties;
        body3?: React.CSSProperties;
        body4?: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        dashboardTitleCard: true;
        aiTitleCard: true;
        body3: true;
        body4: true;
    }
}
