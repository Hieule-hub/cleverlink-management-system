import { AiIcon } from "@components/Icon";
import {
    Cloud,
    Dashboard as DashboardIcon,
    FilePresentRounded,
    MonitorOutlined,
    Settings,
    SmartToy,
    SvgIconComponent
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
        icon: DashboardIcon
    },
    {
        path: "/company",
        key: "company",
        label: "Company",
        private: false,
        icon: MonitorOutlined
    },
    {
        path: "/scene",
        key: "scene",
        label: "Scene",
        private: false,
        icon: FilePresentRounded
    },
    {
        path: "/user",
        key: "user",
        label: "User",
        private: false,
        icon: AiIcon
    },
    {
        path: "/device",
        key: "device",
        label: "Device",
        private: false,
        icon: SmartToy
    },
    {
        path: "/camera",
        key: "camera",
        label: "Camera",
        private: false,
        icon: Cloud
    },
    {
        path: "/event",
        key: "event",
        label: "Event",
        private: false,
        icon: Settings
    }
];
