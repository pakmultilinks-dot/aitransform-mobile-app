import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Screen, AppButton } from "../../src/components/ui";
import { colors, spacing, radius, fontSize } from "../../src/theme";

const FEATURES = [
  { title: "AI Writer", desc: "Drafts, emails and copy in any tone" },
  { title: "AI Image", desc: "Stunning visuals from a single prompt" },
  { title: "AI Chat", desc: "Brainstorm, explain and plan anything" },
  { title: "Voice tools", desc: "Speech to text and lifelike voiceovers" },
];

export default function WelcomeScreen() {
  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoLetter}>aT</Text>
        </View>
        <Text style={styles.brand}>aiTransform</Text>
        <Text style={styles.tagline}>
          One-Stop conversion to Artificial Intelligence
        </Text>
      </View>

      <View style={styles.features}>
        {FEATURES.map((f) => (
          <View key={f.title} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <AppButton title="Log in" onPress={() => router.push("/login")} />
        <AppButton
          title="Create account"
          variant="secondary"
          onPress={() => router.push("/signup")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  logoLetter: {
    color: "#FFFFFF",
    fontSize: fontSize.xxl,
    fontWeight: "800",
  },
  brand: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: colors.text,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  features: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.sm,
  },
  featureDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 5,
    marginRight: spacing.sm,
  },
  featureText: { flex: 1 },
  featureTitle: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.text,
  },
  featureDesc: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  actions: { marginTop: spacing.sm },
});
