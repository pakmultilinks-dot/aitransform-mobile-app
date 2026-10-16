import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Screen, AppButton, AppTextField } from "../../src/components/ui";
import { colors, spacing, radius, fontSize } from "../../src/theme";
import { login } from "../../src/api/client";
import { saveSession, saveEmail } from "../../src/auth/session";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!email.includes("@")) {
      next.email = "Enter a valid email address.";
    }
    if (!password) {
      next.password = "Password is required.";
    }
    setErrors(next);
    setApiError("");
    if (Object.keys(next).length > 0) {
      return;
    }
    setLoading(true);
    try {
      const tokens = await login(email.trim(), password);
      await saveSession(tokens);
      await saveEmail(email.trim());
      router.replace("/(tabs)");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to continue to aiTransform</Text>
      </View>

      {apiError ? (
        <View style={styles.apiErrorBox}>
          <Text style={styles.apiErrorText}>{apiError}</Text>
        </View>
      ) : null}

      <AppTextField
        label="Email"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          setErrors((e) => ({ ...e, email: undefined }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="you@example.com"
        error={errors.email}
      />
      <AppTextField
        label="Password"
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          setErrors((e) => ({ ...e, password: undefined }));
        }}
        secureTextEntry
        placeholder="Your password"
        error={errors.password}
      />

      <TouchableOpacity onPress={() => router.push("/forgot-password")}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <AppButton title="Log in" onPress={handleLogin} loading={loading} />

      <TouchableOpacity
        style={styles.switchRow}
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.switchText}>New here? </Text>
        <Text style={styles.switchLink}>Sign up</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg, marginTop: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textMuted, marginTop: spacing.xs },
  apiErrorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  apiErrorText: { color: colors.danger, fontSize: fontSize.sm },
  forgot: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: fontSize.sm,
    alignSelf: "flex-end",
    marginBottom: spacing.sm,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  switchText: { color: colors.textMuted, fontSize: fontSize.sm },
  switchLink: { color: colors.primary, fontWeight: "700", fontSize: fontSize.sm },
});
