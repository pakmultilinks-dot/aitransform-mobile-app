import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, radius, fontSize } from "../theme";

/** Page wrapper: safe area, light background, optional scroll. */
export function Screen({
  children,
  scroll = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.screenContent}>{children}</View>
  );
  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "ghost" && styles.buttonGhost,
        variant === "danger" && styles.buttonDanger,
        isDisabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : colors.primary} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === "primary" && styles.buttonTextPrimary,
            variant === "danger" && styles.buttonTextPrimary,
            (variant === "secondary" || variant === "ghost") && styles.buttonTextSecondary,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

interface AppTextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

/** Labeled text field with optional show/hide toggle for passwords. */
export function AppTextField({ label, error, secureTextEntry, ...rest }: AppTextFieldProps) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry ? hidden : false}
          autoCapitalize="none"
          {...rest}
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setHidden(!hidden)} hitSlop={8}>
            <Text style={styles.toggle}>{hidden ? "Show" : "Hide"}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

/** White card container. */
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Section heading row with optional right-side action label. */
export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/** Small selectable chip used for tone / style / language pickers. */
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

/** Password strength meter: min 8 chars, letter + number required. */
export function PasswordStrength({ password }: { password: string }) {
  let score = 0;
  if (password.length >= 8) {
    score += 1;
  }
  if (/[A-Za-z]/.test(password) && /[0-9]/.test(password)) {
    score += 1;
  }
  if (password.length >= 12 && /[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }
  const labels = ["Too short", "Weak", "Fair", "Strong"];
  const label = password.length === 0 ? "" : labels[score];
  const barColors = [colors.border, colors.danger, colors.warning, colors.success];
  return (
    <View style={styles.strengthWrap}>
      <View style={styles.strengthBar}>
        <View
          style={[
            styles.strengthFill,
            {
              width: `${(score / 3) * 100}%`,
              backgroundColor: barColors[score],
            },
          ]}
        />
      </View>
      {label ? <Text style={styles.strengthLabel}>{label} (min 8 characters)</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  screenContent: { padding: spacing.md, paddingBottom: spacing.xl },
  button: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.sm,
  },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonSecondary: { backgroundColor: colors.primaryLight },
  buttonGhost: { backgroundColor: "transparent" },
  buttonDanger: { backgroundColor: colors.danger },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: fontSize.md, fontWeight: "600" },
  buttonTextPrimary: { color: "#FFFFFF" },
  buttonTextSecondary: { color: colors.primary },
  fieldWrap: { marginBottom: spacing.md },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  inputError: { borderColor: colors.danger },
  input: { flex: 1, paddingVertical: 13, fontSize: fontSize.md, color: colors.text },
  toggle: { color: colors.primary, fontWeight: "600", fontSize: fontSize.sm, marginLeft: spacing.sm },
  errorText: { color: colors.danger, fontSize: fontSize.xs, marginTop: spacing.xs },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  sectionAction: { fontSize: fontSize.sm, color: colors.primary, fontWeight: "600" },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: "500" },
  chipTextSelected: { color: "#FFFFFF" },
  strengthWrap: { marginTop: -spacing.sm, marginBottom: spacing.md },
  strengthBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: "hidden",
    marginTop: spacing.xs,
  },
  strengthFill: { height: 6, borderRadius: 3 },
  strengthLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.xs },
});
