import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { theme } from "../constants/theme";
import { Nav } from "../navigation/types";
import { useApp } from "../context/AppContext";
import { Product, getProduct, deleteProductApi } from "../services/api";
import { showMessage } from "../utils/message";
import Screen from "../components/Screen";
import ScreenHeader from "../components/ScreenHeader";
import AppButton from "../components/AppButton";

export default function ProductDetailScreen({ nav, product }: { nav: Nav; product: Product }) {
  const { isFav, toggleFav, addToCart, setProducts, removeFromCart } = useApp();
  const [item, setItem] = useState<Product>(product);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isLocal = product.id > 1000; // products added by the user exist only in the app

  // REST GET: single product
  useEffect(() => {
    if (isLocal) return;
    setLoading(true);
    getProduct(product.id)
      .then(setItem)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // REST DELETE
  const remove = async () => {
    try {
      setDeleting(true);
      if (!isLocal) await deleteProductApi(item.id);
      setProducts((prev) => prev.filter((p) => p.id !== item.id));
      removeFromCart(item.id);
      if (isFav(item.id)) toggleFav(item);
      showMessage("Deleted", "Product removed");
      nav.back();
    } catch (e: any) {
      setDeleting(false);
      showMessage("Error", e.message);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Details" onBack={nav.back} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.imgBox}>
          {item.thumbnail ? (
            <Image source={{ uri: item.thumbnail }} style={styles.img} resizeMode="contain" />
          ) : (
            <Text style={{ fontSize: 80 }}>🛍️</Text>
          )}
        </View>
        {loading ? <ActivityIndicator color={theme.gold} /> : null}

        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>${item.price}</Text>
          {item.rating ? <Text style={styles.rating}>⭐ {item.rating}</Text> : null}
        </View>
        {item.brand ? <Text style={styles.meta}>Brand: {item.brand}</Text> : null}
        {item.stock !== undefined ? <Text style={styles.meta}>In stock: {item.stock}</Text> : null}
        <Text style={styles.desc}>{item.description || "No description."}</Text>

        <AppButton title="ADD TO CART" onPress={() => { addToCart(item); showMessage("Added", "Item added to cart"); }} />
        <AppButton
          title={isFav(item.id) ? "♥  REMOVE FROM FAVORITES" : "♡  ADD TO FAVORITES"}
          variant="outline"
          onPress={() => toggleFav(item)}
        />
        <AppButton title="DELETE PRODUCT" variant="danger" onPress={remove} loading={deleting} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imgBox: {
    height: 260,
    backgroundColor: theme.card,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  img: { width: "100%", height: "100%" },
  category: { color: theme.gold, textTransform: "uppercase", letterSpacing: 1, fontSize: 12 },
  title: { color: theme.text, fontSize: 24, fontWeight: "bold", marginTop: 4 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 8 },
  price: { color: theme.gold, fontSize: 26, fontWeight: "bold" },
  rating: { color: theme.text, fontSize: 16 },
  meta: { color: theme.muted, marginTop: 2 },
  desc: { color: theme.muted, lineHeight: 22, marginVertical: 14 },
});