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
  useColorScheme,
  View,
} from 'react-native';
import {Themes} from '../Components/Themes';
import {useNavigate} from 'react-router-native';
import {useContext, useEffect, useState} from 'react';
import {supabase} from '../Supabase/supabase';
import {AppContext} from '../Components/GlobalVariables';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

export default function Login() {
  const navigate = useNavigate();
  const {userUID, setUserUID, setPreloader} = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const [showPassword, setShowPassword] = useState(true);

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
    <ScrollView>
      <View style={[styles.container]}>
        <View>
          <View>
            <Text style={styles.firstTxt}>Login</Text>
            <Text style={styles.firstTxt}>to Your Account!</Text>
          </View>
          <View style={styles.inpView}>
            <Text style={styles.inpText}>Email</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder="owen@gmail.com"
              autoComplete="email"
              inputMode="email"
              numberOfLines={2}
              multiline={true}
              onChangeText={inp => setEmail(inp.trim())}
              value={email}></TextInput>
            <Text
              style={{
                display: emailValidation() ? 'flex' : 'none',
                color: Themes.colors.red,
                //fontFamily: Themes.fonts.text600,
                fontSize: 17,
              }}>
              {emailValidation()}
            </Text>
          </View>
          <View style={[styles.inpView, {marginTop: 5}]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.inpText}>Password</Text>
              {/* <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  // <Entypo
                  //   name="eye-with-line"
                  //   size={25}
                  //   color={Themes.colors.blue}
                  // />
                ) : (
                  // <Entypo name="eye" size={25} color={Themes.colors.blue} />
                )}
              </TouchableOpacity> */}
            </View>
            <TextInput
              style={styles.input}
              placeholder="password"
              //numberOfLines={2}
              secureTextEntry={showPassword}
              //multiline={true}
              onChangeText={inp => setPassword(inp.trim())}
              value={password}
              maxLength={30}></TextInput>
            <Text
              style={{
                display: passwordValidation() ? 'flex' : 'none',
                color: Themes.colors.red,
                //fontFamily: Themes.fonts.text600,
                fontSize: 17,
              }}>
              {passwordValidation()}
            </Text>
          </View>
          <TouchableOpacity style={styles.fgtPassword}>
            <Text style={styles.fgtText}>Forgot Password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={loginUser} style={styles.login}>
            <Text style={styles.lgnText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 5,
            justifyContent: 'center',
            marginVertical: 20,
          }}>
          <Text
            style={{
              color: Themes.colors.textColor,
              //fontFamily: Themes.fonts.text600,
              fontSize: 18,
            }}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigate('/SignUp')}
            style={styles.signup}>
            <Text style={styles.txtSignup}>Sign-Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior={
          Platform.OS === 'android' ? 'position' : 'height'
        }></KeyboardAvoidingView>
    </ScrollView>
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
    padding: 15,
    fontSize: 20,
    //fontFamily: Themes.fonts.text700,
    color: Themes.colors.textColor,
  },
  inpView: {
    marginVertical: 15,
    backgroundColor: Themes.colors.white,
    borderRadius: 15,
    padding: 15,
    shadowOffset: {height: 2, width: 2},
    shadowColor: Themes.colors.darkGray,
    shadowOpacity: 1,
    elevation: 20,
    marginTop: 30,
  },
  inpText: {
    fontSize: 18,
    color: Themes.colors.textColor,
    //fontFamily: Themes.fonts.text500,
  },
  login: {
    backgroundColor: Themes.colors.darkGray,
    padding: 10,
    borderRadius: 40,
    marginTop: 30,
  },
  lgnText: {
    textAlign: 'center',
    color: Themes.colors.brightCoral,
    fontSize: 23,
    //fontFamily: Themes.fonts.text400,
  },
  signup: {
    width: 100,
    padding: 5,
  },
  txtSignup: {
    fontSize: 20,
    //fontFamily: Themes.fonts.text900,
    color: Themes.colors.textColor,
  },
  firstTxt: {
    fontSize: 40,
    //fontFamily: Themes.fonts.text900,
    color: Themes.colors.textColor,
    textShadowColor: Themes.colors.textColor,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
  },
  fgtPassword: {
    width: '50%',
    margin: 5,
  },
  fgtText: {
    //fontFamily: Themes.fonts.text600,
    fontSize: 20,
    color: Themes.colors.red,
  },
});
