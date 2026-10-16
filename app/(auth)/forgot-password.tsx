import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Screen, AppButton, AppTextField } from "../../src/components/ui";
import { colors, spacing, fontSize } from "../../src/theme";
import { requestPasswordReset, resetPassword } from "../../src/api/client";

type Step = "request" | "reset";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    const next: { [k: string]: string } = {};
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!email.includes("@")) {
      next.email = "Enter a valid email address.";
    }
    setErrors(next);
    setApiError("");
    if (Object.keys(next).length > 0) {
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setStep("reset");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    const next: { [k: string]: string } = {};
    if (code.trim().length !== 6) {
      next.code = "Enter the 6-digit code.";
    }
    if (newPassword.length < 8) {
      next.newPassword = "Password must be at least 8 characters.";
    }
    if (confirm !== newPassword) {
      next.confirm = "Passwords do not match.";
    }
    setErrors(next);
    setApiError("");
    if (Object.keys(next).length > 0) {
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim(), code.trim(), newPassword);
      router.replace("/login");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>
          {step === "request"
            ? "Enter your account email and we will send you a reset code."
            : `Check your email at ${email.trim()}. Enter the code and choose a new password.`}
        </Text>
      </View>

      {apiError ? (
        <View style={styles.apiErrorBox}>
          <Text style={styles.apiErrorText}>{apiError}</Text>
        </View>
      ) : null}

      {step === "request" ? (
        <>
          <AppTextField
            label="Email"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setErrors((e) => ({ ...e, email: "" }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            error={errors.email || undefined}
          />
          <AppButton title="Send reset code" onPress={handleRequest} loading={loading} />
        </>
      ) : (
        <>
          <AppTextField
            label="Reset code"
            value={code}
            onChangeText={(t) => {
              setCode(t.replace(/[^0-9]/g, ""));
              setErrors((e) => ({ ...e, code: "" }));
            }}
            keyboardType="numeric"
            maxLength={6}
            placeholder="6-digit code"
            error={errors.code || undefined}
          />
          <AppTextField
            label="New password"
            value={newPassword}
            onChangeText={(t) => {
              setNewPassword(t);
              setErrors((e) => ({ ...e, newPassword: "" }));
            }}
            secureTextEntry
            placeholder="Minimum 8 characters"
            error={errors.newPassword || undefined}
          />
          <AppTextField
            label="Confirm new password"
            value={confirm}
            onChangeText={(t) => {
              setConfirm(t);
              setErrors((e) => ({ ...e, confirm: "" }));
            }}
            secureTextEntry
            placeholder="Repeat your new password"
            error={errors.confirm || undefined}
          />
          <AppButton title="Reset password" onPress={handleReset} loading={loading} />
        </>
      )}
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
});
