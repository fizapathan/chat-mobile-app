import React, { useEffect, useState } from 'react';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../utils/validations';
import { ThemedTextInput, ThemedButton, ThemedText } from '../components';
import { theme } from '../styles/theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isAuthenticated, login, isLoading, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, navigating to Welcome screen');
      navigation.replace('Welcome', { email: email.trim() });
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    if (validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    console.log('Attempting login with email:', email);
    // Call the login function from the useAuth hook
    login({ email, password })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  const navigateToSignup = () => {
    navigation.replace('Signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ThemedText variant="heading1" style={styles.title}>Welcome Back</ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>Sign in to your account</ThemedText>

        <View style={styles.form}>
          <ThemedTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <ThemedTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <ThemedButton
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={styles.loginButton}
          />

          <View style={styles.signupContainer}>
            <ThemedText variant="body" color="textSecondary">Don't have an account? </ThemedText>
            <ThemedButton
              title="Sign up"
              variant="outline"
              size="small"
              onPress={navigateToSignup}
              style={styles.signupButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: theme.spacing.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  signupButton: {
    marginLeft: theme.spacing.xs,
    height: 30,
  },
});

export default LoginScreen;