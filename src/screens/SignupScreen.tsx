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
import { useAuth } from '../hooks';
import { validateEmail } from '../utils/validations';
import { ThemedTextInput, ThemedButton, ThemedText } from '../components';
import { theme } from '../styles/theme';

type SignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Signup'
>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { isAuthenticated, signup, isLoading, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, navigating to Welcome screen');
      navigation.replace('Welcome', { email: email.trim() });
    }
  }, [isAuthenticated]);

  const handleSignup = () => {
    if (!email.trim() || !email.trim() || !password.trim()) { // || !confirmPassword.trim()
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // if (password !== confirmPassword) {
    //   Alert.alert('Error', 'Passwords do not match');
    //   return;
    // }

    // Email validation
    if (validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    signup({name, email: email.trim(), password})
      .catch((error) => {
        Alert.alert('Error', error.message);
      });;
  };

  const navigateToLogin = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ThemedText variant="heading1" style={styles.title}>Create Account</ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>Sign up to get started</ThemedText>

        <View style={styles.form}>
          <ThemedTextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={25}
          />

          <ThemedTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            maxLength={25}
          />

          <ThemedTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={35}
            showPasswordToggle
          />

          <ThemedButton
            title="Sign Up"
            variant="secondary"
            onPress={handleSignup}
            loading={isLoading}
            fullWidth
            style={styles.signupButton}
          />

          <View style={styles.loginContainer}>
            <ThemedText variant="body" color="textSecondary">Already have an account? </ThemedText>
            <ThemedButton
              title="Sign in"
              variant="outline"
              size="small"
              onPress={navigateToLogin}
              style={styles.loginButton}
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
  signupButton: {
    marginTop: theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  loginButton: {
    marginLeft: theme.spacing.xs,
    height: 30,
  },
});

export default SignupScreen;