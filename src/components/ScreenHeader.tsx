import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

export default function ScreenHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  back: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.card,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backText: { color: theme.gold, fontSize: 26, marginTop: -3 },
  title: { color: theme.text, fontSize: 22, fontWeight: "bold" },
});