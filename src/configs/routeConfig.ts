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
}

export const routeConfig: RouteConfig[] = [
    {
        path: "/dashboard",
        key: "dashboard",
        label: "Dashboard",
        private: false,
        icon: DashboardSharp
    },
    {
        path: "/company",
        key: "company",
        label: "Company",
        private: false,
        icon: BusinessSharp
    },
    {
        path: "/scene",
        key: "scene",
        label: "Scene",
        private: false,
        icon: MapSharp
    },
    {
        path: "/user",
        key: "user",
        label: "User",
        private: false,
        icon: GroupSharp
    },
    {
        path: "/device",
        key: "device",
        label: "Device",
        private: false,
        icon: ConstructionSharp
    },
    {
        path: "/camera",
        key: "camera",
        label: "Camera",
        private: false,
        icon: VideocamSharp
    },
    {
        path: "/event",
        key: "event",
        label: "Event",
        private: false,
        icon: BugReportSharp
    }
];
