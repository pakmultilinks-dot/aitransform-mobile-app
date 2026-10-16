import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen, AppButton, AppTextField } from "../../src/components/ui";
import { colors, spacing, fontSize } from "../../src/theme";
import { verifyEmail, resendCode } from "../../src/api/client";
import { getEmail } from "../../src/auth/session";

const RESEND_COOLDOWN = 60;

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendNote, setResendNote] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!params.email) {
      getEmail().then((saved) => {
        if (saved) {
          setEmail(saved);
        }
      });
    }
  }, [params.email]);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN);
    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (timer.current) {
            clearInterval(timer.current);
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  async function handleVerify() {
    if (code.trim().length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setError("");
    setApiError("");
    setLoading(true);
    try {
      await verifyEmail(email, code.trim());
      router.replace("/(tabs)");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0 || resending) {
      return;
    }
    setResending(true);
    setResendNote("");
    setApiError("");
    try {
      await resendCode(email);
      setResendNote("A new code was sent to your email.");
      startCooldown();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Could not resend the code.");
    } finally {
      setResending(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to {email ? email : "your email address"}.
        </Text>
      </View>

      {apiError ? (
        <View style={styles.apiErrorBox}>
          <Text style={styles.apiErrorText}>{apiError}</Text>
        </View>
      ) : null}

      <AppTextField
        label="Verification code"
        value={code}
        onChangeText={(t) => {
          setCode(t.replace(/[^0-9]/g, ""));
          setError("");
        }}
        keyboardType="numeric"
        maxLength={6}
        placeholder="123456"
        error={error}
      />

      <AppButton title="Verify" onPress={handleVerify} loading={loading} />

      <TouchableOpacity
        onPress={handleResend}
        disabled={cooldown > 0 || resending}
        style={styles.resendRow}
      >
        <Text
          style={[
            styles.resendText,
            (cooldown > 0 || resending) && styles.resendTextDisabled,
          ]}
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </Text>
      </TouchableOpacity>

      {resendNote ? <Text style={styles.note}>{resendNote}</Text> : null}
      <Text style={styles.hint}>Mock mode: any 6-digit code works.</Text>
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
  resendRow: { alignItems: "center", marginTop: spacing.md },
  resendText: { color: colors.primary, fontWeight: "700", fontSize: fontSize.sm },
  resendTextDisabled: { color: colors.textMuted },
  note: {
    fontSize: fontSize.sm,
    color: colors.success,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  hint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.md,
  },
});
