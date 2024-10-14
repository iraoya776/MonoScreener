import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {Themes} from './Themes';
import {useNavigate, useLocation} from 'react-router-native';

const HomeIcon = props => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 22V12h6v10"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CreateIcon = props => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 5v14M5 12h14"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ProfileIcon = props => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 3a4 4 0 100 8 4 4 0 000-8z"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CustomBottomNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {name: 'Home', icon: HomeIcon, path: '/Home'},
    {name: 'Create', icon: CreateIcon, path: '/Create'},
    {name: 'Me', icon: ProfileIcon, path: '/Profile'},
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tabButton}
          onPress={() => navigate(tab.path)}>
          <tab.icon
            color={
              location.pathname === tab.path ? Themes.colors.red : '#000000'
            }
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  location.pathname === tab.path
                    ? Themes.colors.red
                    : '#000000',
              },
            ]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Themes.colors.backgroundColor,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tabButton: {
    alignItems: 'center',
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: Themes.fonts.medium,
  },
});

export default CustomBottomNavigator;
