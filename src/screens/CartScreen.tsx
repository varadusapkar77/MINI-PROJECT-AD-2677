import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../constants/theme";
import { SHIPPING } from "../config/appConfig";
import { Nav } from "../navigation/types";
import { useApp } from "../context/AppContext";
import { formatPrice } from "../utils/format";
import Screen from "../components/Screen";
import ScreenHeader from "../components/ScreenHeader";
import AppButton from "../components/AppButton";

export default function CartScreen({ nav }: { nav: Nav }) {
  const { cart, changeQty, removeFromCart, cartTotal } = useApp();
  const shipping = cart.length ? SHIPPING : 0;

  return (
    <Screen>
      <ScreenHeader title="My Cart" />
      <FlatList
        data={cart}
        keyExtractor={(i) => String(i.product.id)}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty 🛒</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.thumbBox}>
              {item.product.thumbnail ? (
                <Image source={{ uri: item.product.thumbnail }} style={styles.thumb} resizeMode="contain" />
              ) : (
                <Text style={{ fontSize: 26 }}>🛍️</Text>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.title} numberOfLines={1}>{item.product.title}</Text>
              <Text style={styles.price}>{formatPrice(item.product.price * item.qty)}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.product.id, -1)}>
                  <Text style={styles.qtyText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.product.id, 1)}>
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
              <Text style={{ fontSize: 20 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {cart.length > 0 ? (
        <View style={styles.summary}>
          <View style={styles.sumRow}>
            <Text style={styles.muted}>Subtotal</Text>
            <Text style={styles.sumText}>{formatPrice(cartTotal)}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.muted}>Shipping</Text>
            <Text style={styles.sumText}>{formatPrice(shipping)}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>{formatPrice(cartTotal + shipping)}</Text>
          </View>
          <AppButton title="PROCEED TO CHECKOUT" onPress={() => nav.go("Checkout")} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { color: theme.muted, textAlign: "center", marginTop: 60, fontSize: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  thumbBox: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#242430",
    justifyContent: "center",
    alignItems: "center",
  },
  thumb: { width: "100%", height: "100%" },
  title: { color: theme.text, fontWeight: "600" },
  price: { color: theme.gold, fontWeight: "bold", marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: { color: theme.gold, fontSize: 18, marginTop: -2 },
  qty: { color: theme.text, marginHorizontal: 12, fontSize: 16 },
  summary: { padding: 16, borderTopWidth: 1, borderColor: theme.border, backgroundColor: theme.card },
  sumRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  muted: { color: theme.muted },
  sumText: { color: theme.text },
  totalLabel: { color: theme.text, fontSize: 18, fontWeight: "bold" },
  total: { color: theme.gold, fontSize: 20, fontWeight: "bold" },
});