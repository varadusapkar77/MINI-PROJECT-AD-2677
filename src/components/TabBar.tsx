import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

const ITEMS = [
  ["Home", "🏠"],
  ["Favorites", "❤️"],
  ["Cart", "🛒"],
  ["Profile", "👤"],
] as const;

type Props = { tab: string; onChange: (t: string) => void; cartCount: number };

export default function TabBar({ tab, onChange, cartCount }: Props) {
  return (
    <View style={styles.bar}>
      {ITEMS.map(([key, icon]) => (
        <TouchableOpacity key={key} style={styles.item} onPress={() => onChange(key)}>
          <View>
            <Text style={[styles.icon, { opacity: tab === key ? 1 : 0.5 }]}>{icon}</Text>
            {key === "Cart" && cartCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            ) : null}
          </View>
          <Text style={[styles.label, tab === key && styles.active]}>{key}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderColor: theme.border,
    paddingTop: 8,
    paddingBottom: 10,
  },
  item: { flex: 1, alignItems: "center" },
  icon: { fontSize: 22 },
  label: { fontSize: 11, color: theme.muted, marginTop: 2 },
  active: { color: theme.gold, fontWeight: "bold" },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: theme.gold,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#111", fontSize: 11, fontWeight: "bold" },
});