import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import LeftArrowIcon from '../Components/ArrowBack';
import {Themes} from '../Components/Themes';
import Svg, {Circle, Path, Rect} from 'react-native-svg';
import {useContext, useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {supabase} from '../Supabase/supabase';
import {useNavigate} from 'react-router-native';
import {AppContext} from '../Components/GlobalVariables';
import CallIcon from '../Components/callIcon';

// Enhanced Filter Toggle Icon with smoother shapes
const FilterToggleIcon = ({width = 24, height = 24, color = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    {/* Line 1 */}
    <Rect x="3" y="5" width="14" height="2" rx="1" fill={color} />
    <Circle cx="20" cy="6" r="2" fill={color} />

    {/* Line 2 */}
    <Rect x="3" y="11" width="10" height="2" rx="1" fill={color} />
    <Circle cx="16" cy="12" r="2" fill={color} />

    {/* Line 3 */}
    <Rect x="3" y="17" width="6" height="2" rx="1" fill={color} />
    <Circle cx="12" cy="18" r="2" fill={color} />
  </Svg>
);

// Icons for menu items
const CommentIcon = ({width = 20, height = 20, color = '#333'}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M12 8H16M12 12H18M12 16H14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const NotificationsScreen = () => {
  const navigate = useNavigate();
  const {userUID, reload, userInfo, setPreloader} = useContext(AppContext);

  const progress = useRef(new Animated.Value(100)).current;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpen2, setIsMenuOpen2] = useState(false);
  //const [isMenuOpen3, setIsMenuOpen3] = useState(false);
  //const [boxShake, setBoxShake] = useState(false);

  const slideAnim = useRef(new Animated.Value(-1000)).current;
  const slideAnim2 = useRef(new Animated.Value(-1000)).current;
  //const slideAnim3 = useRef(new Animated.Value(-1000)).current;
  //const boxAnim = useRef(new Animated.Value(-1000)).current;

  // Keeping original animation logic
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleMenu2 = () => {
    setIsMenuOpen2(!isMenuOpen2);
    Animated.timing(slideAnim2, {
      toValue: 0,
      useNativeDriver: true,
      delay: 350,
    }).start();
  };

  // const toggleMenu3 = () => {
  //   setIsMenuOpen3(!isMenuOpen3);
  //   Animated.timing(slideAnim3, {
  //     toValue: 0,
  //     useNativeDriver: true,
  //     delay: 400,
  //   }).start();
  // };

  // const shakeBox = () => {
  //   setBoxShake(!boxShake);
  //   Animated.timing(boxAnim, {
  //     toValue: boxShake ? -1000 : 0,
  //     duration: 50,
  //     delay: 0,
  //     useNativeDriver: true,
  //   }).start();
  // };

  const [allComments, setAllComments] = useState([]);
  const [allCommentNots, setAllCommentNots] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);

  const [commentsLength, setCommentsLength] = useState(0);

  useEffect(() => {
    async function getAllComments() {
      try {
        const {data, error} = await supabase
          .from('comments')
          .select(`*`)
          .contains('topic_creators', [userUID]);

        if (data && data.length > 0) {
          setCommentsLength(data.length);

          setAllComments(data);

          const allCreators = data.map(comment => comment.topic_creators);

          const uniqueData = data.reduce((acc, item) => {
            if (
              !acc[item.doc_id] ||
              new Date(item.created_at) > new Date(acc[item.doc_id].created_at)
            ) {
              acc[item.doc_id] = item; // Keep only the most recent item
            }
            return acc;
          }, {});

          // Convert uniqueData back to an array of unique comments
          const filteredComments = Object.values(uniqueData);
          setAllComments(filteredComments);

          async function getCommentNots() {
            try {
              const {data, error} = await supabase
                .from('notifications')
                .select(`*`)
                .contains('topic_creators', allCreators);

              if (data) {
                setAllCommentNots(data);
              } else if (error) {
                console.log(error);
              }
            } catch (error) {
              console.error('Error fetching projects:', error);
            }
          }
          getCommentNots();
        } else if (error) {
          console.log(error);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    getAllComments();
  }, [userUID, reload]);

  const [showComments, setShowComments] = useState(false);
  const [showOpacity, setShowOpacity] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;

  const setOpacity = () => {
    setShowOpacity(true);
    Animated.timing(opacity, {
      toValue: 1,
      useNativeDriver: true,
      duration: 3000,
      delay: 100,
    }).start();
  };

  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const isShaking = Animated.sequence([
      Animated.timing(shake, {
        toValue: 0, // Shake right
        //duration: 10,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -10, // Shake left
        //duration: 10,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0, // Back to center
        //duration: 10,
        delay: 400,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(isShaking, {iterations: -1}).start();
  }, [showComments]);

  const commentBodySlide = useRef(new Animated.Value(-1000)).current;

  const commentSlider = () => {
    Animated.timing(commentBodySlide, {
      toValue: 0,
      delay: 600,
      useNativeDriver: true,
      duration: 400,
    }).start();
  };

  const [allRequests, setAllRequests] = useState([]);

  useEffect(() => {
    async function getRequests() {
      try {
        const {data, error} = await supabase
          .from('projects_info')
          .select(`*`)
          .contains('requests', [userUID]);

        if (data) {
          setAllRequests(data);
        } else if (error) {
          console.log(error);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    getRequests();
  }, [userUID, reload, refresh]);

  //const changeBg = useRef(new Animated.Value(0)).current;

  const scaleBg = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startScale = Animated.sequence([
      Animated.timing(scaleBg, {
        toValue: 100,
        duration: 10000,
        useNativeDriver: true,
        //delay: 1000,
      }),
      Animated.timing(scaleBg, {
        toValue: 0,
        duration: 10000,
        //delay: 1000,
        useNativeDriver: true,
      }),

      Animated.timing(scaleBg, {
        toValue: 100,
        duration: 10000,
        //delay: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(startScale, {iterations: -1}).start();
  }, []);

  const scale2Bg = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startScale = Animated.sequence([
      Animated.timing(scale2Bg, {
        toValue: 100,
        duration: 10000,
        useNativeDriver: true,
        //delay: 1000,
      }),
      Animated.timing(scale2Bg, {
        toValue: 0,
        duration: 10000,
        //delay: 1000,
        useNativeDriver: true,
      }),

      Animated.timing(scale2Bg, {
        toValue: 100,
        duration: 10000,
        //delay: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(startScale, {iterations: -1}).start();
  }, []);

  //   async function addUser(id, creator, avatar) {
  //   try {
  //     const {data, error} = await supabase
  //       .from('projects_info')
  //       .select('*')
  //       .eq('created_at', doc_id);

  //     if (error) {
  //       console.error(error);
  //       return;
  //     }

  //     if (data.length > 0) {
  //       const project = data[0]; // Assuming you only get one project with this id

  //       // Check if user is already a creator
  //       if (!project.creators_id.includes(id)) {
  //         const updatedCreatorsId = [...project.creators_id, id];
  //         const updatedCreators = [...project.creators, creator];
  //         const updatedCreatorsAvatar = [...project.creators_avatar, avatar];

  //         // Update the project info with the new arrays
  //         const {data: updatedData, error: updateError} = await supabase
  //           .from('projects_info')
  //           .update({
  //             creators_id: updatedCreatorsId,
  //             creators: updatedCreators,
  //             creators_avatar: updatedCreatorsAvatar,
  //             updated_at: new Date().toLocaleString(), // Optional: update timestamp
  //           })
  //           .eq('created_at', doc_id);

  //         if (updateError) {
  //           console.error(updateError);
  //         } else {
  //           console.log('Creators updated successfully', updatedData);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching project:', error);
  //   }
  // }

  const [refresh, setRefresh] = useState(0);

  const fetchRequests = async () => {
    setPreloader(true);
    const {error, data} = await supabase
      .from('projects_info')
      .select('*')
      .contains('requests', [userUID]);

    if (error) {
      setPreloader(false);
      console.log(error);
    }
    if (data.length > 0) {
      setPreloader(false);
      // let allRequests;
      // data.forEach(request => {
      //   return (allRequests = request.requests);
      // });

      let getKey;

      data.forEach(key => {
        return (getKey = key.created_at);
      });

      //const valueToRemove = userUID;

      // Find the index of the value
      // const index = allRequests.findIndex(element => element === valueToRemove);

      const userRequests = allRequests.filter(id => id !== userUID);

      let creators_id;
      data.forEach(creators => {
        return (creators_id = creators.creators_id);
      });

      let creators_avatar;
      data.forEach(creator => {
        return (creators_avatar = creator.creators_avatar);
      });

      let acceptedRequests;
      data.forEach(requests => {
        return (acceptedRequests = requests.accepted_requests);
      });

      let creators;
      data.forEach(user => {
        return (creators = user.creators);
      });

      const allCreatorsIDs = [...creators_id, userUID];
      const urls =
        creators_avatar == null
          ? [userInfo.avatar_url]
          : [...creators_avatar, userInfo.avatar_url];
      const accepted =
        acceptedRequests == null ? [userUID] : [...acceptedRequests, userUID];
      const topicOwners = [...creators, userInfo.full_name];

      let updated_at;

      data.forEach(time => {
        return (updated_at = time.updated_at);
      });

      const {myError, myData} = await supabase
        .from('projects_info')
        .update({
          creators_id: allCreatorsIDs,
          creators_avatar: urls,
          accepted_requests: accepted,
          creators: topicOwners,
          updated_at: new Date().toLocaleString(),
          requests: userRequests,
        })
        .single()
        //.eq('updated_at', updated_at)
        .eq('created_at', getKey);
      //.contains('requests', [userUID]);

      if (myError) {
        console.log(myError);
      }
      //console.log(myData);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View>
          <StatusBar barStyle="light-content" />
          <LinearGradient
            colors={[Themes.colors.red, Themes.colors.red]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.headerGradient}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton}>
                <LeftArrowIcon color={Themes.colors.white} size={24} />
              </TouchableOpacity>
              <Text style={styles.screenTitle}>Notifications</Text>
            </View>
          </LinearGradient>

          <View style={styles.body}>
            <TouchableOpacity
              onPress={() => {
                toggleMenu();
                toggleMenu2();
              }}
              style={styles.filterButton}>
              <FilterToggleIcon
                height={24}
                width={24}
                color={Themes.colors.darkGray}
              />
            </TouchableOpacity>

            <View style={styles.menuWrapper}>
              <Animated.View style={[styles.menuContainer, {}]}>
                <TouchableOpacity
                  onPress={() => {
                    setShowComments(true);
                    setOpacity();
                    commentSlider();
                  }}
                  style={[
                    styles.menuItem,
                    {
                      transform: [{translateX: slideAnim}],
                    },
                  ]}>
                  <View style={styles.menuItemContent}>
                    <CommentIcon />
                    <Text style={styles.menuItemText}>Comments</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{commentsLength}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={[
                    styles.menuItem,
                    {
                      transform: [{translateX: slideAnim2}],
                    },
                  ]}>
                  <View style={styles.menuItemContent}>
                    <CommentIcon />
                    <Text style={styles.menuItemText}>
                      Invitations/Requests
                    </Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{allRequests.length}</Text>
                    </View>
                  </View>
                </TouchableOpacity> */}

                {/* <TouchableOpacity
                  style={[
                    styles.menuItem,
                    {
                      transform: [{translateX: slideAnim3}],
                    },
                  ]}>
                  <View style={styles.menuItemContent}>
                    <CommentIcon />
                    <Text style={styles.menuItemText}>Calls</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>5</Text>
                    </View>
                  </View>
                </TouchableOpacity> */}
              </Animated.View>
            </View>
            <View
              style={{
                marginVertical: 30,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontFamily: Themes.fonts.extraBold,
                  color: Themes.colors.textColor,
                  marginBottom: 10,
                }}>
                Invitations/Requests ({allRequests.length})
              </Text>
              <ScrollView horizontal>
                <Animated.View
                  style={[
                    styles.commentAvatars,
                    {
                      transform: [{translateY: shake}],
                      opacity,
                      marginBottom: 15,
                    },
                  ]}>
                  {showComments !== false
                    ? allRequests.map((request, index) => {
                        return (
                          <View
                            style={{
                              // position: 'relative',
                              backgroundColor: Themes.colors.darkGray,
                              padding: 25,
                              borderRadius: 10,
                              // paddingBottom: 110,
                              width: Dimensions.get('screen').width * 0.9,
                              shadowColor: Themes.colors.darkGray,
                              shadowOffset: {width: 0, height: 2},
                              shadowOpacity: 1,
                              shadowRadius: 10,
                              elevation: 10,
                            }}
                            key={request.id || index.toString()}>
                            <View
                              style={
                                {
                                  //width: '90%',
                                }
                              }>
                              <Text
                                style={{
                                  fontFamily: Themes.fonts.bold,
                                  fontSize: 20,
                                  color: Themes.colors.white,
                                }}>
                                Topic: {request.topic}
                              </Text>
                              <Text
                                style={{
                                  marginVertical: 10,
                                  fontFamily: Themes.fonts.medium,
                                  color: Themes.colors.white,
                                  fontSize: 16,
                                }}>
                                Created By: {request.admin} and{' '}
                                {request.creators.length - 1} other(s)
                              </Text>
                              <Text
                                style={{
                                  textAlign: 'right',
                                  fontFamily: Themes.fonts.regular,
                                  color: Themes.colors.white,
                                  fontSize: 16,
                                }}>
                                {' '}
                                On{' '}
                                {new Date(
                                  request.created_at,
                                ).toLocaleDateString()}
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  columnGap: 10,
                                  marginTop: 20,
                                }}>
                                <TouchableOpacity
                                  onPress={fetchRequests}
                                  style={{
                                    // marginTop: 8,
                                    borderRadius: 10,
                                    backgroundColor: Themes.colors.red,
                                    width: '40%',
                                    overflow: 'hidden',
                                  }}>
                                  <Animated.View
                                    style={{
                                      width: '20%',
                                      backgroundColor: Themes.colors.darkGray,
                                      height: '100%',
                                      //transform: [{translateX: 50}],
                                      zIndex: -3,
                                      position: 'absolute',
                                      alignSelf: 'center',
                                      transform: [{scaleX: scale2Bg}],
                                    }}
                                  />

                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      color: Themes.colors.white,
                                      padding: 10,
                                      fontFamily: Themes.fonts.regular,
                                      fontSize: 15,
                                    }}>
                                    Accept
                                  </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={{
                                    //marginTop: 8,
                                    borderRadius: 10,
                                    backgroundColor: Themes.colors.darkGray,
                                    width: '40%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                  }}>
                                  <Animated.View
                                    style={{
                                      width: '20%',
                                      backgroundColor: Themes.colors.red,
                                      height: '100%',
                                      //transform: [{translateX: 50}],
                                      zIndex: -3,
                                      position: 'absolute',
                                      alignSelf: 'center',
                                      transform: [{scaleX: scaleBg}],
                                    }}
                                  />

                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      color: Themes.colors.white,
                                      padding: 10,
                                      fontFamily: Themes.fonts.regular,
                                      fontSize: 15,
                                    }}>
                                    Ignore
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        );
                      })
                    : null}
                </Animated.View>
              </ScrollView>

              <View>
                <Animated.View
                  style={[
                    styles.commentBody,
                    {
                      paddingHorizontal: 5,
                      opacity,
                      //position: 'absolute',
                      transform: [{translateY: commentBodySlide}],
                    },
                  ]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontFamily: Themes.fonts.extraBold,
                      color: Themes.colors.textColor,
                      marginBottom: 10,
                    }}>
                    Comments ({allCommentNots.length})
                  </Text>
                  {showComments !== false
                    ? allCommentNots.map((item, index) => {
                        return (
                          <TouchableOpacity
                            key={item.id || index.toString()}
                            style={styles.commentsBox}>
                            <View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <Image
                                  source={{uri: item.avatar_url}}
                                  style={styles.img}
                                />
                                <Text
                                  style={{
                                    fontSize: 14,
                                    fontFamily: Themes.fonts.black,
                                  }}>
                                  {item.activity_type}🎉🎉
                                </Text>
                              </View>
                              <Text style={styles.activity}>
                                {item.activity}
                              </Text>
                              <Text style={styles.time_posted}>
                                {item.time_posted}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })
                    : null}
                </Animated.View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* <View style={{position: 'relative'}}>
        <TouchableOpacity style={{position: 'absolute', top: -100, right: 0}}>
          <CallIcon color={Themes.colors.red} height={90} width={90} />
        </TouchableOpacity>
      </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.backgroundColor,
  },
  commentsBox: {
    backgroundColor: Themes.colors.white,
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: Themes.colors.darkGray,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activity: {
    fontSize: 18,
    fontFamily: Themes.fonts.regular,
    color: Themes.colors.textColor,
    marginVertical: 10,
    textAlign: 'center',
  },
  time_posted: {
    textAlign: 'right',
    fontFamily: Themes.fonts.regular,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  img: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  screenTitle: {
    marginLeft: 16,
    fontSize: 24,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.medium,
    fontWeight: '600',
  },
  body: {
    //flex: 1,
    padding: 16,
  },
  filterButton: {
    alignSelf: 'flex-end',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuWrapper: {
    position: 'relative',
    marginTop: 16,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2D3436',
    fontFamily: Themes.fonts.regular,
    flex: 1,
  },
  badge: {
    backgroundColor: Themes.colors.red,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Themes.fonts.medium,
  },
  commentsImg: {
    height: 80,
    width: 80,
    borderRadius: 40,
    //borderWidth: 4,
    //borderColor: Themes.colors.darkGray,
  },
  commentAvatars: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    //backgroundColor: Themes.colors.darkGray,
    //borderWidth: 4,
    //borderColor: 'black',
    //height: 100,
    marginVertical: 10,
  },
  imgView: {
    marginHorizontal: 20,
    backgroundColor: Themes.colors.darkGray,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: Themes.colors.darkGray,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 10,
    alignItems: 'center',
  },
  commentText: {
    marginTop: 5,
    fontFamily: Themes.fonts.regular,
    fontSize: 16,
    textAlign: 'center',
    color: Themes.colors.white,
  },
});

export default NotificationsScreen;
