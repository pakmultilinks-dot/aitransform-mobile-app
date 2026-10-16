import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { AppButton, Card, Screen, SectionTitle } from "../src/components/ui";
import { colors, spacing, fontSize } from "../src/theme";
import { clearSession, getEmail } from "../src/auth/session";

export default function ProfileScreen() {
  const [email, setEmail] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    void (async () => {
      setEmail(await getEmail());
    })();
  }, []);

  const handleLogout = () => {
    void (async () => {
      await clearSession();
      router.replace("/welcome");
    })();
  };

  const initial = (email ?? "?").charAt(0).toUpperCase();

  return (
    <Screen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back} hitSlop={12}>
          <Text style={styles.backLabel}>&lt; Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.back} />
      </View>

      <SectionTitle title="Account" />
      <Card>
        <View style={styles.accountRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{initial}</Text>
          </View>
          <View style={styles.accountText}>
            <Text style={styles.email}>{email ?? "Loading..."}</Text>
            <Text style={styles.muted}>aiTransform member</Text>
          </View>
        </View>
      </Card>

      <SectionTitle title="Subscription" />
      <Card>
        <View style={styles.planRow}>
          <View>
            <Text style={styles.planName}>Pro Monthly</Text>
            <Text style={styles.muted}>Unlimited tools, priority speed</Text>
          </View>
          <Text style={styles.price}>$19/mo</Text>
        </View>
        <AppButton
          title="Manage subscription"
          variant="secondary"
          onPress={() => Alert.alert("Subscription", "Subscription management is stubbed in this build.")}
        />
      </Card>

      <SectionTitle title="Settings" />
      <Card style={styles.cardPad}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>
        <View style={[styles.settingRow, styles.noBorder]}>
          <Text style={styles.settingLabel}>Dark mode</Text>
          <View style={styles.darkRow}>
            <Text style={styles.muted}>Light (default)</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>
      </Card>

      <SectionTitle title="Danger zone" />
      <Card>
        <AppButton title="Log out" variant="secondary" onPress={handleLogout} />
        <AppButton
          title="Delete account"
          variant="danger"
          onPress={() =>
            Alert.alert(
              "Delete account",
              "This cannot be undone. Delete is stubbed in this build.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => Alert.alert("Stubbed", "Delete is stubbed in this build."),
                },
              ]
            )
          }
        />
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
  accountRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarLetter: { fontSize: fontSize.xl, fontWeight: "800", color: "#FFFFFF" },
  accountText: { flex: 1 },
  email: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  muted: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  planName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  price: { fontSize: fontSize.lg, fontWeight: "800", color: colors.primary },
  cardPad: { paddingVertical: spacing.xs },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  noBorder: { borderBottomWidth: 0 },
  settingLabel: { fontSize: fontSize.md, fontWeight: "600", color: colors.text },
  darkRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
});
