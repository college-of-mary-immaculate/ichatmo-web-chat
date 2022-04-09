/** @type {import('next').NextConfig} */
// const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
  // sassOptions: {
  //   includePaths: [path.join(__dirname, "styles")],
  //   prependData: `@use "_mixins.scss";`,
  // },
};

module.exports = nextConfig;
