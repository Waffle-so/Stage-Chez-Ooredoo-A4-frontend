import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_REACT_APP_DOMAIN || 'localhost'], // Default to 'localhost' if the env variable is not set
  },
};

export default withNextVideo(nextConfig);