import React, { useEffect, useState } from "react";
import { View, BackHandler, StatusBar } from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./src/config/firebase";
import { AppProvider, useApp } from "./src/context/AppContext";
import { Nav } from "./src/navigation/types";
import TabBar from "./src/components/TabBar";

import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotScreen from "./src/screens/ForgotScreen";
import HomeScreen from "./src/screens/HomeScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import CartScreen from "./src/screens/CartScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import AddProductScreen from "./src/screens/AddProductScreen";

type Route = { name: string; params?: any };
const TABS = ["Home", "Favorites", "Cart", "Profile"];

function Root() {
  const { cartCount, clearUserData } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [tab, setTab] = useState("Home");
  const [stack, setStack] = useState<Route[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 2500);
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setStack([]);
      setTab("Home");
      if (!u) clearUserData();
      setAuthChecked(true);
    });
    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);

  // Android hardware back button
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (stack.length > 0) {
        setStack((s) => s.slice(0, -1));
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [stack]);

  const nav: Nav = {
    go: (name, params) => {
      if (TABS.includes(name)) {
        setTab(name);
        setStack([]);
      } else {
        setStack((s) => [...s, { name, params }]);
      }
    },
    back: () => setStack((s) => s.slice(0, -1)),
  };

  const renderRoute = (r: Route) => {
    switch (r.name) {
      case "Login": return <LoginScreen nav={nav} />;
      case "Register": return <RegisterScreen nav={nav} />;
      case "Forgot": return <ForgotScreen nav={nav} />;
      case "Detail": return <ProductDetailScreen nav={nav} product={r.params.product} />;
      case "AddProduct": return <AddProductScreen nav={nav} />;
      case "Checkout": return <CheckoutScreen nav={nav} />;
      default: return null;
    }
  };

  if (!splashDone || !authChecked) return <SplashScreen />;

  // Not logged in: Login / Register / Forgot
  if (!user) {
    return renderRoute(stack[stack.length - 1] ?? { name: "Login" });
  }

  // Logged in: 4 tab screens stay mounted, other screens open on top
  const top = stack[stack.length - 1];
  const show = (name: string) => ({ flex: 1, display: !top && tab === name ? ("flex" as const) : ("none" as const) });

  return (
    <View style={{ flex: 1, backgroundColor: "#0E0E12" }}>
      <View style={show("Home")}><HomeScreen nav={nav} /></View>
      <View style={show("Favorites")}><FavoritesScreen nav={nav} /></View>
      <View style={show("Cart")}><CartScreen nav={nav} /></View>
      <View style={show("Profile")}><ProfileScreen nav={nav} /></View>

      {top ? <View key={stack.length} style={{ flex: 1 }}>{renderRoute(top)}</View> : null}
      {!top ? <TabBar tab={tab} onChange={(t) => nav.go(t)} cartCount={cartCount} /> : null}
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StatusBar barStyle="light-content" />
      <Root />
    </AppProvider>
  );
}