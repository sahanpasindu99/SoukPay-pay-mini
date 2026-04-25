import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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

const RewardSkeleton = ({ count = 3 }: { count?: number }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1000 }),
        withTiming(0.8, { duration: 1000 }),
      ),
      -1,
      true,
    ),
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={`reward-skeleton-${index}`}
          style={[styles.cardContainer, animatedStyle]}
        >
          <View style={styles.card}>
            {/* Image Container Skeleton */}
            <View style={[styles.imageContainer, styles.skeletonBase]} />

            <View style={styles.details}>
              <View style={styles.headerRow}>
                <View style={[styles.skeletonTitle, styles.skeletonBase]} />
                <View style={[styles.skeletonBadge, styles.skeletonBase]} />
              </View>

              <View style={[styles.skeletonDesc, styles.skeletonBase]} />
              <View
                style={[
                  styles.skeletonDesc,
                  styles.skeletonBase,
                  { width: "60%", marginTop: 8 },
                ]}
              />

              <View style={styles.footer}>
                <View>
                  <View
                    style={[
                      styles.skeletonCostLabel,
                      styles.skeletonBase,
                      { marginBottom: 4 },
                    ]}
                  />
                  <View
                    style={[styles.skeletonCostValue, styles.skeletonBase]}
                  />
                </View>
                <View style={[styles.skeletonBtn, styles.skeletonBase]} />
              </View>
            </View>
          </View>
        </Animated.View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: responsiveScreenWidth(0),
    paddingBottom: responsiveScreenHeight(10),
  },
  cardContainer: {
    marginBottom: responsiveScreenHeight(4),
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: responsiveScreenWidth(4),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  skeletonBase: {
    backgroundColor: "#E8E8F0",
    borderRadius: 8,
  },
  imageContainer: {
    height: responsiveScreenHeight(33),
    width: "100%",
    borderRadius: 0,
  },
  details: {
    padding: responsiveScreenHeight(3),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveScreenHeight(2.3),
  },
  skeletonTitle: {
    height: 22,
    width: "50%",
  },
  skeletonBadge: {
    height: 24,
    width: 70,
    borderRadius: 6,
  },
  skeletonDesc: {
    height: 14,
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: responsiveScreenHeight(4),
  },
  skeletonCostLabel: {
    height: 12,
    width: 40,
  },
  skeletonCostValue: {
    height: 20,
    width: 80,
  },
  skeletonBtn: {
    height: 48,
    width: 120,
    borderRadius: 30,
  },
});

export default RewardSkeleton;
