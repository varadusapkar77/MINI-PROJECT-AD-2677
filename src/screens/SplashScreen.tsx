import React, { useEffect, useRef } from "react";
import { View, Text, Animated, ActivityIndicator, StyleSheet } from "react-native";
import { theme } from "../constants/theme";
import { APP_NAME } from "../config/appConfig";

export default function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ alignItems: "center", opacity: fade, transform: [{ scale }] }}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>V</Text>
        </View>
        <Text style={styles.name}>{APP_NAME}</Text>
        <Text style={styles.tag}>PREMIUM SHOPPING, MADE SIMPLE</Text>
      </Animated.View>
      <ActivityIndicator color={theme.gold} style={{ marginTop: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, justifyContent: "center", alignItems: "center" },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: theme.gold, fontSize: 70, fontWeight: "bold" },
  name: { color: theme.text, fontSize: 40, fontWeight: "bold", letterSpacing: 4, marginTop: 20 },
  tag: { color: theme.gold, fontSize: 12, letterSpacing: 2, marginTop: 8 },
});