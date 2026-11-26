import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../constants/theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "gold" | "outline" | "danger";
  loading?: boolean;
  style?: ViewStyle;
};

export default function AppButton({ title, onPress, variant = "gold", loading, style }: Props) {
  const bg = variant === "gold" ? theme.gold : variant === "danger" ? theme.danger : "transparent";
  const color = variant === "gold" ? "#111" : variant === "outline" ? theme.gold : "#fff";
  const border = variant === "outline" ? theme.gold : bg;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={loading}
      onPress={onPress}
      style={[styles.btn, { backgroundColor: bg, borderColor: border }, style]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <Text style={[styles.text, { color }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    marginTop: 8,
  },
  text: { fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});