import { StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import {
    responsiveScreenHeight,
    responsiveScreenWidth,
} from "react-native-responsive-dimensions";

const ActivitySkeleton = ({ count = 3 }: { count?: number }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.5, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
      true,
    ),
  }));

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={`skeleton-${index}`}
          style={[styles.itemCard, animatedStyle]}
        >
          <View style={styles.leftSection}>
            {/* Icon Box Skeleton */}
            <View style={[styles.iconBox, styles.skeletonBase]} />

            {/* Text Content Skeleton */}
            <View style={styles.textContainer}>
              <View
                style={[
                  styles.skeletonTitle,
                  styles.skeletonBase,
                  { marginBottom: 8 },
                ]}
              />
              <View style={[styles.skeletonMeta, styles.skeletonBase]} />
            </View>
          </View>

          {/* Right Section Skeleton */}
          <View style={styles.rightSection}>
            <View
              style={[
                styles.skeletonAmount,
                styles.skeletonBase,
                { marginBottom: 8 },
              ]}
            />
            <View style={[styles.skeletonLabel, styles.skeletonBase]} />
          </View>
        </Animated.View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: responsiveScreenWidth(3),
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: responsiveScreenHeight(1.7),
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    width: responsiveScreenHeight(5),
    height: responsiveScreenHeight(5),
    borderRadius: responsiveScreenHeight(0.9),
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  skeletonBase: {
    backgroundColor: "#E8E8E8",
    borderRadius: 6,
  },
  skeletonTitle: {
    height: 16,
    width: 120,
  },
  skeletonMeta: {
    height: 12,
    width: 90,
  },
  skeletonAmount: {
    height: 16,
    width: 70,
  },
  skeletonLabel: {
    height: 12,
    width: 50,
  },
});

export default ActivitySkeleton;
