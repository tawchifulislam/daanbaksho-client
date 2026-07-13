/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'i.ibb.co',
//       },
//       {
//         protocol: 'https',
//         hostname: 'lh3.googleusercontent.com', // Google profile pictures
//       },
//     ],
//   },
// };

// export default nextConfig;
