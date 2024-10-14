import React from 'react';
import Svg, {Path} from 'react-native-svg';

const CommentIcon = ({width = 24, height = 24, color = '#000'}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M20 2H4C2.9 2 2 2.9 2 4V18C2 19.1 2.9 20 4 20H18L22 24V4C22 2.9 21.1 2 20 2ZM20 18L18 16H4V4H20V18Z"
        fill={color}
      />
    </Svg>
  );
};

export default CommentIcon;
