import {useContext, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {AppContext} from '../Components/GlobalVariables';
import {Themes} from '../Components/Themes';
import Svg, {Circle, Line, Path, Rect} from 'react-native-svg';
import ImageCropPicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import LeftArrowIcon from '../Components/ArrowBack';
import {supabase} from '../Supabase/supabase';
import {request, PERMISSIONS} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigate} from 'react-router-native';

const CameraIcon = ({
  width = 24,
  height = 24,
  color = Themes.colors.white,
  spacing,
}) => (
  <Svg
    style={{marginVertical: spacing}}
    //color={Themes.colors.red}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M20 5h-2.586l-1-1h-5l-1 1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
      fill={color}
    />
    <Circle cx="12" cy="12" r="3" fill={color} />
  </Svg>
);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const UpdateIcon = ({width = 24, height = 24, color = Themes.colors.white}) => (
  <AnimatedSvg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M12 4V1L8 5l4 4V6a7 7 0 0 1 0 14 7 7 0 0 1-7-7H3a9 9 0 0 0 18 0c0-5-4-9-9-9z"
      fill={color}
    />
  </AnimatedSvg>
);

const XMarkIcon = ({size = 24, color}) => {
  return (
    <Svg
      style={color}
      height={size}
      width={size}
      viewBox="0 0 24 24"
      fill="none">
      <Line
        x1="2"
        y1="2"
        x2="22"
        y2="22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="22"
        y1="2"
        x2="2"
        y2="22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

const EditIcon = ({size = 20, color}) => {
  return (
    <Svg
      style={{color}}
      height={size}
      width={size}
      viewBox="0 0 24 24"
      fill="none">
      {/* Pencil body */}
      <Path
        d="M3 21v-3.75L14.81 5.44a1 1 0 0 1 1.42 0l2.33 2.33a1 1 0 0 1 0 1.42L7.75 21H3z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Eraser part of the pencil */}
      <Rect
        x="17"
        y="3"
        width="4"
        height="4"
        rx="1"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );
};

const GalleryIcon = ({size = 24, color}) => {
  return (
    <Svg
      style={{color}}
      height={size}
      width={size}
      viewBox="0 0 24 24"
      fill="none">
      {/* Outer rectangle/frame */}

      <Rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="3"
        stroke={color}
        strokeWidth="2"
      />
      {/* Mountain path */}
      <Path
        d="M5 17L10 12L14 16L17 13L21 17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sun or moon */}
      <Circle cx="16" cy="8" r="2" fill={color} />
    </Svg>
  );
};

const EditProfile = () => {
  const {userUID, userInfo, reload, setReload} = useContext(AppContext);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [finImage, setFinImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const pickImage = async () => {
    const result = await launchImageLibrary({
      quality: 0.8,
      selectionLimit: 1,
      mediaType: 'photo',
    });

    if (!result.cancelled) {
      //setFinImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
      //updateImage(image);
      setContent([
        {type: 'image', uri: result.assets[0].uri},
        {type: 'text', value: ''},
      ]);
    }
  };

  const pickCamera = async () => {
    const result = await launchCamera({
      saveToPhotos: true,
      cameraType: 'front',
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.cancelled) {
      //setFinImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
      // updateImage(image);
      setContent([
        {type: 'image', uri: result.assets[0].uri},
        {type: 'text', value: ''},
      ]);
    }
  };

  const sizeIncrease = useRef(new Animated.Value(0)).current;

  //const sizeDecrease = useRef(new Animated.Value(0)).current;

  const [isSizeChange, setIsSizeChange] = useState(false);

  useEffect(() => {
    setIsSizeChange(!isSizeChange);
    const sequence = Animated.sequence([
      Animated.timing(sizeIncrease, {
        toValue: 1,
        duration: 1000,
        delay: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(sizeIncrease, {
        toValue: 0,
        useNativeDriver: true,
        duration: 1000,
        delay: 1000,
      }),
    ]);
    Animated.loop(sequence, {iterations: -1}).start();
  }, []);

  useEffect(() => {
    const retrieveData = async () => {
      try {
        // Fetch the user's profile from the "profiles" table
        const {data, error, status} = await supabase
          .from('profiles')
          .select(`*`)
          .eq('id', userUID)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setFinImage(data.avatar_url);
          setFullName(data.full_name);
          setEmail(data.email);
          setUsername(data.username);
        }
      } catch (error) {
        console.log(error.message); // Catch and set the error
      }
    };

    retrieveData();
  }, [reload]);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fullName.length > 2 && fullName.length < 5) {
      // Reset the opacity value before starting new animation
      opacity.setValue(1);

      const sequence = Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          delay: 1000,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]);

      sequence.start();
    }
  }, [fullName]); // Add fullName as dependency

  const shift = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    if (fullName.length > 2 && fullName.length < 5) {
      // setTimeout(() => {
      //   console.log("This message won't appear.");
      // }, 5000);

      Animated.timing(shift, {
        toValue: 100,
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }).start();
    } else {
      //Reset animation when condition is not met
      Animated.timing(shift, {
        toValue: -10,
        duration: 500,
        delay: 700,
        useNativeDriver: true,
      }).start();
    }
  }, [fullName]);

  const changeColour = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (fullName.length > 2 && fullName.length < 5) {
      Animated.sequence([
        Animated.timing(changeColour, {
          toValue: 0,
          duration: 1000,
          delay: 1000,
          useNativeDriver: true,
        }),

        Animated.timing(changeColour, {
          toValue: 1,
          duration: 1000,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fullName]);

  const [openImageOpts, setOpenImageOpts] = useState(true);

  const scale = useRef(new Animated.Value(0)).current;

  const [optDisplayed, setOptDisplayed] = useState(false);

  const openOpts = () => {
    //setOptDisplayed(!optDisplayed);
    Animated.timing(scale, {
      toValue: !optDisplayed ? 1 : 0,
      useNativeDriver: false,
      duration: 300,
      //delay: 100,
    }).start(() => {
      setOptDisplayed(!optDisplayed);
    });
  };

  const fetchRequests = async () => {
    try {
      // Get projects containing user's UID in requests
      const {data: projects, error: fetchError} = await supabase
        .from('projects_info')
        .select('*')
        .contains('creators_id', [userUID]);

      if (fetchError) throw fetchError;

      // Process each project that contains this user in requests
      for (const project of projects || []) {
        // Update creator info

        let allCreators;
        let allAvatars;

        projects.forEach(all => {
          allCreators = all.creators;
          allAvatars = all.creators_avatar;
        });

        const avatarsToRemove = [userInfo.avatar_url, image, finImage];
        const usersToRemove = [userInfo.full_name, fullName];

        const filtereAvatars = allAvatars.filter(
          item => !avatarsToRemove.includes(item),
        );
        const filtereUsers = allCreators.filter(
          item => !usersToRemove.includes(item),
        );

        // Update the project
        const {error: updateError} = await supabase
          .from('projects_info')
          .update({
            creators_avatar: [
              ...filtereAvatars,
              image || finImage || userInfo.avatar_url,
            ],
            creators: [...filtereUsers, fullName],
            updated_at: new Date().toLocaleString(),
          })
          .contains('creators_id', [userUID]);

        if (updateError) {
          throw updateError;
        } else {
          console.log('done');
        }
      }

      //Update the user's profile
      const {error: profileError} = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username: username,
          email: email,
          avatar_url: image || finImage,
        })
        .eq('id', userUID);

      if (profileError) throw profileError;

      // Update comments
      const {error: commentsError} = await supabase
        .from('comments')
        .update({
          creator: fullName,
          creator_avatar: image || finImage,
        })
        .eq('creator_id', userUID);

      if (commentsError) throw commentsError;

      // Show success message and trigger reload
      Alert.alert('Success', 'Profile updated successfully!');
      setReload(prev => prev + 1);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleScroll = () => {
    setOptDisplayed(true);
    Animated.timing(scale, {
      toValue: 0,
      duration: 80,
      useNativeDriver: false,
    }).start(() => {
      setOptDisplayed(false);
    });
  };

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const [isRow, setIsRow] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <View style={styles.container}>
        {/* <View style={{ height: 220, overflow: 'hidden', backgroundColor: }}> */}
        <ScrollView
          // onScroll={() => {
          //   //scrollUp();
          //   //changeDirection();
          //   //handleScroll();
          // }}
          //onScroll={handleScroll}
          scrollEventThrottle={16}>
          <LinearGradient
            colors={[Themes.colors.red, Themes.colors.darkGray]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={{
              padding: 10,
              //overflow: 'hidden',
              //height: 400,
              //flexDirection: 'row',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: isRow ? 'row' : 'column',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <TouchableOpacity onPress={() => navigate(-1)}>
                  <LeftArrowIcon color={Themes.colors.white} />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Themes.fonts.regular,
                    color: Themes.colors.white,
                  }}>
                  Edit Profile
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    openOpts();
                    // scrollUp();
                  }}
                  style={[styles.imgView, {alignSelf: 'center'}]}>
                  <Image
                    source={{
                      uri:
                        image ||
                        finImage ||
                        'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1725801336~exp=1725804936~hmac=fc526ae5173184a7d485674cf33c52bbc239a3ab707780118517f0dcc9a330c7&w=740',
                    }}
                    style={[
                      styles.img,
                      {height: isRow ? 65 : 120, width: isRow ? 65 : 120},
                    ]}
                  />
                  <View style={styles.camera}>
                    <EditIcon color={Themes.colors.white} />
                  </View>
                </TouchableOpacity>
              </View>

              {/* <View
                style={{
                  backgroundColor: Themes.colors.backgroundColor,
                  height: 80,
                  borderTopRightRadius: 40,
                  borderTopLeftRadius: 40,
                  transform: [{translateY: 40}],
                }}
              /> */}
            </View>

            <Animated.View
              style={{
                alignSelf: 'flex-start',
                //borderWidth: 4,
                // height: scale.interpolate({
                //   inputRange: [0, 1],
                //   outputRange: [0, 'auto'],
                // }),

                overflow: 'hidden',
                display: scale != 1 ? 'flex' : 'none',
                transform: [
                  {
                    scale: scale,
                  },
                ],
              }}>
              {openImageOpts && (
                <View>
                  {/* <TouchableOpacity
                  style={{alignSelf: 'flex-end', marginHorizontal: 15}}>
                  <XMarkIcon color={Themes.colors.white} />
                </TouchableOpacity> */}

                  <TouchableOpacity
                    onPress={pickCamera}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 10,
                      marginHorizontal: 10,
                      // backgroundColor: Themes.colors.white,
                      alignSelf: 'flex-start',
                      marginBottom: 5,
                    }}>
                    <CameraIcon spacing={10} />
                    <Text
                      style={{
                        color: Themes.colors.white,
                        fontFamily: Themes.fonts.semiBold,
                        fontSize: 18,
                        letterSpacing: 1,
                      }}>
                      Camera
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 10,
                      marginLeft: 10,
                      alignSelf: 'flex-start',
                    }}>
                    <GalleryIcon color={Themes.colors.white} />
                    <Text
                      style={{
                        color: Themes.colors.white,
                        fontFamily: Themes.fonts.semiBold,
                        fontSize: 18,
                        letterSpacing: 1,
                      }}>
                      Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* <Text
                style={{
                  marginHorizontal: 10,
                  textAlign: 'center',
                  marginVertical: 30,
                  fontSize: 18,
                  fontFamily: Themes.fonts.bold,
                  color: Themes.colors.white,
                }}>
                {studentTexts()}
              </Text> */}
            </Animated.View>
          </LinearGradient>

          <View style={[styles.body, {marginTop: 20}]}>
            <View style={styles.inpView}>
              <Text style={styles.inptext}>Full Name</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="words"
                maxLength={200}
                numberOfLines={2}
                placeholder="Owen Iraoya"
                value={fullName}
                onChangeText={setFullName}
              />
              <Text style={styles.error}></Text>
            </View>
            <View style={styles.inpView}>
              <Text style={styles.inptext}>Username</Text>
              <TextInput
                placeholder="Owen132"
                style={styles.input}
                value={username}
                onChangeText={inp => setUsername(inp.trim())}
              />
              <Text style={styles.error}></Text>
            </View>
            <View style={styles.inpView}>
              <Text style={styles.inptext}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Owen@gmail.com"
                value={email}
                onChangeText={inp => setEmail(inp.trim())}
              />
              <Text style={styles.error}></Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity
        onPress={fetchRequests}
        style={{
          position: 'relative',
        }}>
        <Animated.View
          style={[
            //styles.lastTouch,
            {
              position: 'absolute',
              backgroundColor: changeColour.interpolate({
                inputRange: [0, 1],
                outputRange: [Themes.colors.red, Themes.colors.darkGray],
              }),
              width: 80,
              right: 0,
              bottom: 0,
              height: 80,
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 5,
              marginRight: 15,
              marginBottom: 15,
              zIndex: 10,

              transform: [
                {
                  translateY: sizeIncrease.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 10],
                  }),
                },
              ],
            },
          ]}>
          <UpdateIcon />
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.backgroundColor,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 6,
    borderColor: Themes.colors.white,
  },
  imgView: {
    //borderWidth: 1,
    alignItems: 'center',
    padding: 15,
    position: 'relative',
  },
  camera: {
    position: 'absolute',
    bottom: 20,
  },
  lastTouch: {
    //paddingVertical: 10,
    // paddingHorizontal: 10,
    backgroundColor: Themes.colors.red,
  },
  lastText: {
    textAlign: 'center',
    fontFamily: Themes.fonts.extraBold,
    color: Themes.colors.white,
  },
  body: {
    paddingHorizontal: 20,
    //marginVertical: 5,
    // backgroundColor: Themes.colors.darkGray,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: Themes.colors.darkGray,
    marginVertical: 10,
    padding: 10,
    fontSize: 20,
    fontFamily: Themes.fonts.regular,
    color: Themes.colors.textColor,
  },
  inpView: {
    backgroundColor: Themes.colors.white,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: Themes.colors.darkGray,
    shadowOffset: [{height: 0, width: 2}],
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  inptext: {
    fontFamily: Themes.fonts.black,
    fontSize: 18,
    letterSpacing: 1,
  },
});

export default EditProfile;
