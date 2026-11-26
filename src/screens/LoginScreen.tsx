import React, { useState } from "react";
import { Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { theme } from "../constants/theme";
import { Nav } from "../navigation/types";
import Screen from "../components/Screen";
import AuthHeader from "../components/AuthHeader";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";

export default function LoginScreen({ nav }: { nav: Nav }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const login = async () => {
    if (!email || !password) return setStatus("Please enter email and password");
    try {
      setLoading(true);
      setStatus("");
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      if (e.code === "auth/invalid-credential") setStatus("Wrong email or password");
      else if (e.code === "auth/invalid-email") setStatus("Invalid email");
      else setStatus("Error: " + e.code);
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <AuthHeader subtitle="Welcome back. Sign in to continue." />
        <AppInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <AppInput
          label="Password"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {status ? <Text style={styles.error}>{status}</Text> : null}
        <AppButton title="LOGIN" onPress={login} loading={loading} />
        <TouchableOpacity onPress={() => nav.go("Forgot")}>
          <Text style={styles.link}>Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.go("Register")}>
          <Text style={styles.muted}>
            New to Vmart? <Text style={styles.link}>Create account</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: "center", padding: 24 },
  error: { color: theme.danger, marginBottom: 8 },
  link: { color: theme.gold, textAlign: "center", marginTop: 16 },
  muted: { color: theme.muted, textAlign: "center", marginTop: 16 },
});