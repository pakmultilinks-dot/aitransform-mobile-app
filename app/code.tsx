import { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { AppButton, AppTextField, Card, Chip, Screen } from "../src/components/ui";
import { colors, spacing, radius, fontSize } from "../src/theme";
import { generateCode } from "../src/api/client";

const LANGUAGES = ["Python", "JavaScript", "TypeScript", "SQL", "Go"];

export default function CodeScreen() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim() || loading) {
      return;
    }
    setLoading(true);
    setCopied(false);
    void (async () => {
      try {
        const code = await generateCode(prompt.trim(), language);
        setOutput(code);
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleCopy = () => {
    if (!output) {
      return;
    }
    void (async () => {
      await Clipboard.setStringAsync(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    })();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back} hitSlop={12}>
          <Text style={styles.backLabel}>&lt; Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AI Code</Text>
        <View style={styles.back} />
      </View>

      <AppTextField
        label="What should the code do?"
        placeholder="e.g. Parse a CSV file into a list of records"
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={styles.promptInput}
      />

      <Text style={styles.label}>Language</Text>
      <View style={styles.chips}>
        {LANGUAGES.map((lang) => (
          <Chip key={lang} label={lang} selected={lang === language} onPress={() => setLanguage(lang)} />
        ))}
      </View>

      <AppButton
        title="Generate"
        onPress={handleGenerate}
        loading={loading}
        disabled={!prompt.trim()}
      />

      {output ? (
        <Card>
          <View style={styles.outputHead}>
            <Text style={styles.outputTitle}>{language}</Text>
            <TouchableOpacity onPress={handleCopy} style={styles.copyBtn} hitSlop={8}>
              <Text style={styles.copyLabel}>{copied ? "Copied" : "Copy"}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.code}>{output}</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  back: { flexDirection: "row", alignItems: "center", minWidth: 70 },
  backLabel: { fontSize: fontSize.md, color: colors.primary, fontWeight: "600" },
  title: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.sm },
  promptInput: { minHeight: 90 },
  outputHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  outputTitle: { fontSize: fontSize.sm, fontWeight: "700", color: colors.primary },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
  },
  copyLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  code: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 20,
  },
});
