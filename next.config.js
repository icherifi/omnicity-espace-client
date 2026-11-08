const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
    throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL is not set: define the variables listed in .env.example " +
        "(in .env.local locally, or in the Vercel project settings)."
    );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [new URL(supabaseUrl).hostname],
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
