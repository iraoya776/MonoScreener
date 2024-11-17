import React, {useState, useRef} from 'react';
import {View, StyleSheet, Animated, PanResponder} from 'react-native';

const DraggableBox = () => {
  const [position, setPosition] = useState({x: 0, y: 0});
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: position.x,
          y: position.y,
        });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: pan.x,
            dy: pan.y,
          },
        ],
        {useNativeDriver: false},
      ),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        setPosition({
          x: gestureState.x0,
          y: gestureState.y0,
        });
      },
    }),
  ).current;

  const animatedStyle = {
    transform: pan.getTranslateTransform(),
  };

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.box, animatedStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
  },
});

export default DraggableBox;
