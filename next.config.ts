const nextConfig: import("next").NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kdkaolvfpgoxgydcdqor.supabase.co",
        pathname: "/storage/v1/object/public/images/**",
      },
    ],
  },
}

module.exports = nextConfig
