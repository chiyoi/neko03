module.exports = (phase, { defaultConfig }) => {
  /** @type {import('next').NextConfig} */
  const config = {
    ...defaultConfig,
    output: 'export',
    images: {
      loader: 'custom',
      loaderFile: './modules/imageLoader.js',
    },
  }
  return config
}
