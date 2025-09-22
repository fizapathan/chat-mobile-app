import { StyleSheet, Text, View } from "react-native";
import { useTyping } from "../hooks";
import { memo } from "react";

const TypingIndicator = ({typingUsers}: {typingUsers: string[]}) => {
  // const { typingUsers } = useTyping();
console.log("typing..", typingUsers)
  return (
    <>
      {typingUsers.length > 0 && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>
            {typingUsers.length === 1
              ? `${typingUsers[0]} ${typingUsers[0] === 'You' ? 'are' : 'is'} typing...`
              : typingUsers.length === 2
                ? `${typingUsers.join(' and ')} are typing...`
                : `${typingUsers.slice(0, 2).join(', ')} and ${typingUsers.length - 2} others are typing...`
            }
          </Text>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({

  typingIndicator: {
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
})

const areEqual = (prev: { typingUsers: string[] }, next: { typingUsers: string[] }) => {
  return JSON.stringify(prev.typingUsers) === JSON.stringify(next.typingUsers);
}

export default memo(TypingIndicator, areEqual);