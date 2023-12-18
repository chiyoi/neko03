module.exports = (phase, { defaultConfig }) => {
  /** @type {import('next').NextConfig} */
  const config = {
    ...defaultConfig,
    output: 'export',
    images: {
      loader: 'custom',
      loaderFile: './imageLoader.js',
    },
  }
  return config
}
