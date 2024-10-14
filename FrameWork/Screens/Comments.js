import React, {useState, useContext, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  SafeAreaView,
} from 'react-native';
import {useLocation, useNavigate} from 'react-router-native';
import Svg, {Path} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import {supabase} from '../Supabase/supabase';
import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';
import {AppContext} from '../Components/GlobalVariables';
import {Themes} from '../Components/Themes';

const IconButton = ({onPress, children}) => (
  <TouchableOpacity onPress={onPress} style={styles.iconButton}>
    {children}
  </TouchableOpacity>
);

const BackIcon = ({color}) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      fill={color}
    />
  </Svg>
);

const ReplyIcon = ({color}) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
      fill={color}
    />
  </Svg>
);

const EditIcon = ({color}) => (
  <Svg height={24} width={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6 20.71 5.61L18.37 3.27C17.98 2.88 17.33 2.88 16.94 3.27L15.13 5.08L18.88 8.83L20.71 7.04Z"
      fill={color}
    />
  </Svg>
);

const SendIcon = ({color}) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill={color} />
  </Svg>
);

export default function Comments() {
  const navigate = useNavigate();
  const {userUID, userInfo} = useContext(AppContext);
  const [comments, setComments] = useState('');
  const location = useLocation();
  const [commentList, setCommentList] = useState([]);
  const {projectTitle, doc_id} = location.state || {};

  useEffect(() => {
    fetchComments();
    const channel = supabase
      .channel('realtime-comments')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'comments'},
        handleRealtimeUpdate,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRealtimeUpdate = payload => {
    const newComment = payload.new;
    setCommentList(prevComments => {
      const exists = prevComments.some(comment => comment.id === newComment.id);
      if (!exists) {
        if (newComment.creator_id !== userUID) {
          onDisplayNotification(newComment);
        }
        return [newComment, ...prevComments];
      }
      return prevComments;
    });
  };

  async function fetchComments() {
    const {data, error} = await supabase
      .from('comments')
      .select('*')
      .order('created_at', {ascending: false})
      .eq('doc_id', doc_id);

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setCommentList(data);
      //console.log(data);
    }
  }

  async function addComment() {
    if (comments.trim().length < 5) {
      alert('Comment must be at least 5 characters long');
      return;
    }

    const {error} = await supabase.from('comments').insert({
      creator_id: userUID,
      updated_at: new Date().toLocaleTimeString(),
      creator_avatar: userInfo.avatar_url,
      creator: userInfo.full_name,
      message: comments.trim(),
      replies_length: 0,
      doc_id: doc_id,
    });

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setComments('');
      await updateNotification();
    }
  }

  async function updateNotification() {
    const {error} = await supabase.from('notifications').insert({
      activity_type: 'comment',
      activity: `${userInfo.full_name} commented on ${projectTitle}`,
      user_id: userUID,
      read: false,
      avatar_url: userInfo.avatar_url,
      time_posted: new Date().toLocaleTimeString(),
    });

    if (error) {
      console.error('Error updating notification:', error);
    }
  }

  async function onDisplayNotification(comment) {
    try {
      await notifee.requestPermission();
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: `New comment from ${comment.creator}`,
        body: comment.message,
        android: {
          channelId,
          smallIcon: 'ic_notification',
          style: {type: AndroidStyle.BIGTEXT, text: comment.message},
          pressAction: {id: 'default', launchActivity: 'default'},
          showTimestamp: true,
          colorized: true,
          color: 'white',
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Themes.colors.red, Themes.colors.darkGray]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.container}>
        <View style={styles.header}>
          <IconButton onPress={() => navigate(-1)}>
            <BackIcon color={Themes.colors.white} />
          </IconButton>
          <Text style={styles.title}>Comments</Text>
        </View>

        <Text style={styles.projectTitle}>{projectTitle}</Text>

        <ScrollView style={styles.commentList}>
          {commentList.map(comment => (
            <View style={styles.commentCard} key={comment.id}>
              <View style={styles.userInfo}>
                <Image
                  source={{
                    uri:
                      comment.creator_avatar ||
                      'https://via.placeholder.com/50',
                  }}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.userName}>{comment.creator}</Text>
                  <Text style={styles.timePosted}>{comment.updated_at}</Text>
                </View>
              </View>
              <Text style={styles.content}>{comment.message}</Text>
              <View style={styles.commentActions}>
                <IconButton
                  onPress={() => navigate('Reply', {commentId: comment.id})}>
                  <ReplyIcon color={Themes.colors.red} />
                </IconButton>
                <Text style={styles.replyCount}>{comment.replies_length}</Text>
                <IconButton
                  onPress={() =>
                    navigate('EditComment', {commentId: comment.id})
                  }>
                  <EditIcon color={Themes.colors.red} />
                </IconButton>
              </View>
            </View>
          ))}
        </ScrollView>

        <LinearGradient
          colors={[Themes.colors.red, Themes.colors.orange]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={[
            styles.inputContainer,
            {
              flexDirection: 'row',
              alignItems: comments.length > 25 ? 'flex-start' : 'center',
            },
          ]}>
          <TextInput
            placeholder="Share your thoughts..."
            value={comments}
            onChangeText={setComments}
            multiline
            maxLength={600}
            placeholderTextColor={Themes.colors.white}
            style={[styles.input, {color: Themes.colors.white}]}
          />
          <IconButton onPress={addComment}>
            <SendIcon color={Themes.colors.white} />
          </IconButton>
        </LinearGradient>
        <Text style={styles.characterCount}>{comments.length}/600</Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Themes.colors.red,
  },
  container: {
    flex: 1,
    //padding: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.bold,
    marginLeft: 16,
  },
  projectTitle: {
    color: Themes.colors.white,
    fontSize: 18,
    fontFamily: Themes.fonts.semiBold,
    textAlign: 'center',
    marginBottom: 16,
  },
  commentList: {
    flex: 1,
  },
  commentCard: {
    backgroundColor: Themes.colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: Themes.fonts.semiBold,
    color: Themes.colors.textColor,
  },
  timePosted: {
    fontSize: 12,
    color: Themes.colors.darkGray,
    fontFamily: Themes.fonts.regular,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: Themes.colors.textColor,
    marginBottom: 12,
    fontFamily: Themes.fonts.regular,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyCount: {
    marginLeft: 4,
    marginRight: 16,
    color: Themes.colors.darkGray,
    fontFamily: Themes.fonts.regular,
  },
  inputContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: Themes.colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: Themes.fonts.regular,
    color: Themes.colors.white,
    maxHeight: 100,
  },
  characterCount: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: Themes.colors.white,
    marginTop: 4,
    fontFamily: Themes.fonts.regular,
  },
  iconButton: {
    padding: 8,
  },
});
