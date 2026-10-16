import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Card, Screen, SectionTitle } from "../../src/components/ui";
import { colors, spacing, radius, fontSize } from "../../src/theme";
import { clearSession } from "../../src/auth/session";

interface Row {
  title: string;
  subtitle: string;
  onPress: () => void;
  danger?: boolean;
}

function MenuRow({ title, subtitle, onPress, danger }: Row) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.row}>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, danger ? styles.rowTitleDanger : null]}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>&gt;</Text>
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const handleLogout = () => {
    void (async () => {
      await clearSession();
      router.replace("/welcome");
    })();
  };

  return (
    <Screen>
      <Text style={styles.heading}>More</Text>

      <SectionTitle title="AI Tools" />
      <Card style={styles.cardPad}>
        <MenuRow
          title="AI Code"
          subtitle="Generate and polish code snippets"
          onPress={() => router.push("/code")}
        />
        <MenuRow
          title="Voice Tools"
          subtitle="Speech to text and AI voiceover"
          onPress={() => router.push("/voice")}
        />
      </Card>

      <SectionTitle title="Account" />
      <Card style={styles.cardPad}>
        <MenuRow
          title="Profile & Settings"
          subtitle="Account, plan, and preferences"
          onPress={() => router.push("/profile")}
        />
        <MenuRow
          title="Help & Support"
          subtitle="FAQs and contact options"
          onPress={() => Alert.alert("Support", "Support: support@aitransform.com")}
        />
        <MenuRow
          title="Log out"
          subtitle="Sign out of this device"
          danger
          onPress={handleLogout}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardPad: { paddingVertical: spacing.xs },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: fontSize.md, fontWeight: "600", color: colors.text },
  rowTitleDanger: { color: colors.danger },
  rowSubtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  chevron: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textMuted,
    marginLeft: spacing.sm,
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 26,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
  },
});
