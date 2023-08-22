const { withTamagui } = require("@tamagui/next-plugin")

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = function (name, { defaultConfig }) {
  const config = {
    ...defaultConfig,
    ...nextConfig,
  }

  const tamaguiPlugin = withTamagui({
    config: './tamagui.config.ts',
    components: ['tamagui'],
    // build-time generate CSS styles for better performance
    // we recommend only using this for production so you get reloading during dev mode
    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
  })

  return {
    ...config,
    ...tamaguiPlugin(config),
  }
}
