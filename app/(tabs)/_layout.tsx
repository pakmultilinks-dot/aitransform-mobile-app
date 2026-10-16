import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={typeof color === "string" ? color : colors.primary} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="writer"
        options={{
          title: "Writer",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create-outline" color={typeof color === "string" ? color : colors.primary} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="image"
        options={{
          title: "Image",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="image-outline" color={typeof color === "string" ? color : colors.primary} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={typeof color === "string" ? color : colors.primary} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal" color={typeof color === "string" ? color : colors.primary} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
