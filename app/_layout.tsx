import React, { useMemo } from "react"
import { KeyboardAvoidingView, useColorScheme } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useFonts } from "expo-font"
import { useFonts as useHachiMaruPopFonts, HachiMaruPop_400Regular } from "@expo-google-fonts/hachi-maru-pop"

import { TamaguiProvider, Theme } from "tamagui"
import { tokens } from "@tamagui/themes"

import config from "../tamagui.config"

export default function Layout() {
  const [interLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  })
  const [hachiMaruPopLoaded] = useHachiMaruPopFonts({ HachiMaruPop_400Regular })

  const colorScheme = useColorScheme()
  const isDark = useMemo(() => colorScheme === "dark", [colorScheme])

  if (!interLoaded || !hachiMaruPopLoaded) {
    return null
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={isDark ? "dark" : "light"}>
        <Theme name="pink">
          <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? tokens.color.pink2Dark.val : tokens.color.pink2Light.val }}>
            <Stack screenOptions={{
              headerShown: false,
            }} />
            <StatusBar style="auto" />
          </SafeAreaView>
        </Theme>
      </Theme>
    </TamaguiProvider>
  )
}
