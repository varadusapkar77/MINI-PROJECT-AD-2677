import React from "react";
import { View, Text, TextInput, TextInputProps, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

export default function AppInput({ label, ...props }: TextInputProps & { label?: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput {...props} placeholderTextColor={theme.muted} style={[styles.input, props.style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: theme.muted, marginBottom: 6, fontSize: 13 },
  input: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 14,
    color: theme.text,
    fontSize: 15,
  },
});