// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    webpack: (config) => {
      config.externals.push({
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
        canvas: "commonjs canvas",
      });
      // config.infrastructureLogging = { debug: /PackFileCache/ };
      return config;
    },


    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'utfs.io'
        }
      ]
    }
  }
   
  module.exports = nextConfig
