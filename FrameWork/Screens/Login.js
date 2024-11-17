import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigate} from 'react-router-native';
import {useContext, useState} from 'react';
import {supabase} from '../Supabase/supabase';
import {AppContext} from '../Components/GlobalVariables';
import {Themes} from '../Components/Themes';
import Svg, {Path} from 'react-native-svg';

// SVG Icons Components
const EmailIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
      fill={Themes.colors.darkGray}
    />
  </Svg>
);

const LockIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"
      fill={Themes.colors.darkGray}
    />
  </Svg>
);

const EyeIcon = ({show}) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d={
        show
          ? 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'
          : 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z'
      }
      fill={Themes.colors.darkGray}
    />
  </Svg>
);

export default function Login() {
  const navigate = useNavigate();
  const {userUID, setUserUID, setPreloader} = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const passwordValidation = () => {
    if (password.length === 0) {
    } else if (password.length < 5) {
      return 'Password must be at least 5 characters';
    } else if (!/[a-z]/.test(password)) {
      return 'Password must include at least one lowercase letter';
    } else if (!/[A-Z]/.test(password)) {
      return 'Password must include at least one uppercase letter';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must include at least one symbol';
    } else {
      return null;
    }
  };

  const emailValidation = () => {
    if (email.length === 0) {
    } else if (!email.includes('@')) {
      return "Email must include '@'";
    } else if (!email.includes('.')) {
      return "Email must include '.'";
    } else if (email.indexOf('@') > email.indexOf('.')) {
      return 'Invalid email format';
    } else if (!email.includes('@gmail.com')) {
      return "You're almost there";
    } else if (email.length < 11) {
      return 'Email must be at least 11 characters';
    } else {
      return null;
    }
  };

  // const [showPassword, setShowPassword] = useState(true);

  // async function loginUser() {
  //   let {data, error} = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });
  //   if (error) {
  //     Alert.alert(error.message);
  //   } else {
  //     setUserUID(data.session.user.id);
  //     navigate('/Home');
  //   }
  // }

  async function loginUser() {
    setPreloader(true);
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Error handling
      if (error) {
        setPreloader(false);
        throw new Error(error.message);
      }

      // // Ensure session exists
      // if (!data || !data.session) {
      //   throw new Error('Unable to retrieve session. Please try again.');
      // }

      // Set user UID and navigate to home
      if (data) {
        setPreloader(false);
        setUserUID(data.session.user.id);
        navigate('/Home'); // Ensure this route exists
      }
    } catch (error) {
      // Display error message
      Alert.alert('Login Failed', error.message);
    }
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Welcome Back!</Text>
          <Text style={styles.headerSubtitle}>
            Login to continue your journey
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <EmailIcon />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Themes.colors.darkGray}
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              onChangeText={inp => setEmail(inp.trim())}
              value={email}
            />
          </View>
          {emailValidation() && (
            <Text style={styles.errorText}>{emailValidation()}</Text>
          )}

          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <LockIcon />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Themes.colors.darkGray}
              secureTextEntry={showPassword}
              onChangeText={inp => setPassword(inp.trim())}
              value={password}
              maxLength={30}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <EyeIcon show={!showPassword} />
            </TouchableOpacity>
          </View>
          {passwordValidation() && (
            <Text style={styles.errorText}>{passwordValidation()}</Text>
          )}
          {/* 
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.loginButton} onPress={loginUser}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigate('/SignUp')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Themes.colors.backgroundColor,
  },
  container: {
    //flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 40 : 60,
    paddingHorizontal: 10,
  },
  headerContainer: {
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 42,
    fontFamily: Themes.fonts.extraBold,
    color: Themes.colors.textColor,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Themes.colors.darkGray,
    fontFamily: Themes.fonts.regular,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  iconContainer: {
    padding: 12,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: Themes.colors.darkGray,
    paddingVertical: 18,
    fontFamily: Themes.fonts.regular,
  },
  eyeIcon: {
    padding: 12,
  },
  errorText: {
    color: Themes.colors.red,
    fontSize: 14,
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 4,
    fontFamily: Themes.fonts.medium,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    //marginTop: 10,
    fontFamily: Themes.fonts.regular,
  },
  forgotPasswordText: {
    color: Themes.colors.red,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: Themes.colors.darkGray,
    borderRadius: 40,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: Themes.colors.white,
    fontSize: 18,
    fontFamily: Themes.fonts.extraBold,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  signupText: {
    color: Themes.colors.darkGray,
    fontSize: 16,
    fontFamily: Themes.fonts.bold,
  },
  signupLink: {
    color: Themes.colors.textColor,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
