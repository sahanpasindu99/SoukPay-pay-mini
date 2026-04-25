import { formatPoints } from "@/util/point-formatter";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TextStyle } from "react-native";

interface AnimatedCounterProps {
  value: number;
  style?: TextStyle;
}

export const AnimatedCounter = ({ value, style }: AnimatedCounterProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animate from 0 to the target value
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1500, // 1.5 seconds for a smooth feel
      useNativeDriver: false, // Must be false to animate non-layout properties like numbers
    }).start();

    // Listen to the animation progress and update the local state
    const listenerId = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.floor(value));
    });

    return () => animatedValue.removeListener(listenerId);
  }, [value]);

  return <Text style={style}>{formatPoints(displayValue)}</Text>;
};
