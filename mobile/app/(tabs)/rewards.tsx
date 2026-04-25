import RewardsList from "@/components/reward/reward-list";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

export default function Rewards() {
  return (
    <View style={styles.container}>
      <RewardsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf8ff",
    paddingHorizontal: responsiveScreenWidth(5.3),
    marginBottom: responsiveScreenHeight(8),
  },
});
