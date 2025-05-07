/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8888/gestion-bourse-condidature-service/api/:path*' // Proxy vers votre API
            },
        ];
    },
};

export default nextConfig;