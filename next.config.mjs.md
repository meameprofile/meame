/\*_ @type {import('next').NextConfig} _/
const nextConfig = {
images: {
remotePatterns: [
{
protocol: "https",
hostname: "i.pravatar.cc",
},
{
protocol: "https",
hostname: "images.unsplash.com",
},
{
protocol: "https",
hostname: "github.com",
},
],
},
};

export default nextConfig;
