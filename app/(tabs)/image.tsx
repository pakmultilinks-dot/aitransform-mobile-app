import { useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import {
  Screen,
  AppButton,
  AppTextField,
  Card,
  SectionTitle,
  Chip,
} from "../../src/components/ui";
import { colors, spacing, radius, fontSize } from "../../src/theme";
import { generateImage } from "../../src/api/client";

const STYLES = ["Photorealistic", "Digital Art", "3D Render", "Anime", "Minimalist"];
const ASPECTS = ["1:1", "16:9", "9:16"];

export default function ImageScreen() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [aspect, setAspect] = useState(ASPECTS[0]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const onGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe the image you want.");
      return;
    }
    setError(undefined);
    setLoading(true);
    setImageUrl(null);
    try {
      const { imageUrl: url } = await generateImage(prompt.trim(), style, aspect);
      setImageUrl(url);
    } catch {
      setError("Image generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.heading}>AI Image</Text>
      <Text style={styles.subheading}>Describe an image, pick a style, and generate.</Text>

      <AppTextField
        label="Prompt"
        placeholder="A futuristic city at sunset..."
        value={prompt}
        onChangeText={setPrompt}
        error={error}
      />

      <SectionTitle title="Style" />
      <View style={styles.chipRow}>
        {STYLES.map((s) => (
          <Chip key={s} label={s} selected={style === s} onPress={() => setStyle(s)} />
        ))}
      </View>

      <SectionTitle title="Aspect ratio" />
      <View style={styles.chipRow}>
        {ASPECTS.map((a) => (
          <Chip key={a} label={a} selected={aspect === a} onPress={() => setAspect(a)} />
        ))}
      </View>

      <AppButton title="Generate image" onPress={onGenerate} loading={loading} />

      <Card style={styles.previewCard}>
        {loading ? (
          <View style={styles.previewBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.previewHint}>Generating your image...</Text>
          </View>
        ) : imageUrl ? (
          <View>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            <Text style={styles.caption}>
              {style} - {aspect} - {prompt.trim().slice(0, 60)}
            </Text>
          </View>
        ) : (
          <View style={styles.previewBox}>
            <Text style={styles.previewIcon}>+</Text>
            <Text style={styles.previewHint}>Your generated image will appear here</Text>
          </View>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, marginTop: spacing.sm },
  subheading: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  chipRow: { flexDirection: "row", flexWrap: "wrap" },
  previewCard: { padding: spacing.sm },
  previewBox: {
    height: 300,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  previewIcon: { fontSize: fontSize.xxl, color: colors.textMuted, marginBottom: spacing.sm },
  previewHint: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: "center", marginTop: spacing.sm },
  image: { width: "100%", height: 300, borderRadius: radius.lg, backgroundColor: colors.background },
  caption: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.sm, textAlign: "center" },
});
