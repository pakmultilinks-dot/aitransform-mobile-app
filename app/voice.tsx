import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { AppButton, AppTextField, Card, Chip, Screen, SectionTitle } from "../src/components/ui";
import { colors, spacing, fontSize } from "../src/theme";
import { synthesizeVoice, transcribeAudio } from "../src/api/client";

const VOICES = ["Aria", "Guy", "Jenny"];

export default function VoiceScreen() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState(VOICES[0]);
  const [generating, setGenerating] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);

  const handleTranscribe = () => {
    if (transcribing) {
      return;
    }
    setTranscribing(true);
    void (async () => {
      try {
        const text = await transcribeAudio();
        setTranscript(text);
      } finally {
        setTranscribing(false);
      }
    })();
  };

  const handleGenerate = () => {
    if (!script.trim() || generating) {
      return;
    }
    setGenerating(true);
    setVoiceReady(false);
    void (async () => {
      try {
        await synthesizeVoice(script.trim(), voice);
        setVoiceReady(true);
      } finally {
        setGenerating(false);
      }
    })();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back} hitSlop={12}>
          <Text style={styles.backLabel}>&lt; Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Voice Tools</Text>
        <View style={styles.back} />
      </View>

      <SectionTitle title="Speech to Text" />
      <Card>
        <Text style={styles.desc}>Convert audio into text</Text>
        <AppButton
          title="Transcribe sample"
          onPress={handleTranscribe}
          loading={transcribing}
          variant="secondary"
        />
        {transcript ? <Text style={styles.result}>{transcript}</Text> : null}
        <Text style={styles.note}>Microphone capture is stubbed in this build.</Text>
      </Card>

      <SectionTitle title="AI Voiceover" />
      <Card>
        <Text style={styles.desc}>Generate a natural voiceover from your script</Text>
        <AppTextField
          label="Script"
          placeholder="Type what the voice should say"
          value={script}
          onChangeText={setScript}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={styles.scriptInput}
        />
        <Text style={styles.label}>Voice</Text>
        <View style={styles.chips}>
          {VOICES.map((v) => (
            <Chip key={v} label={v} selected={v === voice} onPress={() => setVoice(v)} />
          ))}
        </View>
        <AppButton
          title="Generate"
          onPress={handleGenerate}
          loading={generating}
          disabled={!script.trim()}
        />
        {voiceReady ? (
          <Text style={styles.ready}>Voiceover ready (engine stubbed, connect backend for audio)</Text>
        ) : null}
      </Card>
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
  desc: { fontSize: fontSize.md, color: colors.text, marginBottom: spacing.sm },
  result: {
    fontSize: fontSize.sm,
    color: colors.text,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: spacing.sm,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  note: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.sm },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.sm },
  scriptInput: { minHeight: 70 },
  ready: { fontSize: fontSize.sm, fontWeight: "600", color: colors.success, marginTop: spacing.sm },
});
