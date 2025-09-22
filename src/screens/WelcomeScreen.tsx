import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useAuth, useMessages, useSocket } from '../hooks';
import { Chats } from '../components';
import MessageInput from '../components/MessageInput';


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

  useEffect(() => {
    if(isConnected && user) fetchUsers(user.id);
  }, [isConnected]);

  const handleLogout = () => logout();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{isLoading ? <ActivityIndicator animating={true} color="#fff" size={25} style={{ marginRight: 8 }} /> : '⏻'}</Text>
        </TouchableOpacity>
      </View>
      {isConnecting && <View style={{ position: 'absolute', top: 0, width: '100%', alignItems: 'center', paddingVertical: 4, backgroundColor: 'red' }}>
        <Text>Connecting...</Text>
      </View>}
      <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
          >
        {/* <UsersList /> */}
        <Chats />
        <MessageInput />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emailText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  messageSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    backgroundColor: '#9cd5faff',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
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