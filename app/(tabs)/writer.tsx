import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  Screen,
  AppButton,
  AppTextField,
  Card,
  SectionTitle,
  Chip,
} from "../../src/components/ui";
import { colors, spacing, radius, fontSize } from "../../src/theme";
import { generateText } from "../../src/api/client";

const TONES = ["Professional", "Casual", "Friendly", "Formal", "Persuasive"];

export default function WriterScreen() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
    };
  }, []);

  const onGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt first.");
      return;
    }
    setError(undefined);
    setLoading(true);
    setResult(null);
    setCopied(false);
    try {
      const text = await generateText(prompt.trim(), tone);
      setResult(text);
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    if (!result) {
      return;
    }
    await Clipboard.setStringAsync(result);
    setCopied(true);
    if (copyTimer.current) {
      clearTimeout(copyTimer.current);
    }
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Screen>
      <Text style={styles.heading}>AI Writer</Text>
      <Text style={styles.subheading}>Describe what you need, pick a tone, and generate.</Text>

      <AppTextField
        label="Prompt"
        placeholder="Write a product launch email for..."
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        error={error}
      />

      <SectionTitle title="Tone" />
      <View style={styles.chipRow}>
        {TONES.map((t) => (
          <Chip key={t} label={t} selected={tone === t} onPress={() => setTone(t)} />
        ))}
      </View>

      <AppButton title="Generate" onPress={onGenerate} loading={loading} />

      {result ? (
        <Card>
          <SectionTitle title="Result" />
          <Text style={styles.resultText}>{result}</Text>
          <View style={styles.copyRow}>
            <AppButton
              title={copied ? "Copied" : "Copy"}
              variant="secondary"
              onPress={onCopy}
            />
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, marginTop: spacing.sm },
  subheading: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  chipRow: { flexDirection: "row", flexWrap: "wrap" },
  resultText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  copyRow: { marginTop: spacing.xs },
});
