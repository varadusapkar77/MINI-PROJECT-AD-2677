import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../constants/theme";
import { APP_NAME } from "../config/appConfig";

export default function AuthHeader({ subtitle }: { subtitle: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>V</Text>
      </View>
      <Text style={styles.brand}>{APP_NAME}</Text>
      <Text style={styles.sub}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", marginBottom: 28 },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: theme.gold, fontSize: 42, fontWeight: "bold" },
  brand: { color: theme.text, fontSize: 30, fontWeight: "bold", marginTop: 12, letterSpacing: 2 },
  sub: { color: theme.muted, marginTop: 6 },
});