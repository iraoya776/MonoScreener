import React, {useContext, useEffect, useMemo, useState} from 'react';
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
} from 'react-native';
import {Themes} from '../Components/Themes';
import {AppContext} from '../Components/GlobalVariables';
import {supabase} from '../Supabase/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigate} from 'react-router-native';
import Svg, {Path} from 'react-native-svg';
import CustomBottomNavigator from '../Components/CustomBottomTab';
import CommentIcon from '../Components/CommentsIcon';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import {AndroidColor} from '@notifee/react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';

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

// async function onDisplayNotification() {
//   // Request permissions (required for iOS)
//   await notifee.requestPermission();

//   // Create a channel (required for Android)
//   const channelId = await notifee.createChannel({
//     id: 'default',
//     name: 'Default Channel',
//     importance: AndroidImportance.HIGH, // Set importance for heads-up notifications
//   });

//   // Display a notification
//   await notifee.displayNotification({
//     title: 'Notification Title',
//     body: 'Main body content of the notification',
//     android: {
//       channelId,
//       smallIcon: 'ic_notification', // Optional, defaults to 'ic_launcher'
//       pressAction: {
//         id: 'default', // Set an action when notification is pressed
//       },
//     },
//   });
// }

export function Home() {
  const navigate = useNavigate();
  const {userUID, setUserInfo, reload, preloader, setPreloader} =
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
          .select(`username, website, avatar_url, full_name`)
          .eq('id', session?.user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
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
  const [myFollowedProjects, setMyFollowedProjects] = useState([]);

  useEffect(() => {
    async function getFollowedProjects() {
      try {
        const {data, error} = await supabase
          .from('projects_info')
          .select(
            `
            topic, 
            description, 
            creators_id, 
            content, 
            updated_at, 
            creators, 
            creators_avatar, 
            created_at, 
            id, 
            comments_length
          `,
          )
          .not('creators_id', 'cs', `{${userUID}}`);

        if (data) {
          setMyFollowedProjects(data);
        } else if (error) {
          console.log(error);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    getFollowedProjects();
  }, [userUID, reload]);

  useEffect(() => {
    async function getProjects() {
      try {
        const {data, error, status} = await supabase
          .from('projects_info')
          .select(
            `topic, description, creators_id, content, updated_at, creators, creators_avatar, created_at, id, comments_length`,
          )
          .contains('creators_id', [userUID]); // Use contains for array checking
        if (data) {
          setMyProjects(data);
        } else if (error) {
          console.log(error);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    getProjects();
  }, [userUID, reload]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[Themes.colors.red, Themes.colors.darkGray]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={[styles.header, {flex: 1}]}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.username}>
                  {loading ? 'Fetching' : username || 'User'}!
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigate('/Notifications');
                }}
                style={styles.notificationIcon}>
                <NotificationIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <SearchIcon style={styles.searchIcon} />
              <TextInput
                placeholder="Search records"
                placeholderTextColor={Themes.colors.darkGray}
                style={styles.searchInput}
              />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <SectionHeader title="Live Now" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.liveSessionsContainer}>
            {[1, 2, 3].map(item => (
              <LiveSessionCard
                key={`live-${item}`}
                //onPress={() => navigate('/Editor')}
                onPress={() => {
                  navigate('/Editor', {
                    state: {
                      projectTitle: item.topic,
                      projectContent: item.description,
                      creator_id: item.creator_id,
                      textContent: item.content,
                      created_at: item.created_at,
                      comments: item.comments,
                      creator: item.creator,
                      creator_avatar: item.creator_avatar,
                    },
                  });
                }}
                imageUrl="https://picsum.photos/200"
                title="Lorem ipsum dolor sit amet, consectetur adipiscing"
                host="Dr. John Doe"
              />
            ))}
          </ScrollView>

          <SectionHeader title="Following" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.liveSessionsContainer}>
            {myFollowedProjects.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  navigate('/Editor', {
                    state: {
                      projectTitle: item.topic,
                      projectDescription: item.description,
                      creators_id: item.creators_id,
                      textContent: item.content,
                      created_at: item.created_at,
                      comments_length: item.comments_length,
                      creators: item.creators,
                      creators_avatar: item.creators_avatar,
                    },
                  });
                }}>
                <FollowingCard
                  imageUrl="https://img.freepik.com/free-photo/creative-abstract-mixed-red-color-painting-with-marble-liquid-effect-panorama_1258-102944.jpg?t=st=1728311856~exp=1728315456~hmac=12abfbd2654b694eb49ed7647f64e0f5373c90941d06596d4955d38705fdd215&w=996"
                  avatarUrl={
                    avatar_url ||
                    'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1725801336~exp=1725804936~hmac=fc526ae5173184a7d485674cf33c52bbc239a3ab707780118517f0dcc9a330c7&w=740'
                  }
                  title={item.topic}
                  host={item.creators}
                  comments={item.comments_length}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <SectionHeader title="Your Projects" />
          {myProjects.length > 0 ? (
            myProjects.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  navigate('/Editor', {
                    state: {
                      projectTitle: item.topic,
                      projectDescription: item.description,
                      creators_id: item.creators_id,
                      textContent: item.content,
                      created_at: item.created_at,
                      comments_length: item.comments_length,
                      creators: item.creators,
                      creators_avatar: item.creators_avatar,
                    },
                  });
                }}>
                <ProjectCard
                  title={item.topic}
                  description={item.description}
                />
              </TouchableOpacity>
            ))
          ) : (
            <View>
              <LottieView
                source={require('../../assets/animations/emptyPro.json')}
                autoPlay
                loop
                style={{height: 200, width: '100%'}}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <CustomBottomNavigator />
    </View>
  );
}

