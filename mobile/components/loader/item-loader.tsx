import { Fonts } from "@/constants/theme";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const AnimatedDots = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0.2)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const anim1 = createAnimation(dot1, 0);
    const anim2 = createAnimation(dot2, 150);
    const anim3 = createAnimation(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1, dot2, dot3]);

  const getDotOpacity = (animValue: Animated.Value) => {
    return animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });
  };

  const getDotScale = (animValue: Animated.Value) => {
    return animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1.2],
    });
  };

  return (
    <View style={styles.dotsContainer}>
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: getDotOpacity(dot1),
            transform: [{ scale: getDotScale(dot1) }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: getDotOpacity(dot2),
            transform: [{ scale: getDotScale(dot2) }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: getDotOpacity(dot3),
            transform: [{ scale: getDotScale(dot3) }],
          },
        ]}
      />
    </View>
  );
};

export const ItemLoader = () => {
  return (
    <View style={styles.container}>
      <AnimatedDots />
      <Text style={styles.loadingText}>LOADING OLDER ENTRIES</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#B4B2A9",
  },
  loadingText: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: Fonts.inter.medium,
    color: "#767684",
    letterSpacing: 1.2,
  },
});

export default ItemLoader;
