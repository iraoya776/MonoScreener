import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppContext} from '../Components/GlobalVariables';
import {supabase} from '../Supabase/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Themes} from '../Components/Themes';
import Svg, {
  Path,
  Circle,
  Rect,
  Polyline,
  Line,
  Ellipse,
  Polygon,
} from 'react-native-svg';
import CustomBottomNavigator from '../Components/CustomBottomTab';
import {useNavigate} from 'react-router-native';

const ChevronForwardIcon = () => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#A0AEC0"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const QuestionCircleIcon = () => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4A5568"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <Circle cx={12} cy={12} r={10} />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <Path d="M12 17h.01" />
  </Svg>
);

const PeopleIcon = () => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4A5568"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx={9} cy={7} r={4} />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const AccountCancelIcon = () => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4A5568"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <Circle cx={12} cy={12} r={10} />
    <Path d="M15 9l-6 6" />
    <Path d="M9 9l6 6" />
  </Svg>
);

const LockClosedIcon = () => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4A5568"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const LogoutIcon = () => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FFFFFF"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1={21} y1={12} x2={9} y2={12} />
  </Svg>
);

const CloseIcon = () => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 24 24"
    fill="none"
    stroke={Themes.colors.red}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <Line x1={18} y1={6} x2={6} y2={18} />
    <Line x1={6} y1={6} x2={18} y2={18} />
  </Svg>
);

const CameraIcon = () => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 24 24"
    fill="none"
    stroke={Themes.colors.darkGray}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx={12} cy={13} r={4} />
  </Svg>
);

const ImagesIcon = () => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 24 24"
    fill="none"
    stroke={Themes.colors.darkGray}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <Rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
    <Circle cx={8.5} cy={8.5} r={1.5} />
    <Polyline points="21 15 16 10 5 21" />
  </Svg>
);

const ChangeProfileIcon = () => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4A5568"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </Svg>
);

const ProfileOption = ({icon, title, subtitle, onPress}) => (
  <TouchableOpacity
    style={[styles.option, {marginVertical: 5}]}
    onPress={onPress}>
    <View style={styles.optionIcon}>{icon}</View>
    <View style={styles.optionText}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
    <ChevronForwardIcon />
  </TouchableOpacity>
);

export default function Profile() {
  const navigate = useNavigate();

  const {userInfo} = useContext(AppContext);

  return (
    <View style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={[Themes.colors.red, Themes.colors.darkGray]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.profileInfo}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  userInfo.avatar_url ||
                  'https://img.freepik.com/free-photo/photo-glad-joyful-dark-skinned-girl-gestures-with-one-hand_273609-28027.jpg?t=st=1728215420~exp=1728219020~hmac=6134abbc3e7d1d1950287dc596510fd5b6916d22afb5ce124ad4d10ab025298a&w=740',
              }}
              style={styles.profileImage}></Image>
            <Text style={styles.name}>{userInfo.full_name}</Text>
            <Text style={styles.username}>@{userInfo.username}</Text>
          </View>
        </LinearGradient>
        <View style={styles.projectInfo}>
          <View>
            <Text style={styles.projectText}>25</Text>
            <Text style={styles.projectSub}>Projects</Text>
          </View>
          <View>
            <Text style={styles.projectText}>5</Text>
            <Text style={styles.projectSub}>Completed</Text>
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <ProfileOption
            icon={<ChangeProfileIcon />}
            title="Edit profile"
            subtitle="Change profile"
            onPress={() => {
              //  navigation.navigate('Advanced');
            }}
          />
          <ProfileOption
            icon={<QuestionCircleIcon />}
            title="Project Requests"
            subtitle="Manage your project requests"
            onPress={() => {
              navigate('Advanced');
            }}
          />
          <ProfileOption
            icon={<PeopleIcon />}
            title="Refer A Friend"
            subtitle="Invite friends to join"
            onPress={() => {
              /* Handle press */
            }}
          />
          <ProfileOption
            icon={<AccountCancelIcon />}
            title="Blocked Requests"
            subtitle="Manage blocked requests"
            onPress={() => {
              /* Handle press */
            }}
          />
          <ProfileOption
            icon={<LockClosedIcon />}
            title="Change Password"
            subtitle="Update your password"
            onPress={() => {
              /* Handle press */
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            /* Handle logout */
          }}>
          <Text style={styles.logoutText}>Log Out</Text>
          <LogoutIcon />
        </TouchableOpacity>

        {/* <Modal
          visible={imageModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={imageModal}>
          <Pressable style={styles.modalContainer} onPress={imageModal}>
            <View
              style={[
                styles.modalContent,
                {backgroundColor: Themes.colors.backgroundColor},
              ]}>
              <Pressable onPress={e => e.stopPropagation()}>
                <View style={styles.modalInner}>
                  <View style={styles.closeButtonContainer}>
                    <TouchableOpacity
                      onPress={imageModal}
                      style={styles.closeButton}>
                      <CloseIcon />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity style={styles.modalOptions}>
                      <CameraIcon />
                      <Text style={styles.modalTxt}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOptions}>
                      <ImagesIcon />
                      <Text style={styles.modalTxt}>Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Modal> */}
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
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 50,
    padding: 10,
    marginTop: -9,
    backgroundColor: Themes.colors.backgroundColor,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 15,
    shadowOffset: [{width: 0, height: 0}],
    shadowColor: Themes.colors.darkGray,
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 5,
    borderRadius: 10,
  },
  projectText: {
    textAlign: 'center',
    fontFamily: Themes.fonts.semiBold,
    color: Themes.colors.red,
    fontSize: 22,
  },
  projectSub: {
    fontSize: 16,
    color: Themes.colors.textColor,
    fontFamily: Themes.fonts.bold,
  },
  header: {
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : null,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    padding: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    marginTop: 10,
    textAlign: 'center',
    color: Themes.colors.white,
    fontFamily: Themes.fonts.black,
  },
  username: {
    fontSize: 16,
    color: Themes.colors.white,
    textAlign: 'center',
    fontFamily: Themes.fonts.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: -20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  statLabel: {
    fontSize: 14,
    color: '#718096',
  },
  optionsContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  optionIcon: {
    width: 40,
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
  },
  optionTitle: {
    fontSize: 17,
    fontFamily: Themes.fonts.medium,
    color: '#2D3748',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#718096',
    fontFamily: Themes.fonts.mediumItalic,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Themes.colors.red,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
    padding: 15,
    borderRadius: 40,
  },
  logoutText: {
    color: Themes.colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
    fontFamily: Themes.fonts.font1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: Themes.colors.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 200,
  },
  modalTxt: {
    color: Themes.colors.textColor,
    fontSize: 16,
    //fontFamily: Themes.fonts.text600,
  },
  modalOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginVertical: 10,
  },
  modalInner: {
    width: '100%',
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  camera: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: -5,
    right: -10,
  },
});
