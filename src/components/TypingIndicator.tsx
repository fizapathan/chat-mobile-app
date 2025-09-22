import { StyleSheet, View } from "react-native";
import { memo } from "react";
import { ThemedText } from "./common";
import { theme } from "../styles/theme";

const TypingIndicator = ({typingUsers}: {typingUsers: string[]}) => {
  // const { typingUsers } = useTyping();
console.log("typing..", typingUsers)
  return (
    <>
      {typingUsers.length > 0 && (
        <View style={styles.typingIndicator}>
          <ThemedText variant="caption" color="textSecondary" style={styles.typingText}>
            {typingUsers.length === 1
              ? `${typingUsers[0]} ${typingUsers[0] === 'You' ? 'are' : 'is'} typing...`
              : typingUsers.length === 2
                ? `${typingUsers.join(' and ')} are typing...`
                : `${typingUsers.slice(0, 2).join(', ')} and ${typingUsers.length - 2} others are typing...`
            }
          </ThemedText>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  typingIndicator: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
  },
  typingText: {
    fontStyle: 'italic',
  },
})

const areEqual = (prev: { typingUsers: string[] }, next: { typingUsers: string[] }) => {
  return JSON.stringify(prev.typingUsers) === JSON.stringify(next.typingUsers);
}

export default memo(TypingIndicator, areEqual);