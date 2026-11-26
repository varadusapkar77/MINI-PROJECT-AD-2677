import React, { useState } from "react";
import { Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import { theme } from "../constants/theme";
import { Nav } from "../navigation/types";
import { useApp } from "../context/AppContext";
import Screen from "../components/Screen";
import AuthHeader from "../components/AuthHeader";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";

export default function RegisterScreen({ nav }: { nav: Nav }) {
  const { refreshUser } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const register = async () => {
    if (!name || !email || !password) return setStatus("Please fill all fields");
    try {
      setLoading(true);
      setStatus("");
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: name.trim() });
      refreshUser();
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") setStatus("Email already in use");
      else if (e.code === "auth/invalid-email") setStatus("Invalid email");
      else if (e.code === "auth/weak-password") setStatus("Password needs 6+ characters");
      else setStatus("Error: " + e.code);
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <AuthHeader subtitle="Create your account" />
        <AppInput label="Full name" placeholder="Your name" value={name} onChangeText={setName} />
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
          placeholder="Minimum 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {status ? <Text style={styles.error}>{status}</Text> : null}
        <AppButton title="CREATE ACCOUNT" onPress={register} loading={loading} />
        <TouchableOpacity onPress={nav.back}>
          <Text style={styles.muted}>
            Already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: "center", padding: 24 },
  error: { color: theme.danger, marginBottom: 8 },
  link: { color: theme.gold },
  muted: { color: theme.muted, textAlign: "center", marginTop: 16 },
});