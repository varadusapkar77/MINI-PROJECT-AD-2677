import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import { theme } from "../constants/theme";
import { Nav } from "../navigation/types";
import Screen from "../components/Screen";
import ScreenHeader from "../components/ScreenHeader";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";

export default function ForgotScreen({ nav }: { nav: Nav }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState(false);

  const send = async () => {
    if (!email) {
      setOk(false);
      return setStatus("Enter your email");
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      setOk(true);
      setStatus("Reset link sent. Check your inbox (and spam folder).");
    } catch (e: any) {
      setOk(false);
      setStatus("Error: " + e.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Forgot Password" onBack={nav.back} />
      <View style={{ padding: 20 }}>
        <Text style={styles.text}>
          Enter the email you registered with. We will send you a link to reset your password.
        </Text>
        <AppInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {status ? (
          <Text style={{ color: ok ? theme.success : theme.danger, marginBottom: 8 }}>{status}</Text>
        ) : null}
        <AppButton title="SEND RESET LINK" onPress={send} loading={loading} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: { color: theme.muted, marginBottom: 20, lineHeight: 20 },
});