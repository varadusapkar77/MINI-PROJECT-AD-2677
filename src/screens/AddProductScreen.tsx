import React, { useState } from "react";
import { ScrollView } from "react-native";
import { theme } from "../constants/theme";
import { Nav } from "../navigation/types";
import { useApp } from "../context/AppContext";
import { createProduct } from "../services/api";
import { showMessage } from "../utils/message";
import Screen from "../components/Screen";
import ScreenHeader from "../components/ScreenHeader";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";

export default function AddProductScreen({ nav }: { nav: Nav }) {
  const { setProducts } = useApp();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  // REST POST
  const save = async () => {
    if (!title || !price) return showMessage("Error", "Enter title and price");
    try {
      setLoading(true);
      const created = await createProduct({
        title,
        price: Number(price),
        brand,
        description: desc,
        category: "custom",
      });
      // dummyjson only simulates saving, so we keep the product in our own list
      setProducts((prev) => [
        { ...created, id: Date.now(), price: Number(price), category: "custom" },
        ...prev,
      ]);
      showMessage("Success", "Product added (POST request successful)");
      nav.back();
    } catch (e: any) {
      setLoading(false);
      showMessage("Error", e.message);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Add Product" onBack={nav.back} />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <AppInput label="Title" value={title} onChangeText={setTitle} placeholder="Product title" />
        <AppInput label="Price (₹)" value={price} onChangeText={setPrice} placeholder="0" keyboardType="numeric" />
        <AppInput label="Brand" value={brand} onChangeText={setBrand} placeholder="Brand name" />
        <AppInput
          label="Description"
          value={desc}
          onChangeText={setDesc}
          placeholder="About this product"
          multiline
          style={{ height: 100, textAlignVertical: "top", borderColor: theme.border }}
        />
        <AppButton title="SAVE (POST TO API)" onPress={save} loading={loading} />
        <AppButton title="CANCEL" variant="outline" onPress={nav.back} />
      </ScrollView>
    </Screen>
  );
}