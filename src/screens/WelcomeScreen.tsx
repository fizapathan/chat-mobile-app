import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useAuth, useMessages, useSocket } from '../hooks';
import Chats from '../components/Chats';

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

  const [messageText, setMessageText] = React.useState('');

  const { logout, isLoading } = useAuth();
  const { connect, sendMessage, isConnecting } = useSocket();
  const { messages, addMessage } = useMessages();
  const { user } = useAuth();

  useEffect(() => {
    connect()
  }, []);

  const send = () => {
    if (!messageText.trim() || !user) {
      return;
    }
    sendMessage({ text: messageText.trim() });
    addMessage({ text: messageText.trim(), id: user.email, senderId: user.id, timestamp: Date.now().toString(), messageType: 'text', isRead: false });
    setMessageText('');
  }

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {isConnecting && <View style={{ position: 'absolute', top: 0, width: '100%', alignItems: 'center', paddingVertical: 4, backgroundColor: 'red' }}>
        <Text>Connecting...</Text>
      </View>}
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome!</Text>
          {user?.name && (
            <Text style={styles.emailText}>Hello, {user.name}</Text>
          )}
          <Chats messages={messages} />
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.input}
              placeholder="email"
              placeholderTextColor="#999"
              value={messageText}
              onChangeText={setMessageText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={{ marginLeft: 8, paddingHorizontal: 12, justifyContent: 'center' }} onPress={send}>
              <Text style={[{color: 'blue'}]}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            {isLoading && <ActivityIndicator animating={true} color="#fff" size={25} style={{ marginRight: 8 }} />}
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  actionSection: {
    paddingBottom: 20,
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
    height: 50,
    borderRadius: 8,
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