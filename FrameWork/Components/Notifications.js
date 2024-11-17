import notifee, {
  AndroidImportance,
  EventType,
  AndroidStyle,
  AndroidVisibility,
  AndroidCategory,
} from '@notifee/react-native';
import {supabase} from '../Supabase/supabase';

class NotificationService {
  static instance = null;
  navigateToScreen = null;

  static getInstance() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setNavigation(navigateFunction) {
    this.navigateToScreen = navigateFunction;
  }

  async initialize() {
    await notifee.requestPermission({
      alert: true,
      sound: true,
      badge: true,
      criticalAlert: true,
    });

    await notifee.createChannel({
      id: 'project-requests',
      name: 'Project Requests',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
      visibility: AndroidVisibility.PUBLIC,
      badge: true,
    });

    notifee.onForegroundEvent(({type, detail}) => {
      if (
        type === EventType.PRESS &&
        detail.pressAction.id === 'project-requests'
      ) {
        this.navigateToScreen && this.navigateToScreen('/Confirmation');
      }
    });

    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (
        type === EventType.PRESS &&
        detail.pressAction.id === 'project-requests'
      ) {
        this.navigateToScreen && this.navigateToScreen('/Confirmation');
      }
    });
  }

  async startProjectListener(userUID) {
    return supabase
      .channel('project-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects_info',
          filter: 'requests=neq.accepted_requests', // Only listen for changes where requests is different from accepted_requests
        },
        async payload => {
          const projectData = payload.new;
          const previousData = payload.old;

          // Check if the requests array has actually changed
          const hasRequestsChanged =
            JSON.stringify(projectData.requests) !==
            JSON.stringify(previousData.requests);

          if (!hasRequestsChanged) {
            return; // Exit if requests array hasn't changed
          }

          // Find only new requests that weren't in the previous state
          const newRequests =
            projectData.requests?.filter(
              id => !previousData.requests?.includes(id),
            ) || [];

          // Only proceed if there are new requests
          if (newRequests.length > 0) {
            const newlyAddedUserId = newRequests[newRequests.length - 1];
            const senderInfo = await this.getUserInfo(projectData.creator_id);

            if (userUID === newlyAddedUserId) {
              await this.displayInvitationNotification(
                projectData.topic,
                senderInfo.full_name,
              );
            } else if (userUID === projectData.creator_id) {
              const newUserInfo = await this.getUserInfo(newlyAddedUserId);
              await this.displayNewMemberNotification(
                newUserInfo.full_name,
                projectData.topic,
              );
            }
          }
        },
      )
      .subscribe();
  }

  async getUserInfo(userId) {
    try {
      if (!userId) {
        console.warn('getUserInfo: No userId provided');
        return {full_name: 'Unknown User', avatar_url: null};
      }

      console.log('Attempting to fetch user info for userId:', userId);

      const {data, error} = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return {full_name: 'Unknown User', avatar_url: null};
      }

      if (!data) {
        console.warn('No data returned for userId:', userId);
        return {full_name: 'Unknown User', avatar_url: null};
      }

      console.log('Successfully fetched user info:', data);
      return data;
    } catch (error) {
      console.error('Error in getUserInfo:', error);
      return {full_name: 'Unknown User', avatar_url: null};
    }
  }

  async displayInvitationNotification(projectName, senderName) {
    try {
      await notifee.displayNotification({
        title: '🎉 New Project Invitation',
        body: `${senderName} invited you to join "${projectName}"`,
        android: {
          channelId: 'project-requests',
          importance: AndroidImportance.HIGH,
          priority: 'high',
          smallIcon: 'ic_notification',
          pressAction: {id: 'view-project'},
          style: {
            type: AndroidStyle.BIGTEXT,
            text: `${senderName} has invited you to join "${projectName}".`,
          },
          visibility: AndroidVisibility.PUBLIC,
        },
      });
    } catch (error) {
      console.error('Error displaying invitation notification:', error);
    }
  }

  async displayNewMemberNotification(newMemberName, projectName) {
    try {
      await notifee.displayNotification({
        title: '✅ Request Sent',
        body: `Invitation sent to ${newMemberName} for "${projectName}"`,
        android: {
          channelId: 'project-requests',
          importance: AndroidImportance.HIGH,
          priority: 'high',
          smallIcon: 'ic_notification',
          pressAction: {id: 'view-details'},
          style: {
            type: AndroidStyle.BIGTEXT,
            text: `Invitation sent to ${newMemberName} for "${projectName}".`,
          },
          visibility: AndroidVisibility.PUBLIC,
          category: AndroidCategory.SOCIAL,
        },
      });
    } catch (error) {
      console.error('Error displaying new member notification:', error);
    }
  }
}

export default NotificationService;
