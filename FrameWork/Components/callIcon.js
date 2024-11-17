import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

const CallIcon = ({width = 24, height = 24, color = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    {/* Phone receiver */}
    <Path
      d="M6 2C6.6 2 7 2.4 7 3V5C7 5.6 6.6 6 6 6L4 6C3.4 6 3 6.4 3 7V10C3 13.3 5.7 16 9 16H12C12.6 16 13 15.6 13 15L13 13C13 12.4 12.6 12 12 12H10C9.4 12 9 11.6 9 11V9C9 8.4 9.4 8 10 8L12 8C13.7 8 15 9.3 15 11V13C15 15.8 12.8 18 10 18H7C3.1 18 0 14.9 0 11V8C0 5.8 1.8 4 4 4L6 4C6.6 4 7 3.6 7 3V1C7 0.4 6.6 0 6 0H4C1.3 0 -1 2.3 -1 5L-1 11C-1 15.4 3.1 19 7 19H10C13.9 19 17 15.9 17 12V10C17 7.3 14.7 5 12 5H10C8.3 5 7 3.7 7 2L7 0.5C7 0.2 6.8 0 6.5 0C6.2 0 6 0.2 6 0.5L6 2Z"
      fill={color}
    />
    {/* Speaker line */}
    <Path
      d="M20 7L20 5C20 4.4 19.6 4 19 4L17 4C16.4 4 16 4.4 16 5V7C16 7.6 16.4 8 17 8H19C19.6 8 20 7.6 20 7Z"
      fill={color}
    />
  </Svg>
);

export default CallIcon;
