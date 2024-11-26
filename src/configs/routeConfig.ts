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
        label: "Company Management",
        private: false,
        icon: MonitorOutlined
    },
    {
        path: "/scene",
        key: "scene",
        label: "Scene Management",
        private: false,
        icon: FilePresentRounded
    },
    {
        path: "/user",
        key: "user",
        label: "User Management",
        private: false,
        icon: AiIcon
    },
    {
        path: "/device",
        key: "device",
        label: "Device Management",
        private: false,
        icon: SmartToy
    },
    {
        path: "/camera",
        key: "camera",
        label: "Camera Management",
        private: false,
        icon: Cloud
    },
    {
        path: "/event",
        key: "event",
        label: "Event Management",
        private: false,
        icon: Settings
    }

    // {
    // 	path: '/fullscreen',
    // 	key: 'fullscreen',
    // 	label: 'Fullscreen',
    // 	private: false,
    // 	icon: Fullscreen,
    // },
    // {
    // 	path: '/output/snapshot-quality',
    // 	key: 'output-snapshot-quality',
    // 	label: 'Snapshot-quality',
    // 	private: false,
    // 	icon: ScreenshotMonitor,
    // },
    // {
    //     path: "/network/ip-settings",
    // label: '',
    //     private:false
    // },
    // {
    //     path: "/network/ip-filter",
    // label: '',
    //     private:false
    // },
];
