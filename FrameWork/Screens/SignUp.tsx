import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useContext, useState } from 'react';
import { supabase } from '../Supabase/supabase';
import { AppContext } from '../Components/GlobalVariables';
import { Picker } from '@react-native-picker/picker';
import { useNavigate } from 'react-router-native';
import Svg, { Path } from 'react-native-svg';
import { Themes } from '../Components/Themes';

const UserIcon = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EmailIcon = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 6L12 13L2 6"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LockIcon = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export function SignUp() {
 
const navigate = useNavigate();

const {userUID, setUserUID} = useContext(AppContext);

const [showPassword, setShowPassword] = useState(true);
const [confirmPassword, setConfirmPassword] = useState(true);

const [fullName, setFullName] = useState('');
const [selectedGender, setSelectedGender] = useState();
const [userName, setUserName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [finalPassword, setFinalPassword] = useState('');

const fullNameValidation = () => {
  if (!fullName.trim()) {
    return null; // Return null if full name is empty
  }
  const fullNameArray = fullName.split(' ');
  if (fullNameArray.length !== 2) {
    return 'Keep going! Full name must be in the format "First-Name / Last-Name"';
  }
  if (fullNameArray[0].length < 3 || fullNameArray[1].length < 3) {
    return 'Keep going! First name and last name must be at least 3 characters';
  }
  return null;
};

function userNameValidation() {
  if (userName.length < 1) {
  } else if (userName.length > 0 && userName.length < 4) {
    return 'User name must be at least 4 characters';
  } else if (userName.length >= 4) {
  } else {
    return null;
  }
}

const emailValidation = () => {
  if (email.length === 0) {
  } else if (email.length < 11) {
    return 'Email must be at least 11 characters';
  } else if (!email.includes('@')) {
    return "Email must include '@'";
  } else if (!email.includes('.')) {
    return "Email must include '.'";
  } else if (email.indexOf('@') > email.indexOf('.')) {
    return 'Invalid email format';
  } else if (!email.includes('@gmail.com')) {
    return "You're almost there";
  } else {
    return null;
  }
};

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

const finalPasswordVal = () => {
  if (finalPassword !== password) {
    return 'Keep going! Passwords do not match';
  } else if (finalPassword === password) {
    return null;
  }
};


async function signUpWithEmail() {
  try {
    // Step 1: Sign up the user and get session data
    const {data, error} = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          username: userName,
          gender: selectedGender,
        },
      },
    });

    if (error) throw error;

    if (!data?.user) throw new Error('No user data returned from sign up.');

    // Step 2: Set the user ID in context
    setUserUID(data.user.id);

    // Step 3: Create or update the user's profile
    const {error: profileError} = await supabase.from('profiles').upsert({
      id: data.user.id,
      username: userName,
      full_name: fullName,
      website: 'null',
      avatar_url:
        'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1725801336~exp=1725804936~hmac=fc526ae5173184a7d485674cf33c52bbc239a3ab707780118517f0dcc9a330c7&w=740',
      updated_at: new Date().toISOString(),
      email: email,
      gender: selectedGender,
    });

    if (profileError) throw profileError;

    // Step 4: Navigate after successful sign-up
    navigate('/home'); // Adjust this based on your app's routing
  } catch (error) {
    Alert.alert('Error', error.message);
  }
}

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Welcome!</Text>
          <Text style={styles.headerSubtitle}>Create your account</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.iconContainer}>
              <UserIcon style={styles.icon} />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Full Name"
                style={styles.input}
                onChangeText={inp => setFullName(inp.trim())}
                placeholderTextColor="#666"
              />
            </View>
          </View>
          {fullNameValidation() && (
            <Text style={styles.errorText}>{fullNameValidation()}</Text>
          )}

          <View style={styles.inputGroup}>
            <View style={styles.iconContainer}>
              <UserIcon style={styles.icon} />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Username"
                style={styles.input}
                onChangeText={inp => setUserName(inp.trim())}
                value={userName}
                placeholderTextColor="#666"
              />
            </View>
          </View>
          {userNameValidation() && (
            <Text style={styles.errorText}>{userNameValidation()}</Text>
          )}

          <View style={[styles.inputGroup, styles.pickerContainer]}>
            <Picker
              selectedValue={selectedGender}
              onValueChange={setSelectedGender}
              style={styles.picker}>
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.iconContainer}>
              <EmailIcon style={styles.icon} />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Email"
                style={styles.input}
                onChangeText={inp => setEmail(inp.trim())}
                value={email}
                keyboardType="email-address"
                placeholderTextColor="#666"
              />
            </View>
          </View>
          {emailValidation() && (
            <Text style={styles.errorText}>{emailValidation()}</Text>
          )}

          <View style={styles.inputGroup}>
            <View style={styles.iconContainer}>
              <LockIcon style={styles.icon} />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Password"
                style={styles.input}
                onChangeText={inp => setPassword(inp.trim())}
                value={password}
                secureTextEntry={showPassword}
                placeholderTextColor="#666"
              />
            </View>
          </View>
          {passwordValidation() && (
            <Text style={styles.errorText}>{passwordValidation()}</Text>
          )}

          <View style={styles.inputGroup}>
            <View style={styles.iconContainer}>
              <LockIcon style={styles.icon} />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Confirm Password"
                style={styles.input}
                onChangeText={inp => setFinalPassword(inp.trim())}
                value={finalPassword}
                secureTextEntry={confirmPassword}
                placeholderTextColor="#666"
              />
            </View>
          </View>
          {finalPasswordVal() && (
            <Text style={styles.errorText}>{finalPasswordVal()}</Text>
          )}

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={signUpWithEmail}>
            <Text style={styles.signUpButtonText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigate('/login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.backgroundColor,
  },
  headerContainer: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: Themes.colors.red,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 42,
    // fontWeight: 'bold',
    color: Themes.colors.white,
    marginBottom: 5,
    fontFamily: Themes.fonts.extraBold
  },
  headerSubtitle: {
    fontSize: 18,
    color: Themes.colors.white,
    opacity: 0.8,
    fontFamily: Themes.fonts.regular
  },
  formContainer: {
    padding: 24,
    paddingTop: 32,
  },
  inputGroup: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  icon: {
    color: Themes.colors.darkGray,
  },
  inputWrapper: {
    //flex: 1,
  },
  input: {
    padding: 12,
    fontSize: 16,
    color: Themes.colors.darkGray,
    fontFamily: Themes.fonts.regular
  },
  pickerContainer: {
    paddingHorizontal: 12,
  },
  picker: {
    flex: 1,
    color: '#333',
  },
  errorText: {
    color: Themes.colors.red,
    fontSize: 14,
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 12,
    fontFamily:Themes.fonts.regular
  },
  signUpButton: {
    backgroundColor: Themes.colors.darkGray,
    borderRadius: 40,
    padding: 16,
    marginTop: 24,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  loginText: {
    color: Themes.colors.darkGray,
    fontSize: 16,
  },
  loginLink: {
    color: Themes.colors.darkGray,
    fontSize: 18,
    // fontWeight: 'bold',
    marginLeft: 8,
    fontFamily:Themes.fonts.extraBold
  },
});
