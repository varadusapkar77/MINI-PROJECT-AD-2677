import React from "react";
import { Text, FlatList, StyleSheet } from "react-native";
import { theme } from "../constants/theme";
import { Nav } from "../navigation/types";
import { useApp } from "../context/AppContext";
import Screen from "../components/Screen";
import ScreenHeader from "../components/ScreenHeader";
import ProductCard from "../components/ProductCard";

export default function FavoritesScreen({ nav }: { nav: Nav }) {
  const { favorites, isFav, toggleFav, addToCart } = useApp();

  return (
    <Screen>
      <ScreenHeader title={`Favorites (${favorites.length})`} />
      <FlatList
        data={favorites}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No favorites yet.{"\n"}Tap 🤍 on any product.</Text>}
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
  empty: { color: theme.muted, textAlign: "center", marginTop: 60, lineHeight: 24 },
});