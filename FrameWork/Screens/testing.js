import React, {useState} from 'react';
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
import {useNavigate} from 'react-router-native';
import CustomBottomNavigator from '../Components/CustomBottomTab';
import {Themes} from '../Components/Themes';
import {
  ChevronForwardIcon,
  QuestionCircleIcon,
  PeopleIcon,
  AccountCancelIcon,
  LockClosedIcon,
  LogoutIcon,
  CloseIcon,
  CameraIcon,
  ImagesIcon,
} from '../Components/ProfileIcons';

const ProfileOption = ({icon, title, subtitle, onPress}) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <View style={styles.optionIcon}>{icon}</View>
    <View style={styles.optionText}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
    <ChevronForwardIcon />
  </TouchableOpacity>
);

export function Profile() {
  const navigate = useNavigate();
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // Mock user data
  const user = {
    name: 'Owen',
    username: 'owen423',
    projectsCompleted: 15,
    totalProjects: 22,
    connections: 78,
    profileImage:
      'https://img.freepik.com/free-photo/elegant-black-girl-summer-city_1157-20782.jpg?t=st=1728155566~exp=1728159166~hmac=305f30c24d6491e4701ab8228780ffd02a55a704b1bc77ce5ed55ce2c7c471da&w=740', // Replace with actual image URL
  };

  const imageModal = () => setImageModalVisible(!imageModalVisible);

  return (
    <View style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={[Themes.colors.red, Themes.colors.backgroundColor]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={{flex: 1}}>
          <View style={styles.profileInfo}>
            <TouchableOpacity
              onPress={imageModal}
              style={styles.imageContainer}>
              <Image
                source={{uri: user.profileImage}}
                style={styles.profileImage}
              />
              <View style={styles.cameraIconContainer}>
                <CameraIcon />
              </View>
            </TouchableOpacity>
            <Text style={styles.greeting}>Hi, {user.username}!</Text>
            <Text style={styles.name}>{user.name}</Text>
          </View>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.projectsCompleted}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.totalProjects}</Text>
            <Text style={styles.statLabel}>Total Projects</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.connections}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <ProfileOption
            icon={<QuestionCircleIcon />}
            title="Project Requests"
            subtitle="Manage your project requests"
            onPress={() => navigate('Advanced')}
          />
          <ProfileOption
            icon={<PeopleIcon />}
            title="Find Collaborators"
            subtitle="Connect with students worldwide"
            onPress={() => {
              /* Handle press */
            }}
          />
          <ProfileOption
            icon={<AccountCancelIcon />}
            title="Blocked Users"
            subtitle="Manage blocked users"
            onPress={() => {
              /* Handle press */
            }}
          />
          <ProfileOption
            icon={<LockClosedIcon />}
            title="Privacy Settings"
            subtitle="Update your privacy preferences"
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
      </ScrollView>

      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={imageModal}>
        <Pressable style={styles.modalContainer} onPress={imageModal}>
          <View style={styles.modalContent}>
            <Pressable onPress={e => e.stopPropagation()}>
              <View style={styles.modalInner}>
                <TouchableOpacity
                  onPress={imageModal}
                  style={styles.closeButton}>
                  <CloseIcon />
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalOption}>
                  <CameraIcon />
                  <Text style={styles.modalOptionText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalOption}>
                  <ImagesIcon />
                  <Text style={styles.modalOptionText}>
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <CustomBottomNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
  },
  greeting: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginTop: -30,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  statLabel: {
    fontSize: 14,
    color: '#718096',
    marginTop: 5,
  },
  optionsContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
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
    borderRadius: 12,
  },
  logoutText: {
    color: Themes.colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Themes.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalInner: {
    width: '100%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: Themes.colors.textColor,
  },
});
