import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const API_URL = process.env.API_URL;

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${API_URL}/:path*`
            }
        ];
    }
};

const withNextIntl = createNextIntlPlugin("./src/libs/i18n/request.ts");

export default withNextIntl(nextConfig);
