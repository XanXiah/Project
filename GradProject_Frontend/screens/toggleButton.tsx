import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRecoilState } from 'recoil';
import { isLeftState, searchKeywordState } from './recoilstate';

const ToggleButton = () => {
  const [isLeft, setIsLeft] = useRecoilState(isLeftState);
  const [translateValue] = useState(new Animated.Value(0));
  const handleToggle = () => {
    setIsLeft(!isLeft);
    console.log(isLeft);
    
    Animated.timing(translateValue, {
      toValue: isLeft ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const textlabel = isLeft ? 'SF' : 'MAJOR';
  const color = isLeft ? 'blue' : 'red';
  const circlePosition = isLeft ? 5 : 75;
  const textPosition = isLeft ? 30 : -30;
  const transformStyle = {
    transform: [
      {
        translateX: translateValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 50],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity onPress={handleToggle}>
      <View style={[styles.container, { backgroundColor: color }]}>
        <View style={[styles.circle, { left: circlePosition }]} />
        <Animated.View style={[styles.textContainer, transformStyle, { left: textPosition }]}>
          <Text style={styles.text}>{textlabel}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 30,
    width: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  textContainer: {
    position: 'absolute',
    height: 30,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ToggleButton;
