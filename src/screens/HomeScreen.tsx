import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, StyleSheet,
} from "react-native";
import { auth } from "../config/firebase";
import { theme } from "../constants/theme";
import { Nav } from "../navigation/types";
import { useApp } from "../context/AppContext";
import {
  Product, getProducts, searchProducts, getCategories, getByCategory,
} from "../services/api";
import Screen from "../components/Screen";
import AppInput from "../components/AppInput";
import ProductCard from "../components/ProductCard";

export default function HomeScreen({ nav }: { nav: Nav }) {
  const { products, setProducts, isFav, toggleFav, addToCart } = useApp();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const user = auth.currentUser;
  const name = user?.displayName || user?.email || "there";

  const load = async (q = "", cat = "all") => {
    try {
      setError("");
      setLoading(true);
      let list: Product[];
      if (q) list = await searchProducts(q);
      else if (cat !== "all") list = await getByCategory(cat);
      else list = await getProducts();
      // keep products the user added himself (id > 1000) on the default list
      if (!q && cat === "all") setProducts((prev) => [...prev.filter((p) => p.id > 1000), ...list]);
      else setProducts(list);
    } catch (e: any) {
      setError("Could not load products: " + e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const pickCategory = (c: string) => {
    setCategory(c);
    setSearch("");
    load("", c);
  };

  return (
    <Screen>
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Hello, {name} 👋</Text>
          <Text style={styles.sub}>Find your next favourite</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => nav.go("AddProduct")}>
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <AppInput
          placeholder="🔍  Search products"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => {
            setCategory("all");
            load(search);
          }}
          returnKeyType="search"
        />
      </View>

      <View style={{ height: 44 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {["all", ...categories].map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => pickCategory(c)}
              style={[styles.chip, category === c && styles.chipActive]}
            >
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading && !refreshing ? <ActivityIndicator color={theme.gold} size="large" style={{ marginTop: 20 }} /> : null}

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            tintColor={theme.gold}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setSearch("");
              setCategory("all");
              load();
            }}
          />
        }
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No products found</Text> : null}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            isFav={isFav(item.id)}
            onPress={() => nav.go("Detail", { product: item })}
            onFav={() => toggleFav(item)}
            onAdd={() => addToCart(item)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", padding: 16 },
  hello: { color: theme.text, fontSize: 20, fontWeight: "bold" },
  sub: { color: theme.muted, marginTop: 2 },
  addBtn: { borderWidth: 1, borderColor: theme.gold, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  addText: { color: theme.gold, fontWeight: "bold" },
  chip: {
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    justifyContent: "center",
    height: 36,
    marginRight: 8,
  },
  chipActive: { backgroundColor: theme.gold, borderColor: theme.gold },
  chipText: { color: theme.muted, textTransform: "capitalize" },
  chipTextActive: { color: "#111", fontWeight: "bold" },
  error: { color: theme.danger, paddingHorizontal: 16, marginTop: 8 },
  empty: { color: theme.muted, textAlign: "center", marginTop: 40 },
});