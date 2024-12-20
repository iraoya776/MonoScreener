import React, {useState, useContext} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {TextInput} from 'react-native';
import {AppContext} from '../Components/GlobalVariables';
import {supabase} from '../Supabase/supabase';
import Svg, {Path} from 'react-native-svg';
import {useNavigate} from 'react-router-native';
import CustomBottomNavigator from '../Components/CustomBottomTab';
import LinearGradient from 'react-native-linear-gradient';
import {Themes} from '../Components/Themes';

const CreateProject = () => {
  const navigate = useNavigate();
  const {userInfo, userUID, setPreloader} = useContext(AppContext);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  async function updateRoom() {
    setPreloader(true);
    const {data, error} = await supabase.from('projects_info').upsert({
      topic: projectTitle,
      description: projectDescription,
      updated_at: new Date().toLocaleString(),
      creators: [userInfo.full_name], // Start the array with the new creator
      admin: userInfo.full_name,
      content: null,
      comments_length: 0,
      creators_id: [userUID], // Start the array with the new creator ID
      creators_avatar: [userInfo.avatar_url],
      creator_id: userUID,
    });
    if (error) {
      setPreloader(false);
      console.log(error);
    } else {
      setPreloader(false);
      ///console.log('successful');
      navigate('/Editor');
    }
  }

  // async function updateProject() {
  //   setPreloader(true);
  //   const {error, data} = await supabase.from('project_ops').upsert({
  //     participants: [userInfo.full_name],
  //     project_title: projectTitle,
  //     participants_avatar: [userInfo.avatar_url],
  //     creator: userInfo.full_name,
  //     creator_avatar: userInfo.avatar_url,
  //     participants_id: [userUID],
  //     creator_id: userUID,
  //     started_at: new Date().toLocaleString(),
  //   });
  //   if (error) {
  //     setPreloader(false);
  //     console.log(error);
  //   } else {
  //     setPreloader(false);
  //     console.log('successful');
  //     //navigate('/Editor');
  //   }
  // }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <LinearGradient
        colors={[Themes.colors.red, Themes.colors.backgroundColor]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={[{flex: 1}]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Create!</Text>
            <Text style={styles.subtitle}>
              Let's bring your project to life
            </Text>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={styles.inputIcon.color}
                  style={styles.inputIcon}>
                  <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </Svg>
                <TextInput
                  placeholder="Project title"
                  value={projectTitle}
                  onChangeText={setProjectTitle}
                  style={styles.input}
                  multiline={true}
                  numberOfLines={2}
                  maxLength={100}
                  placeholderTextColor={styles.input.placeholderTextColor}
                />
              </View>
              <View style={styles.inputContainer}>
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={styles.inputIcon.color}
                  style={styles.inputIcon}>
                  <Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </Svg>
                <TextInput
                  placeholder="Project description"
                  value={projectDescription}
                  onChangeText={setProjectDescription}
                  multiline={true}
                  numberOfLines={5}
                  maxLength={250}
                  style={[styles.input, styles.textArea]}
                  placeholderTextColor={styles.input.placeholderTextColor}
                />
                <Text
                  style={{
                    marginTop: 30,
                    color: Themes.colors.backgroundColor,
                    fontFamily: Themes.fonts.medium,
                  }}>
                  {projectDescription.length}/
                  <Text
                    style={{
                      color: Themes.colors.backgroundColor,
                      fontFamily: Themes.fonts.medium,
                      fontSize: 15,
                    }}>
                    200
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  updateRoom();
                  // updateProject();
                }}
                disabled={!projectTitle || !projectDescription}>
                <LinearGradient
                  colors={[Themes.colors.red, Themes.colors.darkGray]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[
                    styles.createProject,
                    {opacity: projectTitle && projectDescription ? 1 : 0.5},
                  ]}>
                  <Text style={styles.buttonText}>Start Project</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      <CustomBottomNavigator />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 48,
    color: Themes.colors.white,
    marginBottom: 10,
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    fontFamily: Themes.fonts.extraBold,
  },
  subtitle: {
    textAlign: 'left',
    marginBottom: 35,
    fontSize: 18,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.regular,
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: Themes.colors.darkGray,
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 15,
    color: Themes.colors.white,
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: Themes.colors.backgroundColor,
    paddingVertical: 12,
    placeholderTextColor: '#A0AEC0',
    fontFamily: Themes.fonts.regular,
  },
  textArea: {
    //height: 100,
    textAlignVertical: 'top',
  },
  createProject: {
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Themes.fonts.extraBold,
  },
});

export default CreateProject;
