import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen, Card, SectionTitle } from "../../src/components/ui";
import { colors, spacing, radius, fontSize } from "../../src/theme";
import { getUsageStats, getRecentActivity } from "../../src/api/client";
import type { UsageStats, ActivityItem } from "../../src/api/client";
import { getEmail } from "../../src/auth/session";

interface QuickAction {
  title: string;
  subtitle: string;
  monogram: string;
  tint: string;
  route: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { title: "AI Writer", subtitle: "Drafts and copy", monogram: "W", tint: "#EEF2FF", route: "/writer" },
  { title: "AI Image", subtitle: "Art and visuals", monogram: "I", tint: "#FEF3C7", route: "/image" },
  { title: "AI Chat", subtitle: "Brainstorm ideas", monogram: "C", tint: "#ECFDF5", route: "/chat" },
  { title: "AI Code", subtitle: "Snippets and fixes", monogram: "</>", tint: "#FDF2F8", route: "/code" },
  { title: "Voice Tools", subtitle: "Transcribe and speak", monogram: "V", tint: "#EFF6FF", route: "/voice" },
];

function greetingForHour(hour: number): string {
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 17) {
    return "Good afternoon";
  }
  return "Good evening";
}

function firstNameFromEmail(email: string | null): string | null {
  if (!email) {
    return null;
  }
  const first = email.split("@")[0].split(/[._-]/)[0];
  if (!first) {
    return null;
  }
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export default function DashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [s, a, email] = await Promise.all([
          getUsageStats(),
          getRecentActivity(),
          getEmail(),
        ]);
        if (!mounted) {
          return;
        }
        setStats(s);
        setActivity(a);
        setName(firstNameFromEmail(email));
      } catch {
        if (mounted) {
          setError("Could not load your dashboard. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Screen scroll={false}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your workspace...</Text>
        </View>
      </Screen>
    );
  }

  if (error || !stats) {
    return (
      <Screen scroll={false}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error ?? "Something went wrong."}</Text>
        </View>
      </Screen>
    );
  }

  const greeting = greetingForHour(new Date().getHours());
  const pct = Math.min(100, (stats.wordsGenerated / stats.planWordLimit) * 100);
  const barColor = pct >= 90 ? colors.danger : colors.primary;

  return (
    <Screen>
      <Text style={styles.greeting}>
        {greeting}
        {name ? `, ${name}` : ""}
      </Text>
      <Text style={styles.subheading}>Here is your aiTransform overview.</Text>

      <View style={styles.statRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.wordsGenerated.toLocaleString("en-US")}</Text>
          <Text style={styles.statLabel}>Words generated</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.imagesGenerated.toLocaleString("en-US")}</Text>
          <Text style={styles.statLabel}>Images generated</Text>
        </Card>
        <Card style={[styles.statCard, styles.statCardLast]}>
          <Text style={styles.statValue}>{stats.chatSessions.toLocaleString("en-US")}</Text>
          <Text style={styles.statLabel}>Chat sessions</Text>
        </Card>
      </View>

      <Card>
        <View style={styles.usageHeader}>
          <Text style={styles.usageTitle}>Words used</Text>
          <Text style={styles.usageCount}>
            {stats.wordsGenerated.toLocaleString("en-US")} /{" "}
            {stats.planWordLimit.toLocaleString("en-US")}
          </Text>
        </View>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
        </View>
        <Text style={styles.usagePct}>{pct.toFixed(0)}% of your plan used</Text>
      </Card>

      <SectionTitle title="Quick actions" />
      <View style={styles.grid}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.title}
            style={styles.gridItem}
            onPress={() => router.push(action.route)}
            activeOpacity={0.85}
          >
            <Card style={styles.actionCard}>
              <View style={[styles.monogram, { backgroundColor: action.tint }]}>
                <Text style={styles.monogramText}>{action.monogram}</Text>
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <SectionTitle title="Recent activity" />
      <Card style={styles.activityCard}>
        {activity.map((item, index) => (
          <View
            key={item.id}
            style={[styles.activityRow, index < activity.length - 1 && styles.activityDivider]}
          >
            <View style={styles.activityMain}>
              <Text style={styles.activityTool}>{item.tool}</Text>
              <Text style={styles.activityTitle}>{item.title}</Text>
            </View>
            <Text style={styles.activityTime}>{item.time}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  loadingText: { marginTop: spacing.md, color: colors.textMuted, fontSize: fontSize.sm },
  errorText: { color: colors.danger, fontSize: fontSize.md, textAlign: "center" },
  greeting: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, marginTop: spacing.sm },
  subheading: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  statRow: { flexDirection: "row" },
  statCard: { flex: 1, marginRight: spacing.sm, alignItems: "center" },
  statCardLast: { marginRight: 0 },
  statValue: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.xs, textAlign: "center" },
  usageHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: spacing.sm },
  usageTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  usageCount: { fontSize: fontSize.sm, color: colors.textMuted },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: "hidden" },
  barFill: { height: 8, borderRadius: 4 },
  usagePct: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.xs },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -spacing.xs },
  gridItem: { width: "50%", paddingHorizontal: spacing.xs },
  actionCard: { alignItems: "flex-start" },
  monogram: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  monogramText: { fontSize: fontSize.md, fontWeight: "800", color: colors.primary },
  actionTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  actionSubtitle: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  activityCard: { paddingVertical: spacing.sm },
  activityRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm, paddingHorizontal: spacing.xs },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  activityMain: { flex: 1 },
  activityTool: { fontSize: fontSize.xs, fontWeight: "700", color: colors.primary },
  activityTitle: { fontSize: fontSize.sm, color: colors.text, marginTop: 2 },
  activityTime: { fontSize: fontSize.xs, color: colors.textMuted, marginLeft: spacing.sm },
});
