/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import React, {useContext, useEffect, useState, useRef} from 'react';
import {SafeAreaView, StatusBar, BackHandler, AppState} from 'react-native';

import {
  NativeRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import notifee, {
  AndroidImportance,
  EventType,
  AndroidStyle,
  AuthorizationStatus,
} from '@notifee/react-native';
import {supabase} from './FrameWork/Supabase/supabase';
import {RootSiblingParent} from 'react-native-root-siblings';

// Import your components
import WelcomeScreen from './FrameWork/Screens/WelcomeScreen';
import Login from './FrameWork/Screens/Login';
import {Home} from './FrameWork/Screens/HomeScreen';
import CreateProject from './FrameWork/Screens/CreateProject';
import Profile from './FrameWork/Screens/Profile';
import {SignUp} from './FrameWork/Screens/SignUp';
import AdvancedTextEditor from './FrameWork/Screens/Editor';
import Comments from './FrameWork/Screens/Comments';
import {AppContext, AppProvider} from './FrameWork/Components/GlobalVariables';
import {Themes} from './FrameWork/Components/Themes';
import SendRequest from './FrameWork/Screens/SendRequest';
import NotificationService from './FrameWork/Components/Notifications';
import {Preloader} from './FrameWork/Components/Preloader';
import ConfirmationScreen from './FrameWork/Screens/Confirmation';
import NotificationsScreen from './FrameWork/Screens/NotificationsScreen';
import EditProfile from './FrameWork/Screens/EditProfile';
import DraggableBox from './FrameWork/Screens/Responder';

const MainApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {userUID} = useContext(AppContext);
  const [commentList, setCommentList] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const backAction = () => {
      const exitScreens = ['/Home', '/Create', '/Profile'];
      if (exitScreens.includes(location.pathname)) {
        BackHandler.exitApp();
        return true;
      }
      navigate(-1);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigate, location]);

  // Notification event handlers

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SendRequest" element={<SendRequest />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Create" element={<CreateProject />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Editor" element={<AdvancedTextEditor />} />
      <Route path="/Comments" element={<Comments />} />
      <Route path="/Notifications" element={<NotificationsScreen />} />
      <Route path="/Confirmation" element={<ConfirmationScreen />} />
      <Route path="/EditProfile" element={<EditProfile />} />
      <Route path="/Responder" element={<DraggableBox />} />
    </Routes>
  );
};

function App() {
  return (
    <RootSiblingParent>
      <SafeAreaProvider>
        <AppProvider>
          <NativeRouter>
            <SafeAreaView style={{flex: 1}}>
              <StatusBar
                barStyle="light-content"
                backgroundColor={Themes.colors.red}
              />

              <MainApp />
              <Preloader />
            </SafeAreaView>
          </NativeRouter>
        </AppProvider>
      </SafeAreaProvider>
    </RootSiblingParent>
  );
}

AppRegistry.registerComponent(appName, () => App);
