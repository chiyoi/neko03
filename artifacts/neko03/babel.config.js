module.exports = function (api) {
  api.cache(true)

  const plugins = [
    "@babel/plugin-proposal-export-namespace-from",
    "react-native-reanimated/plugin",
    require.resolve("expo-router/babel"),
    ["@tamagui/babel-plugin", {
      components: ["tamagui"],
      config: "./tamagui.config.ts",
      logTimings: true,
    }],
    ["transform-inline-environment-variables", {
      "include": ["TAMAGUI_TARGET", "ENDPOINT_NACHO", "VERSION"],
    }],
    ["babel-plugin-module-resolver", {
      "alias": {
        ".modules": "./modules",
      },
    }],
  ]

  return {
    presets: ['babel-preset-expo'],
    plugins,
  }
}
