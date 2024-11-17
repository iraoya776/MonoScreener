import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {supabase} from '../Supabase/supabase';

export class NotificationHandler {
  static subscription = null;

  static async createNotificationChannel() {
    try {
      await notifee.createChannel({
        id: 'project_requests',
        name: 'Project Requests',
        importance: AndroidImportance.HIGH,
        sound: 'default', // Add sound for better notification
        vibration: true, // Add vibration
      });
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }

  static async displayNotification(title, body) {
    try {
      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId: 'project_requests',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          sound: 'default',
          vibrationPattern: [300, 500],
          lights: ['red', 300, 600],
          smallIcon: 'ic_launcher', // Make sure this icon exists in your android/app/src/main/res/mipmap
        },
        ios: {
          // Add iOS support
          sound: 'default',
          critical: true,
          importance: 'high',
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }

  static subscribeToRequests(userId) {
    if (!userId) {
      console.error('No userId provided to subscribeToRequests');
      return;
    }

    // Clean up any existing subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Create a new subscription
    this.subscription = supabase
      .channel('projects_requests')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'projects_info',
          filter: `requests::jsonb ? '${userId}'`, // Fixed filter syntax for JSON array containment
        },
        async payload => {
          console.log('Received payload:', payload); // Debug log

          try {
            // Get the project details
            const {data: projectData, error} = await supabase
              .from('projects_info')
              .select('title, created_by')
              .eq('id', payload.new.id)
              .single();

            if (error) {
              console.error('Error fetching project details:', error);
              return;
            }

            // Get the sender's details
            const {data: senderData, error: senderError} = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', projectData.created_by)
              .single();

            if (senderError) {
              console.error('Error fetching sender details:', senderError);
              return;
            }

            // Display the notification
            await this.displayNotification(
              'New Project Request',
              `${senderData.full_name} has sent you a request to join "${projectData.title}"`,
            );
          } catch (error) {
            console.error('Error in subscription handler:', error);
          }
        },
      )
      .subscribe(status => {
        console.log('Subscription status:', status); // Debug log
      });
  }

  static unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  // Add this method to initialize the handler
  static async initialize(userId) {
    await this.createNotificationChannel();
    await notifee.requestPermission(); // Request notification permissions
    this.subscribeToRequests(userId);

    // Set up foreground handler
    return notifee.onForegroundEvent(({type, detail}) => {
      console.log('Foreground event:', type, detail);
    });
  }
}
