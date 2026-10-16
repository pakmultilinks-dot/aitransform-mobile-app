import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getSession } from "../src/auth/session";
import { colors } from "../src/theme";

/** Auth gate: sends logged-in users to the app, everyone else to Welcome. */
export default function Index() {
  const router = useRouter();
  const [checking] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      router.replace(session ? "/(tabs)" : "/welcome");
    })();
  }, [router]);

  return (
    <View style={styles.center}>
      {checking ? <ActivityIndicator size="large" color={colors.primary} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
});
