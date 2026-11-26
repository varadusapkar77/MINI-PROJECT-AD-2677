import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../constants/theme";
import { Product } from "../services/api";
import { formatPrice } from "../utils/format";

type Props = {
  item: Product;
  isFav: boolean;
  onPress: () => void;
  onFav: () => void;
  onAdd: () => void;
};

export default function ProductCard({ item, isFav, onPress, onFav, onAdd }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.imgBox}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.img} resizeMode="contain" />
        ) : (
          <Text style={{ fontSize: 40 }}>🛍️</Text>
        )}
        <TouchableOpacity style={styles.heart} onPress={onFav}>
          <Text style={{ fontSize: 16 }}>{isFav ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.category} numberOfLines={1}>{item.category}</Text>
      <View style={styles.bottom}>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <TouchableOpacity style={styles.add} onPress={onAdd}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },
  imgBox: {
    height: 120,
    backgroundColor: "#242430",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  img: { width: "100%", height: "100%" },
  heart: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: theme.text, fontWeight: "600", fontSize: 14 },
  category: { color: theme.muted, fontSize: 12, textTransform: "capitalize", marginTop: 2 },
  bottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  price: { color: theme.gold, fontWeight: "bold", fontSize: 16 },
  add: {
    backgroundColor: theme.gold,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addText: { color: "#111", fontSize: 20, fontWeight: "bold", marginTop: -2 },
});