import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Screen, AppButton, AppTextField, PasswordStrength } from "../../src/components/ui";
import { colors, spacing, fontSize } from "../../src/theme";
import { signup } from "../../src/api/client";
import { saveEmail } from "../../src/auth/session";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    const next: typeof errors = {};
    if (!name.trim()) {
      next.name = "Name is required.";
    }
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!email.includes("@")) {
      next.email = "Enter a valid email address.";
    }
    if (password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    if (confirm !== password) {
      next.confirm = "Passwords do not match.";
    }
    setErrors(next);
    setApiError("");
    if (Object.keys(next).length > 0) {
      return;
    }
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
      await saveEmail(email.trim());
      router.push({ pathname: "/verify-email", params: { email: email.trim() } });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start creating with aiTransform</Text>
      </View>

      {apiError ? (
        <View style={styles.apiErrorBox}>
          <Text style={styles.apiErrorText}>{apiError}</Text>
        </View>
      ) : null}

      <AppTextField
        label="Full name"
        value={name}
        onChangeText={(t) => {
          setName(t);
          setErrors((e) => ({ ...e, name: undefined }));
        }}
        autoCapitalize="words"
        placeholder="Your name"
        error={errors.name}
      />
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
        placeholder="Minimum 8 characters"
        error={errors.password}
      />
      <PasswordStrength password={password} />
      <AppTextField
        label="Confirm password"
        value={confirm}
        onChangeText={(t) => {
          setConfirm(t);
          setErrors((e) => ({ ...e, confirm: undefined }));
        }}
        secureTextEntry
        placeholder="Repeat your password"
        error={errors.confirm}
      />
      <Text style={styles.helper}>
        Passwords are never stored in plain text. They are hashed and kept
        securely on the aiTransform servers.
      </Text>

      <AppButton title="Create account" onPress={handleSignup} loading={loading} />

      <TouchableOpacity style={styles.switchRow} onPress={() => router.push("/login")}>
        <Text style={styles.switchText}>Already have an account? </Text>
        <Text style={styles.switchLink}>Log in</Text>
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
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  apiErrorText: { color: colors.danger, fontSize: fontSize.sm },
  helper: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  switchText: { color: colors.textMuted, fontSize: fontSize.sm },
  switchLink: { color: colors.primary, fontWeight: "700", fontSize: fontSize.sm },
});
