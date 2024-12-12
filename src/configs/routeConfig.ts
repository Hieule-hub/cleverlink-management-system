import {
    BugReportSharp,
    BusinessSharp,
    ConstructionSharp,
    DashboardSharp,
    GroupSharp,
    MapSharp,
    SvgIconComponent,
    VideocamSharp
} from "@mui/icons-material";

export interface RouteConfig {
    type?: string;
    path?: string;
    private?: boolean;
    icon?: SvgIconComponent;
    label?: string;
    children?: RouteConfig[];
    hidden?: boolean;
    onClick?: () => void;
    key: string;
    roles?: string[];
}

export const routeConfig: RouteConfig[] = [
    {
        path: "/dashboard",
        key: "dashboard",
        label: "Dashboard",
        private: false,
        icon: DashboardSharp,
        roles: ["CIP", "TU", "BU", "GU"]
    },
    {
        path: "/company",
        key: "company",
        label: "Company",
        private: false,
        icon: BusinessSharp,
        roles: ["CIP", "TU"]
    },
    {
        path: "/scene",
        key: "scene",
        label: "Scene",
        private: false,
        icon: MapSharp,
        roles: ["CIP", "TU", "BU"]
    },
    {
        path: "/user",
        key: "user",
        label: "User",
        private: false,
        icon: GroupSharp,
        roles: ["CIP", "TU", "BU"]
    },
    {
        path: "/device",
        key: "device",
        label: "Device",
        private: false,
        icon: ConstructionSharp,
        roles: ["CIP", "TU", "BU"]
    },
    {
        path: "/camera",
        key: "camera",
        label: "Camera",
        private: false,
        icon: VideocamSharp,
        roles: ["CIP", "TU", "BU"]
    },
    {
        path: "/event",
        key: "event",
        label: "Event",
        private: false,
        icon: BugReportSharp,
        roles: ["CIP", "TU", "BU"]
    }
];
