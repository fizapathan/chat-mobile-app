import React, { useEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useAuth, useMessages, useSocket } from '../hooks';
import { Chats, ThemedButton, ThemedText } from '../components';
import MessageInput from '../components/MessageInput';
import { theme } from '../styles/theme';


type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

type WelcomeScreenRouteProp = RouteProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
  route: WelcomeScreenRouteProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params || {};

  const { logout, isLoading, isAuthenticated } = useAuth();
  const { connect, isConnecting, isConnected, fetchUsers, disconnect } = useSocket();
  const { clearMessages } = useMessages();
  const { user } = useAuth();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      clearMessages();
      navigation.replace('Login');
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   if(isConnected && user) fetchUsers(user.id);
  // }, [isConnected]);

  const handleLogout = () => logout();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{isLoading ? <ActivityIndicator animating={true} color="#fff" size={25} style={{ marginRight: 8 }} /> : '⏻'}</Text>
        </TouchableOpacity>
      </View>
      {isConnecting && (
        <View style={styles.connectingIndicator}>
          <ThemedText variant="caption" color="textPrimary">Connecting...</ThemedText>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Chats />
        <MessageInput />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  connectingIndicator: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.warning,
    zIndex: 1000,
  },
  content: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#691913ff',
    height: 32,
    minWidth: 32,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;