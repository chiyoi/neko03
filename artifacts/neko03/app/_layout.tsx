import React, { useCallback, useMemo, useRef, useState } from "react"
import { useColorScheme } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useFonts } from "expo-font"
import { useFonts as useHachiMaruPopFonts, HachiMaruPop_400Regular } from "@expo-google-fonts/hachi-maru-pop"

import { TamaguiProvider, Theme } from "tamagui"
import { tokens } from "@tamagui/themes"

import tamaguiConfig from "../tamagui.config"
import { IDString, ToastContext } from "../modules/toast"
import { QuickToast } from ".modules/components/QuickToast"

export default function Layout() {
  const [interLoaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  })
  const [hachiMaruPopLoaded] = useHachiMaruPopFonts({ HachiMaruPop_400Regular })

  const toastsState = useState<IDString[]>([])
  const [, setToasts] = toastsState
  const toastCount = useRef(0)
  const setToast = useCallback((toast: string) => setToasts(toasts => [...toasts, { str: toast, id: toastCount.current++ }]), [])

  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  if (!interLoaded || !hachiMaruPopLoaded) {
    return null
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ToastContext.Provider value={setToast}>
        <Theme name={isDark ? "dark" : "light"}>
          <Theme name="pink">
            <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? tokens.color.pink2Dark.val : tokens.color.pink2Light.val }}>
              <Stack screenOptions={{
                headerShown: false,
              }} />

              <StatusBar style="auto" />

              <QuickToast toastsState={toastsState} />
            </SafeAreaView>
          </Theme>
        </Theme>
      </ToastContext.Provider >
    </TamaguiProvider>
  )
}
