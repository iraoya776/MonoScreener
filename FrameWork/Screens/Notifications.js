import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {TimerPickerModal} from 'react-native-timer-picker';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LeftArrowIcon from '../Components/ArrowBack';
import {Themes} from '../Components/Themes';
import {supabase} from '../Supabase/supabase';
import {AppContext} from '../Components/GlobalVariables';
import {Svg, Circle, Path} from 'react-native-svg';

const Notifications = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [alarmString, setAlarmString] = useState(null);
  const [futureTime, setFutureTime] = useState(null);
  const {reload, userUID} = useContext(AppContext);

  const triggerHapticFeedback = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };
      ReactNativeHapticFeedback.trigger('impactLight', options);
    }
  };

  const formatTime = ({hours, minutes, seconds}) => {
    const timeParts = [];

    if (hours !== undefined) {
      timeParts.push(hours.toString().padStart(2, '0'));
    }
    if (minutes !== undefined) {
      timeParts.push(minutes.toString().padStart(2, '0'));
    }
    if (seconds !== undefined) {
      timeParts.push(seconds.toString().padStart(2, '0'));
    }

    return timeParts.join(':');
  };

  const calculateFutureTime = pickedDuration => {
    const now = new Date();
    const futureTime = new Date(
      now.getTime() +
        (pickedDuration.hours * 3600000 +
          pickedDuration.minutes * 60000 +
          pickedDuration.seconds * 1000),
    );

    const hours = futureTime.getHours();
    const minutes = futureTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const [allNots, setAllNots] = useState([]);

  useEffect(() => {
    async function getNot() {
      try {
        const {data, error} = await supabase
          .from('notifications')
          .select(
            `created_at, id, read,  activity, activity_type, avatar_url, time_posted`,
          );

        if (data) {
          setAllNots(data);
        } else if (error) {
          console.log(error);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
    getNot();
  }, [userUID, reload]);

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            /* Handle back navigation */
          }}>
          <LeftArrowIcon color={Themes.colors.white} size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Svg height="30" width="30" viewBox="0 0 64 64">
            <Circle
              cx="32"
              cy="32"
              r="30"
              stroke="white"
              strokeWidth="4"
              fill={Themes.colors.red}
            />
            <Path
              d="M32 12V32L42 42"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.alarmView}>
        <Text style={styles.alarm}>{alarmString}</Text>
        {futureTime && (
          <Text style={styles.futureTime}>
            Alarm will ring at: {futureTime}
          </Text>
        )}
      </View> */}
      <LinearGradient
        colors={[Themes.colors.red, Themes.colors.darkGray]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={[
          styles.alarmView,
          {borderBottomLeftRadius: 20, borderBottomRightRadius: 20},
        ]}>
        <Text style={styles.alarm}>{alarmString}</Text>
        {futureTime && (
          <Text style={styles.futureTime}>
            Alarm will ring at: {futureTime}
          </Text>
        )}
      </LinearGradient>

      <ScrollView style={styles.notificationsList}>
        {allNots.length > 0 ? (
          allNots.map(nots => (
            <TouchableOpacity key={nots.id} style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <Text style={styles.activityText}>{nots.activity}</Text>
                <View style={styles.notificationFooter}>
                  <Text style={styles.timeText}>{nots.time_posted}</Text>
                  <Image
                    source={{
                      uri:
                        nots.avatar_url ||
                        'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',
                    }}
                    style={styles.avatar}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyMessage}>No notifications available.</Text>
        )}
      </ScrollView>

      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={pickedDuration => {
          setAlarmString(formatTime(pickedDuration));
          setFutureTime(calculateFutureTime(pickedDuration));
          setShowPicker(false);
          triggerHapticFeedback();
        }}
        modalTitle="Set Reminder"
        onCancel={() => setShowPicker(false)}
        closeOnOverlayPress
        LinearGradient={LinearGradient}
        styles={{
          theme: 'dark',
        }}
        modalProps={{
          overlayOpacity: 0,
          animationDuration: 1000,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Themes.colors.red,
  },
  title: {
    fontSize: 20,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.bold,
  },
  notificationsList: {
    padding: 15,
  },
  notificationItem: {
    backgroundColor: Themes.colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: Themes.colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    elevation: 5,
  },
  notificationContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  alarmView: {
    height: 'auto',
    padding: 10,
    backgroundColor: Themes.colors.red,
  },
  alarm: {
    textAlign: 'center',
    fontSize: 45,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.bold,
    marginBottom: 10,
  },
  futureTime: {
    textAlign: 'center',
    fontSize: 18,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.regular,
    marginBottom: 5,
  },
  activityText: {
    fontSize: 18,
    fontFamily: Themes.fonts.regular,
    color: Themes.colors.darkGray,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: Themes.colors.textColor,
    fontFamily: Themes.fonts.black,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: Themes.colors.gray,
    paddingTop: 20,
  },
});

export default Notifications;
