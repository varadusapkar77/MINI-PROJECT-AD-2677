import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../config/firebase";
import { theme } from "../constants/theme";
import { SHIPPING } from "../config/appConfig";
import { Nav } from "../navigation/types";
import { useApp } from "../context/AppContext";
import { showMessage } from "../utils/message";
import { formatPrice } from "../utils/format";
import { saveOrder } from "../services/orders";
import Screen from "../components/Screen";
import ScreenHeader from "../components/ScreenHeader";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";

const METHODS = ["Cash on Delivery", "UPI", "Card"];

export default function CheckoutScreen({ nav }: { nav: Nav }) {
  const { cart, cartTotal, clearCart } = useApp();
  const [name, setName] = useState(auth.currentUser?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState(METHODS[0]);
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState<{ id: string; total: number } | null>(null);

  const total = cartTotal + SHIPPING;

  const placeOrder = async () => {
    if (!name || !phone || !address) return showMessage("Error", "Please fill all fields");
    try {
      setLoading(true);
      const orderId = await saveOrder(cart, total, address, phone, method);
      setPlaced({ id: orderId.slice(0, 8).toUpperCase(), total });
      clearCart();
    } catch (e: any) {
      showMessage("Error", "Could not save order: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <Screen>
        <View style={styles.success}>
          <Text style={{ fontSize: 80 }}>✅</Text>
          <Text style={styles.sTitle}>Order Placed!</Text>
          <Text style={styles.sText}>Order ID: {placed.id}</Text>
          <Text style={styles.sText}>Amount: {formatPrice(placed.total)}</Text>
          <Text style={styles.sText}>Payment: {method}</Text>
          <View style={{ width: "100%", marginTop: 24 }}>
            <AppButton title="CONTINUE SHOPPING" onPress={() => nav.go("Home")} />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Checkout" onBack={nav.back} />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <AppInput label="Full name" value={name} onChangeText={setName} placeholder="Name" />
        <AppInput label="Phone" value={phone} onChangeText={setPhone} placeholder="10-digit number" keyboardType="phone-pad" />
        <AppInput
          label="Delivery address"
          value={address}
          onChangeText={setAddress}
          placeholder="House, street, city"
          multiline
          style={{ height: 80, textAlignVertical: "top" }}
        />
        <Text style={styles.label}>Payment method</Text>
        <View style={styles.methods}>
          {METHODS.map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMethod(m)}
              style={[styles.method, method === m && styles.methodActive]}
            >
              <Text style={method === m ? styles.methodTextActive : styles.methodText}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.total}>Total to pay: {formatPrice(total)}</Text>
        <AppButton title="PLACE ORDER" onPress={placeOrder} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: theme.muted, marginBottom: 8, fontSize: 13 },
  methods: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  method: {
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  methodActive: { backgroundColor: theme.gold, borderColor: theme.gold },
  methodText: { color: theme.muted },
  methodTextActive: { color: "#111", fontWeight: "bold" },
  total: { color: theme.gold, fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  success: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  sTitle: { color: theme.text, fontSize: 28, fontWeight: "bold", marginVertical: 12 },
  sText: { color: theme.muted, fontSize: 16, marginTop: 4 },
});