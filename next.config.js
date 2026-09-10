/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                    { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
                ],
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: "/project/:path*",
                destination: "/",
            },
            {
                source: "/assistance",
                destination: "/",
            },
            {
                source: "/settings",
                destination: "/",
            },
        ];
    },
};

module.exports = nextConfig;
