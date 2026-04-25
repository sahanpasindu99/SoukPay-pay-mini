import ActionCards from "@/components/home/action-card";
import ActivityLog from "@/components/home/activity-log";
import PromoCard from "@/components/home/promo-card";
import StatCard from "@/components/home/stat-card";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

export default function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      <View style={{ height: responsiveScreenHeight(3) }} />
      <StatCard />
      <View style={{ height: responsiveScreenHeight(5) }} />
      <ActionCards />
      <View style={{ height: responsiveScreenHeight(5) }} />
      <ActivityLog />
      <View style={{ height: responsiveScreenHeight(5) }} />
      <PromoCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf8ff",
  },
  contentContainer: {
    paddingHorizontal: responsiveScreenWidth(5.3),
    paddingBottom: responsiveScreenHeight(15),
  },
});
