export const port = process.env.PORT || 3000;
export const host = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `http://localhost:${port}`;

export const poeOptions = [
    {
        value: 0,
        name: "Common.No"
    },
    {
        value: 1,
        name: "Common.Yes"
    }
];

export const cameraResolutionOptions = [
    {
        category: "Resolution.Low",
        value: "low",
        options: [
            { name: "Resolution.320x240", value: "320x240" },
            { name: "Resolution.640x480", value: "640x480" }
        ]
    },
    {
        category: "Resolution.Standard",
        value: "standard",
        options: [
            { name: "Resolution.800x600", value: "800x600" },
            { name: "Resolution.1024x768", value: "1024x768" },
            { name: "Resolution.1280x720", value: "1280x720" }
        ]
    },
    {
        category: "Resolution.High",
        value: "high",
        options: [
            { name: "Resolution.1280x1024", value: "1280x1024" },
            { name: "Resolution.1600x1200", value: "1600x1200" },
            { name: "Resolution.1920x1080", value: "1920x1080" }
        ]
    },
    {
        category: "Resolution.Ultra",
        value: "ultra",
        options: [
            { name: "Resolution.2560x1440", value: "2560x1440" },
            { name: "Resolution.3840x2160", value: "3840x2160" }
        ]
    },
    {
        category: "Resolution.Professional",
        options: [
            { name: "Resolution.5120x2880", value: "5120x2880" },
            { name: "Resolution.7680x4320", value: "7680x4320" }
        ]
    }
];

export const cameraVoltageOptions = [
    {
        category: "Voltage.Low",
        value: "low",
        options: [
            { name: "Voltage.5V", value: "5V" },
            { name: "Voltage.9V", value: "9V" }
        ]
    },
    {
        category: "Voltage.Standard",
        value: "standard",
        options: [
            { name: "Voltage.12V", value: "12V" },
            { name: "Voltage.24V", value: "24V" }
        ]
    },
    {
        category: "Voltage.High",
        value: "high",
        options: [
            { name: "Voltage.48V", value: "48V" },
            { name: "Voltage.220V", value: "220V" }
        ]
    }
];
