import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  Platform,
  UIManager,
  useAnimatedValue,
  Animated,
} from 'react-native';
import {Themes} from '../Components/Themes';
import {AppContext} from '../Components/GlobalVariables';
import {supabase} from '../Supabase/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigate} from 'react-router-native';
import Svg, {Circle, Path} from 'react-native-svg';
import CustomBottomNavigator from '../Components/CustomBottomTab';
import CommentIcon from '../Components/CommentsIcon';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import messaging from '@react-native-firebase/messaging';
import {LayoutAnimation} from 'react-native';

// SVG icons
const SearchIcon = props => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
      stroke={Themes.colors.darkGray}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 21L16.65 16.65"
      stroke={Themes.colors.darkGray}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DocumentIcon = props => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke={Themes.colors.red}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 2V8H20"
      stroke={Themes.colors.red}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 13H8"
      stroke={Themes.colors.red}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 17H8"
      stroke={Themes.colors.red}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 9H9H8"
      stroke={Themes.colors.red}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronForwardIcon = props => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9 18L15 12L9 6"
      stroke={Themes.colors.darkGray}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const NotificationIcon = props => (
  <Svg width={30} height={30} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke={Themes.colors.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
      stroke={Themes.colors.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SvgView = Animated.createAnimatedComponent(Svg);

const SmileyIcon = () => {
  return (
    <SvgView height="30" width="30" viewBox="0 0 100 100">
      {/* Outer Circle (Face) */}
      <Circle
        cx="50"
        cy="50"
        r="45"
        stroke="gold"
        strokeWidth="5"
        fill="yellow"
      />

      {/* Left Eye */}
      <Circle cx="35" cy="40" r="5" fill="black" />

      {/* Right Eye */}
      <Circle cx="65" cy="40" r="5" fill="black" />

      {/* Mouth */}
      <Path
        d="M30 60 Q50 80 70 60"
        stroke="black"
        strokeWidth="3"
        fill="none"
      />
    </SvgView>
  );
};

export function Home() {
  const navigate = useNavigate();
  const {userUID, setUserInfo, reload, preloader, setPreloader, setUserUID} =
    useContext(AppContext);
  const [avatar_url, setAvatar_url] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);

  const userInfo = useMemo(
    () => ({avatar_url, username}),
    [avatar_url, username],
  );

  useEffect(() => {
    const retrieveData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data

        // Check the session directly from Supabase instead of AsyncStorage
        const {
          data: {session},
        } = await supabase.auth.getSession();

        if (!session?.user) {
          throw new Error('No user on the session!');
        }

        // Fetch the user's profile from the "profiles" table
        const {data, error, status} = await supabase
          .from('profiles')
          .select(`username, website, avatar_url, full_name, id`)
          .eq('id', session?.user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUserUID(session.user.id);
          setUserInfo(data); // Set the user information in context
          setAvatar_url(data.avatar_url);
          setUsername(data.username);
        }
      } catch (error) {
        setError(error.message); // Catch and set the error
      } finally {
        setLoading(false); // Turn off loading
      }
    };

    retrieveData();
  }, [userUID, reload]);

  const [myProjects, setMyProjects] = useState([]);
  // const [myFollowedProjects, setMyFollowedProjects] = useState([]);

  useEffect(() => {
    async function getProjects() {
      try {
        const {data, error, status} = await supabase
          .from('projects_info')
          .select(`*`)
          .contains('creators_id', [userUID]); // Use contains for array checking
        if (data) {
          setMyProjects(data);
          setFilteredData(data);
        } else if (error) {
          console.log(error);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    getProjects();
  }, [userUID, reload]);

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const [isHeight, setIsHeight] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);
  const currentPosition = useAnimatedValue(300);

  const changeDirection = () => {
    if (isAnimating) return;

    //currentPosition.setValue(100);
    Animated.timing(currentPosition, {
      toValue: 130,
      useNativeDriver: false,
      duration: 1000,
    }).start(() => {
      //setPreloader(true);
    });

    setIsAnimating(true);
    const customAnimation = {
      duration: 1000,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.opacity,
        springDamping: 0.7,
      },
      delete: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
    };

    // Configure and trigger the animation
    LayoutAnimation.configureNext(
      customAnimation,

      () => {
        // Animation completion callback
        setIsAnimating(false);
        // currentPosition.setValue(300); // Reset the scroll position
        Animated.timing(currentPosition, {
          toValue: 200,
          useNativeDriver: false,
          duration: 1000,
        }).start(() => {
          //setPreloader(false);
        });
      },
      error => console.warn('Animation failed:', error),
    );

    // Update the state after configuring animation
    setIsHeight(prevState => !prevState);
  };

  // Add scroll debouncing
  let scrollTimeout;
  const scrollUp = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      changeDirection();
    }, 200); // Debounce time in ms
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  const shiftLeft = useAnimatedValue(0);

  useEffect(() => {
    const startScrolling = Animated.timing(shiftLeft, {
      toValue: 1,
      useNativeDriver: false,
      duration: 2000,
      delay: 500,
    });

    Animated.loop(startScrolling, {iterations: 1}).start();
  }, [isHeight]);

  const studentTexts = () => {
    const studentMessages = [
      '📚 ',
      '💪 ',
      '✨ ',
      '🌟 ',
      '⏰ ',
      '🧘‍♂️ ',
      '🌈 ',
      '🚀 ',
      '📖 ',
      '🏆 ',
    ];

    const randomIndex = Math.floor(Math.random() * studentMessages.length);
    for (let i = 0; i <= studentMessages.length; i++) {
      return studentMessages[randomIndex];
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = text => {
    setSearchQuery(text);
    const filtered = myProjects.filter(
      item => item.topic.toLowerCase().includes(text.toLowerCase()),
      // item.topic.toUpperCase().includes(text.toUpperCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={scrollUp}>
        <View>
          <LinearGradient
            colors={[Themes.colors.red, Themes.colors.darkGray]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={[styles.header, {flex: 1}]}>
            <View style={[styles.headerContent, {position: 'relative'}]}>
              <Animated.View
                style={{
                  // borderWidth: 4,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  position: 'absolute',
                  width: '100%',
                  alignSelf: 'center',
                  bottom: currentPosition,
                }}>
                {/* <LottieView
                  source={require('../../assets/animations/emptyPro.json')}
                  autoPlay
                  loop
                  style={{height: 80, width: 80}}
                /> */}
                <View
                  style={{
                    marginVertical: 10,
                    flexDirection: 'row',
                    // columnGap: 10,
                    justifyContent: 'space-between',
                  }}>
                  <Animated.View
                    style={{
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        color: Themes.colors.white,
                        fontFamily: Themes.fonts.regular,
                      }}>
                      {studentTexts()} Loading
                    </Text>
                  </Animated.View>
                </View>
              </Animated.View>
              <View style={styles.headerTop}>
                <View>
                  <Text style={styles.welcomeText}>Welcome back,</Text>
                  <Text
                    style={[
                      styles.welcomeText,
                      {fontSize: 20, fontFamily: Themes.fonts.medium},
                    ]}>
                    {loading ? 'Fetching' : username || 'User'}!
                  </Text>
                </View>

                <View />
              </View>
              <View style={styles.searchContainer}>
                <SearchIcon style={styles.searchIcon} />
                <TextInput
                  placeholder="Search records"
                  placeholderTextColor={Themes.colors.darkGray}
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={{paddingHorizontal: 10}}>
          {filteredData.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => navigate('/Editor')}
                key={item.id || index.toString()}
                style={{
                  //borderWidth: 4,
                  width: '90%',
                  alignSelf: 'center',
                  marginVertical: 15,
                  paddingVertical: 30,
                  paddingHorizontal: 35,
                  borderRadius: 20,
                  shadowOffset: [{height: 0, width: 0}],
                  elevation: 10,
                  shadowColor: Themes.colors.darkGray,
                  backgroundColor: Themes.colors.white,
                }}>
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 18,
                    fontFamily: Themes.fonts.bold,
                  }}>
                  You
                </Text>
                <Text
                  style={{
                    marginVertical: 20,
                    fontFamily: Themes.fonts.regular,
                    fontSize: 18,
                    color: Themes.colors.darkGray,
                  }}>
                  Topic: {item.topic}
                </Text>
                <Text
                  style={{
                    fontFamily: Themes.fonts.regular,
                    fontSize: 18,
                  }}>
                  {item.description}
                </Text>
                <Text style={{textAlign: 'right', marginTop: 10, fontSize: 15}}>
                  🎉🎉🎉
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <CustomBottomNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.backgroundColor,
  },
  welcomeText: {
    color: Themes.colors.white,
    fontSize: 17,
    fontFamily: Themes.fonts.bold,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  appName: {
    fontSize: 35,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.mediumItalic,
  },
  notificationIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Themes.colors.white,
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: Themes.fonts.regular,
  },
  content: {
    padding: 20,
  },
});
