import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Screen } from "../../src/components/ui";
import { colors, spacing, radius, fontSize } from "../../src/theme";
import { chatSend } from "../../src/api/client";
import type { ChatMessage } from "../../src/api/client";

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const onSend = async () => {
    const text = input.trim();
    if (!text || sending) {
      return;
    }
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    Keyboard.dismiss();
    setSending(true);
    try {
      const reply = await chatSend(history, text);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
        ]}
      >
        <Text style={isUser ? styles.textUser : styles.textAssistant}>{item.text}</Text>
      </View>
    );
  };

  return (
    <Screen scroll={false}>
      <View style={styles.wrap}>
        <Text style={styles.heading}>AI Chat</Text>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>Start a conversation</Text>
              <Text style={styles.emptyText}>
                Ask me to write, brainstorm, explain, or plan anything.
              </Text>
            </View>
          }
          ListFooterComponent={
            sending ? (
              <View style={[styles.bubble, styles.bubbleAssistant, styles.typingBubble]}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.textAssistant, styles.typingText]}>
                  aiTransform is typing...
                </Text>
              </View>
            ) : undefined
          }
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            returnKeyType="send"
            onSubmitEditing={onSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || sending) && styles.sendButtonDisabled]}
            onPress={onSend}
            disabled={!input.trim() || sending}
            activeOpacity={0.8}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  heading: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, marginTop: spacing.sm, marginBottom: spacing.sm },
  listContent: { flexGrow: 1, paddingBottom: spacing.sm },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.lg,
    marginVertical: spacing.xs,
  },
  bubbleUser: { alignSelf: "flex-end", backgroundColor: colors.bubbleMe, borderBottomRightRadius: radius.sm },
  bubbleAssistant: {
    alignSelf: "flex-start",
    backgroundColor: colors.bubbleOther,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: radius.sm,
  },
  textUser: { fontSize: fontSize.md, color: colors.bubbleMeText, lineHeight: 22 },
  textAssistant: { fontSize: fontSize.md, color: colors.bubbleOtherText, lineHeight: 22 },
  typingBubble: { flexDirection: "row", alignItems: "center" },
  typingText: { marginLeft: spacing.sm, fontStyle: "italic" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: fontSize.md,
    color: colors.text,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginLeft: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: { opacity: 0.5 },
  sendText: { color: "#FFFFFF", fontWeight: "700", fontSize: fontSize.md },
});
