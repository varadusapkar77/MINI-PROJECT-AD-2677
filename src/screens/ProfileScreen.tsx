import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { theme } from "../constants/theme";
import { Nav } from "../navigation/types";
import { useApp } from "../context/AppContext";
import Screen from "../components/Screen";
import ScreenHeader from "../components/ScreenHeader";
import AppButton from "../components/AppButton";

export default function ProfileScreen({ nav }: { nav: Nav }) {
  const { favorites, cartCount } = useApp(); // also re-renders after the name is updated
  const user = auth.currentUser;
  const name = user?.displayName || "Vmart User";

  const Row = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.menu} onPress={onPress}>
      <Text style={styles.menuText}>{icon}  {label}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <ScreenHeader title="Profile" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.top}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{cartCount}</Text>
            <Text style={styles.statLabel}>In cart</Text>
          </View>
        </View>

        <Row icon="❤️" label="My Favorites" onPress={() => nav.go("Favorites")} />
        <Row icon="🛒" label="My Cart" onPress={() => nav.go("Cart")} />
        <Row icon="➕" label="Add Product" onPress={() => nav.go("AddProduct")} />

        <Text style={styles.uid}>User ID: {user?.uid}</Text>
        <AppButton title="LOGOUT" variant="danger" onPress={() => signOut(auth)} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#111", fontSize: 40, fontWeight: "bold" },
  name: { color: theme.text, fontSize: 22, fontWeight: "bold", marginTop: 10 },
  email: { color: theme.muted, marginTop: 2 },
  stats: { flexDirection: "row", marginBottom: 20 },
  stat: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: theme.border,
  },
  statNum: { color: theme.gold, fontSize: 24, fontWeight: "bold" },
  statLabel: { color: theme.muted, marginTop: 2 },
  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  menuText: { color: theme.text, fontSize: 16 },
  arrow: { color: theme.gold, fontSize: 22 },
  uid: { color: theme.muted, fontSize: 11, textAlign: "center", marginVertical: 16 },
});