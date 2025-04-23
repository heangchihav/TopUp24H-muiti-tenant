import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

interface Props {
  visible: boolean;
  action: string; // "login" or "signup"
  onClose: () => void;
}

const LoginSignupModal: React.FC<Props> = ({ visible, onClose, action }) => {
  const [authOption, setAuthOption] = useState<string>(action);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // To store error message
  const { login, signup } = useAuth();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    setError(null); // Reset error message on submit

    try {
      const success =
        authOption === 'login'
          ? await login(username, password)
          : await signup(username, password);

      if (success) {
        onClose();
        navigation.navigate('index' as never);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (visible) {
      setAuthOption(action); // reset option on modal open
      setUsername('');
      setPassword('');
      setError(null); // Reset error on modal open
    }
  }, [visible, action]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.blurWrapper}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalCenter}>
              <TouchableWithoutFeedback>
                <View style={styles.modalBox}>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>

                  <Image
                    source={{ uri: 'https://i.imgur.com/QnX5mel.png' }}
                    style={styles.icon}
                  />

                  <Text style={styles.title}>
                    {authOption === 'login' ? 'LOGIN NOW' : 'SIGN UP'}
                  </Text>

                  <View style={styles.inputWrapper}>
                    <FontAwesome name="user" size={20} color="#888" style={styles.iconInput} />
                    <TextInput
                      placeholder="Username"
                      value={username}
                      onChangeText={setUsername}
                      style={styles.input}
                      placeholderTextColor="#666"
                    />
                  </View>

                  {error && !username && (
                    <Text style={styles.errorText}>{error}</Text>
                  )}

                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="lock-outline" size={20} color="#888" style={styles.iconInput} />
                    <TextInput
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      style={styles.input}
                      secureTextEntry
                      placeholderTextColor="#666"
                    />
                  </View>

                  {error && !password && (
                    <Text style={styles.errorText}>{error}</Text>
                  )}

                  <View style={styles.switchText}>
                    <Text style={styles.text}>
                      {authOption === 'login' ? "Don't have an account?" : 'Already have an account?'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setAuthOption(authOption === 'login' ? 'signup' : 'login')}
                    >
                      <Text style={styles.link}>
                        {authOption === 'login' ? ' Sign up' : ' Login'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Submit */}
                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <LinearGradient colors={['#0072ff', '#00c6ff']} style={styles.gradient}>
                      <Text style={styles.submitText}>
                        {authOption === 'login' ? 'Login' : 'Sign Up'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <Text style={styles.or}>────────── or ──────────</Text>

                  <TouchableOpacity style={styles.googleButton}>
                    <Image
                      source={{ uri: 'https://i.imgur.com/qaTnbcx.png' }}
                      style={styles.googleIcon}
                    />
                    <Text style={styles.googleText}>Continue with Google</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LoginSignupModal;

const styles = StyleSheet.create({
  blurWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    width: 30,
    height: 30,
  },
  modalCenter: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalBox: {
    backgroundColor: '#f3f8f6',
    borderRadius: 20,
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 4,
  },
  icon: {
    width: 500,
    height: 50,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4dfe7',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 8,
    width: '100%',
  },
  iconInput: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  switchText: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  text: {
    color: '#444',
  },
  link: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  submitButton: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  gradient: {
    padding: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  or: {
    marginVertical: 10,
    color: '#888',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 3,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  googleText: {
    marginLeft: 10,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
});
