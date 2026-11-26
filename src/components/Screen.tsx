import React, { ReactNode } from "react";
import { SafeAreaView, Platform, StatusBar } from "react-native";
import { theme } from "../constants/theme";

export default function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.bg,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
      }}
    >
      {children}
    </SafeAreaView>
  );
}