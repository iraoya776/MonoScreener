import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Themes} from '../Components/Themes';
import {Entypo} from '@expo/vector-icons';
import {useContext, useEffect, useState} from 'react';
import {supabase} from '../Supabase/supabase';
import {AppContext} from '../Components/GlobalVariables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {useNavigate} from 'react-router-native';

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

  // async function signUpWithEmail() {
  //   try {
  //     // Step 1: Sign up the user
  //     const {data, error} = await supabase.auth.signUp({
  //       email: email,
  //       password: password,
  //       options: {
  //         data: {
  //           full_name: fullName,
  //           username: userName,
  //           gender: selectedGender,
  //         },
  //       },
  //     });

  //     if (error) throw error;

  //     if (!data?.user) throw new Error('No user data returned from sign up.');

  //     // Step 2: Set the user ID in context and AsyncStorage
  //     setUserUID(data.user.id);
  //     await AsyncStorage.setItem('session', JSON.stringify(data));

  //     // Step 3: Create or update the user's profile
  //     const {error: profileError} = await supabase.from('profiles').upsert({
  //       id: data.user.id,
  //       username: userName,
  //       full_name: fullName,
  //       website: 'null',
  //       avatar_url:
  //         'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1725801336~exp=1725804936~hmac=fc526ae5173184a7d485674cf33c52bbc239a3ab707780118517f0dcc9a330c7&w=740',
  //       updated_at: new Date().toISOString(),
  //       email: email,
  //       gender: selectedGender,
  //     });

  //     if (profileError) throw profileError;

  //     // If everything is successful, you might want to navigate to a new screen
  //     navigate('/home'); // Adjust this based on your app's routing
  //   } catch (error) {
  //     Alert.alert('Error', error.message);
  //   }
  // }

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
      keyboardVerticalOffset={0}
      behavior={Platform.OS === 'android' ? 'position' : 'height'}>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <Text style={styles.firstTxt}>Create Your</Text>
            <Text style={styles.firstTxt}>Account!</Text>
            <View style={{marginTop: 20}}>
              <View style={[styles.input, {marginTop: 10}]}>
                <Text style={styles.inpHeader}>Full Name</Text>
                <TextInput
                  placeholder="Owen Iraoya"
                  inputMode="text"
                  autoCapitalize="words"
                  autoComplete="name"
                  style={styles.txtInput}
                  onChangeText={inp => setFullName(inp.trim())}></TextInput>
                <Text
                  style={[
                    styles.error,
                    {display: fullNameValidation() ? 'flex' : 'none'},
                  ]}>
                  {fullNameValidation()}
                </Text>
              </View>
              <View style={styles.input}>
                <Text style={styles.inpHeader}>User Name</Text>
                <TextInput
                  placeholder="owen23"
                  autoCapitalize="none"
                  style={styles.txtInput}
                  onChangeText={inp => setUserName(inp.trim())}
                  value={userName}></TextInput>
                <Text
                  style={[
                    styles.error,
                    {display: userNameValidation() ? 'flex' : 'none'},
                  ]}>
                  {userNameValidation()}
                </Text>
              </View>
              <View style={styles.input}>
                <Text style={styles.inpHeader}>Gender</Text>
                <Picker
                  selectedValue={selectedGender}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedGender(itemValue)
                  }>
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>
              </View>
              <View style={styles.input}>
                <Text style={styles.inpHeader}>Email</Text>
                <TextInput
                  placeholder="owen@gmail.com"
                  inputMode="email"
                  style={styles.txtInput}
                  onChangeText={inp => setEmail(inp.trim())}
                  value={email}></TextInput>
                <Text
                  style={[
                    styles.error,
                    {display: emailValidation() ? 'flex' : 'none'},
                  ]}>
                  {emailValidation()}
                </Text>
              </View>
              <View style={styles.input}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.inpHeader}>Password</Text>
                  {/* <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Entypo
                        name="eye-with-line"
                        size={25}
                        color={Themes.colors.blue}
                      />
                    ) : (
                      <Entypo name="eye" size={25} color={Themes.colors.blue} />
                    )}
                  </TouchableOpacity> */}
                </View>
                <TextInput
                  secureTextEntry={showPassword}
                  placeholder="* * * * * * * * * * * * * * * * * * * * *"
                  style={styles.txtInput}
                  onChangeText={inp => setPassword(inp.trim())}
                  value={password}></TextInput>
                <Text
                  style={[
                    styles.error,
                    {display: passwordValidation() ? 'flex' : 'none'},
                  ]}>
                  {passwordValidation()}
                </Text>
              </View>
              <View style={styles.input}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.inpHeader}>Confirm Password</Text>
                  {/* <TouchableOpacity
                    onPress={() => setConfirmPassword(!confirmPassword)}
                  >
                    {confirmPassword ? (
                      <Entypo
                        name="eye-with-line"
                        size={25}
                        color={Themes.colors.blue}
                      />
                    ) : (
                      <Entypo name="eye" size={25} color={Themes.colors.blue} />
                    )}
                  </TouchableOpacity> */}
                </View>
                <TextInput
                  secureTextEntry={confirmPassword}
                  placeholder="* * * * * * * * * * * * * * * * * * * * *"
                  style={styles.txtInput}
                  onChangeText={inp => setFinalPassword(inp.trim())}
                  value={finalPassword}></TextInput>
                <Text
                  style={[
                    styles.error,
                    {display: finalPasswordVal() ? 'flex' : 'none'},
                  ]}>
                  {finalPasswordVal()}
                </Text>
              </View>
            </View>
            <View style={{marginTop: 40}}>
              <TouchableOpacity
                onPress={signUpWithEmail}
                style={styles.lastTouch}>
                <Text style={styles.signUp}>Sign-Up</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
              marginTop: 20,
              columnGap: 5,
            }}>
            <Text style={styles.question}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.lstBtn}>
              <Text style={styles.lastTxt}>Login</Text>
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
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : null,
    padding: 10,
    backgroundColor: Themes.colors.backgroundColor,
  },
  input: {
    backgroundColor: Themes.colors.white,
    borderRadius: 15,
    padding: 15,
    shadowOffset: {height: 2, width: 2},
    shadowColor: '#000',
    shadowOpacity: 1,
    elevation: 20,
    marginTop: 20,
  },
  txtInput: {
    fontSize: 20,
    padding: 15,
    fontFamily: Themes.fonts.text700,
    color: Themes.colors.textColor,
  },
  inpHeader: {
    fontSize: 18,
    color: Themes.colors.textColor,
    fontFamily: Themes.fonts.text500,
  },
  firstTxt: {
    fontSize: 40,
    fontFamily: Themes.fonts.text900,
    color: Themes.colors.textColor,
    textShadowColor: Themes.colors.textColor,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  lastTouch: {
    backgroundColor: Themes.colors.darkGray,
    padding: 10,
    borderRadius: 40,
  },
  signUp: {
    textAlign: 'center',
    color: Themes.colors.white,
    fontSize: 23,
    fontFamily: Themes.fonts.text400,
  },
  question: {
    fontSize: 18,
    color: Themes.colors.textColor,
    fontFamily: Themes.fonts.text600,
  },
  lastTxt: {
    fontSize: 23,
    fontFamily: Themes.fonts.text800,
    color: Themes.colors.blue,
  },
  error: {
    color: Themes.colors.red,
    fontFamily: Themes.fonts.text600,
    fontSize: 17,
  },
});
