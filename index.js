/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  NativeRouter,
  Route,
  Link,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BackHandler} from 'react-native';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import WelcomeScreen from './FrameWork/Screens/WelcomeScreen';
import Login from './FrameWork/Screens/Login';
import {Home} from './FrameWork/Screens/HomeScreen';
import CreateProject from './FrameWork/Screens/CreateProject';
import Profile from './FrameWork/Screens/Profile';
import {SignUp} from './FrameWork/Screens/SignUp';
import AdvancedTextEditor from './FrameWork/Screens/Editor';
import Comments from './FrameWork/Screens/Comments';
import Notifications from './FrameWork/Screens/Notifications';
import {AppProvider} from './FrameWork/Components/GlobalVariables';
import {Themes} from './FrameWork/Components/Themes';
import {AndroidColor} from '@notifee/react-native';
import notifee, {
  AndroidImportance,
  EventType,
  AndroidStyle,
} from '@notifee/react-native';

const MainApp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const backAction = () => {
      const exitScreens = ['/Home', '/Create', '/Profile'];
      if (exitScreens.includes(location.pathname)) {
        BackHandler.exitApp();
        return true;
      } else {
        navigate(-1);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigate, location]);

  // Handles when the app is in background
  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS && detail.pressAction.id === 'default') {
      navigate('/Editor'); // Navigate to the Editor screen
    }
  });

  // Handles when the app is in foreground
  notifee.onForegroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS && detail.pressAction.id === 'default') {
      navigate('/Editor'); // Navigate to the Editor screen
    }
  });

  // Handles when the app was launched from a terminated state
  useEffect(() => {
    async function checkInitialNotification() {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification?.pressAction?.id === 'default') {
        navigate('/Editor'); // Navigate if the app was opened by this action
      }
    }
    checkInitialNotification();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Create" element={<CreateProject />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Editor" element={<AdvancedTextEditor />} />
      <Route path="/Comments" element={<Comments />} />
      <Route path="/Notifications" element={<Notifications />} />
    </Routes>
  );
};

function App() {
  // // Remove this method to stop OneSignal Debugging
  // OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // // OneSignal Initialization
  // OneSignal.initialize('c36ab60d-9ec0-4943-903c-b96e3753cd51');

  // // requestPermission will show the native iOS or Android notification permission prompt.
  // // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  // OneSignal.Notifications.requestPermission(true);

  // // Method for listening for notification clicks
  // OneSignal.Notifications.addEventListener('click', event => {
  //   console.log('OneSignal: notification clicked:', event);
  // });

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NativeRouter>
          <SafeAreaView style={[{flex: 1}]}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={Themes.colors.red}
            />

            <MainApp />
          </SafeAreaView>
        </NativeRouter>
      </AppProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
