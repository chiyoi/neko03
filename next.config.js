const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  /** @type {import('next').NextConfig} */
  const config = {
    ...defaultConfig,
    images: {
      loader: 'custom',
      loaderFile: './modules/imageLoader.js',
    },
  }

  return phase === PHASE_DEVELOPMENT_SERVER ? {
    ...config,
    async rewrites() {
      return [
        {
          source: '/assets/:path*',
          destination: 'http://neko03.moe/assets/:path*',
        },
        {
          source: '/favicon.ico',
          destination: 'http://neko03.moe/favicon.ico',
        },
      ]
    },
  } : {
    ...config,
    output: 'export',
  }
}
