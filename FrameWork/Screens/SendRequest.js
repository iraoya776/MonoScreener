import React, {useState, useContext, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useLocation, useNavigate} from 'react-router-native';
import {supabase} from '../Supabase/supabase';
import {AppContext} from '../Components/GlobalVariables';
import {Themes} from '../Components/Themes';
import notifee, {
  AndroidImportance,
  EventType,
  AndroidStyle,
  AuthorizationStatus,
  AndroidColor,
  AndroidCategory,
  AndroidVisibility,
} from '@notifee/react-native';

const {width} = Dimensions.get('window');

// SVG Icons Components
const ArrowLeftIcon = ({color = '#FFF', size = 24}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SearchIcon = ({color = '#666', size = 20}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 21L16.65 16.65"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const UserIcon = ({color = '#666', size = 24}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AddIcon = ({color = '#FFF', size = 20}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function SendRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const {userUID, reload, userInfo, setPreloader} = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const {
    projectTitle,
    creators_id,
    created_at,
    doc_id,
    project_id,
    creator_id,
  } = location.state || {};

  useEffect(() => {
    const retrieveData = async () => {
      setLoading(true);
      const {data, error} = await supabase.from('profiles').select('*');
      if (!error) {
        setUsers(data);
        setFilteredUsers(data);
      }
      setLoading(false);
    };
    retrieveData();
  }, [userUID, reload]);

  const handleSearch = text => {
    setSearchQuery(text);
    const filtered = users.filter(user =>
      user.full_name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredUsers(filtered);
  };

  // In SendRequest.js
  const sendRequest = async id => {
    try {
      // Get current project data
      const {data: projectData, error: fetchError} = await supabase
        .from('projects_info')
        .select('*')
        .eq('id', project_id)
        .single();

      if (fetchError) {
        Alert.alert('Error', 'Failed to fetch project data');
        return;
      }

      // Check if request already exists
      let currentRequests = projectData?.requests || [];
      if (currentRequests.includes(id)) {
        Alert.alert(
          'Request already sent',
          'You have already sent a request for this project.',
        );
        return;
      }

      // Update requests array and include who made the modification
      const {error: updateError} = await supabase
        .from('projects_info')
        .update({
          requests: [...currentRequests, id],
          updated_at: new Date().toISOString(),
        })
        .eq('id', project_id);

      if (updateError) {
        Alert.alert('Error', 'Failed to send request');
        return;
      }

      Alert.alert('Success', 'Request sent successfully');
    } catch (error) {
      console.error('Error sending request:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const ProfileCard = ({user}) => (
    <View style={[styles.profileCard]}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImage}>
          {user.avatar_url ? (
            <Image source={{uri: user.avatar_url}} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <UserIcon size={40} color={Themes.colors.gray} />
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.fullName}>{user.full_name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>25</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            //addUser(user.id, user.full_name, user.avatar_url);
            sendRequest(user.id, user.avatar_url);
            // setData({name: userInfo.full_name, avatar: userInfo.avatar_url});
          }}>
          <AddIcon />
          <Text style={styles.addButtonText}>Send Request</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.lastActive}>
        joined at: {new Date(user.updated_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigate(-1)}
          style={styles.backButton}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Request</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon color="#666" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor={Themes.colors.darkGray}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Themes.colors.red} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => {
              return (
                <View
                  key={user.id}
                  style={
                    {
                      //display: creator_id === user.id ? 'none' : 'flex',
                    }
                  }>
                  <ProfileCard user={user} />
                </View>
              );
            })
          ) : (
            // user => <ProfileCard key={user.id} user={user} />)
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No users found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Themes.colors.red,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 16,
    fontFamily: Themes.fonts.regular,
  },
  searchContainer: {
    padding: 16,
    //backgroundColor: Themes.colors.red,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  searchInput: {
    fontFamily: Themes.fonts.regular,
    //flex: 1,
    marginLeft: 8,
    fontSize: 18,
    color: '#333',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 18,
    //fontWeight: '600',
    color: Themes.colors.darkGray,
    fontFamily: Themes.fonts.extraBold,
    letterSpacing: 1,
  },
  username: {
    fontSize: 14,
    //color: '#666',
    marginTop: 4,
    fontFamily: Themes.fonts.regular,
    color: Themes.colors.textColor,
  },
  email: {
    fontSize: 16,
    //color: '#666',
    marginTop: 4,
    fontFamily: Themes.fonts.regular,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    // fontWeight: '600',
    color: '#333',
    fontFamily: Themes.fonts.medium,
  },
  statLabel: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
    fontFamily: Themes.fonts.regular,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Themes.colors.red,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontFamily: Themes.fonts.bold,
    letterSpacing: 1,
  },
  lastActive: {
    fontSize: 14,
    color: '#999',
    marginTop: 16,
    textAlign: 'right',
    fontFamily: Themes.fonts.regular,
  },
});
