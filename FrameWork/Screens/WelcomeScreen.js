import React, {useState, useRef} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import {Themes} from '../Components/Themes';
import {Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigate} from 'react-router-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMugSaucer} from '@fortawesome/free-solid-svg-icons/faMugSaucer';
import {faGoogle} from '@fortawesome/free-brands-svg-icons/faGoogle';

const {width, height} = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false},
  );

  const screens = [
    {
      title: 'Welcome',
      image:
        'https://img.freepik.com/free-vector/illustration-university-graduates_53876-18433.jpg?t=st=1728053933~exp=1728057533~hmac=0b2bbcda957c0a87eb19675c77f1bd669db69f561a1775974457b31c15a11964&w=740',
      text: 'Research centered, research for you',
    },
    {
      title: 'Collaborate',
      image:
        'https://img.freepik.com/free-vector/illustration-university-graduates_53876-28469.jpg?t=st=1728054093~exp=1728057693~hmac=2d13faf93047332cdcb2c69a9267024a3b39b80026b40ebfa2fa3c0fd4dada9d&w=740',
      text: 'Work together on assignments and projects',
    },
    {
      title: 'Succeed',
      image:
        'https://img.freepik.com/free-vector/graduates-wearing-mask_23-2148584765.jpg?t=st=1728054065~exp=1728057665~hmac=e33a22bdd0b8f7b1758df431a7ecaf9ca563e875793d0b1f652c38bf5a6a98fa&w=740',
      text: 'Achieve your academic goals',
    },
  ];

  return (
    <View style={[styles.container]}>
      <StatusBar barStyle="light-content" backgroundColor={Themes.colors.red} />
      <LinearGradient
        colors={[Themes.colors.red, Themes.colors.backgroundColor]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={{flex: 1}}>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={event => {
            const newPage = Math.round(
              event.nativeEvent.contentOffset.x / width,
            );
            setCurrentPage(newPage);
          }}>
          {screens.map((screen, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
              extrapolate: 'clamp',
            });
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [50, 0, 50],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.screen,
                  {opacity, transform: [{scale}, {translateY}]},
                ]}>
                <View style={styles.firstView}>
                  <Text style={styles.firstText}>{screen.title}</Text>
                </View>
                <View style={styles.secondView}>
                  <View style={styles.imageContainer}>
                    <Image source={{uri: screen.image}} style={styles.image} />
                    <Text style={styles.txt}>{screen.text}</Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>

        <View style={styles.pagination}>
          {screens.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 20, 10],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[styles.dot, {width: dotWidth, opacity}]}
              />
            );
          })}
        </View>

        {currentPage === screens.length - 1 && (
          <Animated.View
            style={[
              styles.login,
              {
                opacity: scrollX.interpolate({
                  inputRange: [
                    (screens.length - 2) * width,
                    (screens.length - 1) * width,
                  ],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    translateY: scrollX.interpolate({
                      inputRange: [
                        (screens.length - 2) * width,
                        (screens.length - 1) * width,
                      ],
                      outputRange: [50, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}>
            <TouchableOpacity
              onPress={() => navigate('Login')}
              style={styles.lastTouch}>
              <FontAwesomeIcon
                icon={faGoogle}
                size={20}
                color={Themes.colors.white}
              />
              <Text style={styles.lastTxt}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate('/Web')}
              style={[
                styles.lastTouch,
                {marginTop: 10, backgroundColor: Themes.colors.backgroundColor},
              ]}>
              <Text style={[styles.lastTxt, {color: Themes.colors.red}]}>
                Continue Anyway
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  screen: {
    width,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  firstView: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  secondView: {
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    height: 250,
    width: 250,
    borderRadius: 125,
    borderWidth: 4,
    borderColor: Themes.colors.white,
  },
  firstText: {
    fontSize: 40,
    fontFamily: Themes.fonts.ExtraBoldItalic,
    color: Themes.colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 5,
  },
  txt: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: Themes.fonts.regular,
    fontSize: 20,
    color: Themes.colors.darkGray,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Themes.colors.darkGray,
    marginHorizontal: 5,
    //color: Themes.colors.darkGray,
  },
  login: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  lastTouch: {
    backgroundColor: Themes.colors.red,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    width: '100%',
    justifyContent: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lastTxt: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-ExtraBold',
    color: Themes.colors.white,
  },
});