const SectionHeader = ({title}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity>
      <Text style={styles.seeAllText}>See All</Text>
    </TouchableOpacity>
  </View>
);

const LiveSessionCard = ({onPress, imageUrl, title, host}) => (
  <TouchableOpacity onPress={onPress} style={styles.liveSessionCard}>
    <Image source={{uri: imageUrl}} style={styles.liveSessionImage} />
    <LinearGradient
      colors={[Themes.colors.red, Themes.colors.darkGray]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={[styles.liveSessionGradient]}>
      <View style={styles.liveIndicator}>
        <Text style={styles.liveText}>LIVE</Text>
      </View>
      <View style={styles.liveSessionInfo}>
        <Text style={styles.liveSessionTitle}>{title}</Text>
        <Text style={styles.liveSessionHost}>{host}</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const FollowingCard = ({imageUrl, avatarUrl, title, host, comments}) => (
  <View style={styles.followingCard}>
    <Image source={{uri: imageUrl}} style={styles.followingImage} />
    <View style={styles.followingGradient}>
      <View style={styles.liveIndicator}>
        <Text style={styles.liveText}>LIVE</Text>
      </View>
      <View style={styles.followingInfo}>
        <Text style={styles.followingTitle}>{title}</Text>
        <Text style={styles.followingHost}>{host}</Text>
      </View>

      <Image source={{uri: avatarUrl}} style={styles.avatarImage} />

      <View style={styles.commentsContainer}>
        <CommentIcon width={24} height={24} color={Themes.colors.white} />
        <Text style={styles.commentsText}>{comments}+</Text>
      </View>
    </View>
  </View>
);

const ProjectCard = ({title, description}) => (
  <View style={styles.projectCard}>
    <DocumentIcon />
    <View style={styles.projectInfo}>
      <Text style={styles.projectTitle}>{title}</Text>
      <Text style={styles.projectDescription}>
        {description?.length > 70
          ? description.slice(0, 71) + '...'
          : description}
      </Text>
    </View>
    <ChevronForwardIcon />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.backgroundColor,
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
  greeting: {
    fontSize: 18,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.regular,
    letterSpacing: 1,
  },
  username: {
    fontSize: 35,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.extraBold,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 22,
    color: Themes.colors.textColor,
    fontFamily: Themes.fonts.bold,
  },
  seeAllText: {
    fontSize: 16,
    color: Themes.colors.red,
    fontFamily: Themes.fonts.semiBold,
  },
  liveSessionsContainer: {
    marginBottom: 10,
  },
  liveSessionCard: {
    width: Dimensions.get('window').width * 0.7,
    height: 200,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  liveSessionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  liveSessionGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 10,
  },
  liveIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: Themes.colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: Themes.colors.red,
    fontSize: 12,
    fontFamily: Themes.fonts.semiBold,
  },
  liveSessionInfo: {
    justifyContent: 'flex-end',
  },
  liveSessionTitle: {
    fontSize: 20,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.semiBold,
    marginBottom: 5,
  },
  liveSessionHost: {
    fontSize: 14,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.regular,
  },
  followingCard: {
    width: Dimensions.get('window').width * 0.7,
    height: 250,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  followingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  followingGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 10,
  },
  avatarImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Themes.colors.white,
    alignSelf: 'flex-end',
  },
  followingInfo: {
    justifyContent: 'flex-end',
  },
  followingTitle: {
    fontSize: 20,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.semiBold,
    marginBottom: 5,
  },
  followingHost: {
    fontSize: 14,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.regular,
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  commentsText: {
    color: Themes.colors.white,
    fontFamily: Themes.fonts.regular,
    fontSize: 16,
    marginLeft: 5,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Themes.colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  projectInfo: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
    paddingVertical: 15,
  },
  projectTitle: {
    fontSize: 18,
    color: Themes.colors.darkGray,
    fontFamily: Themes.fonts.semiBold,
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 16,
    color: Themes.colors.darkGray,
    fontFamily: Themes.fonts.regular,
  },
});
