import { Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
    responsiveFontSize,
    responsiveScreenHeight,
    responsiveScreenWidth,
} from "react-native-responsive-dimensions";

export default function MilestoneCard() {
  const bonusAmount = 500.0;

  return (
    <View style={styles.card}>
      <View style={styles.watermarkContainer}>
        <Ionicons
          name="star-outline"
          size={responsiveFontSize(8)}
          color="#E2E2EC"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>MILESTONE REACHED</Text>
        </View>

        <Text style={styles.title}>Referral Platinum Bonus</Text>
        <Text style={styles.subtitle}>5 users successfully onboarded</Text>

        <Text style={styles.amountText}>
          + $
          {bonusAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F5F2FC",
    borderRadius: responsiveScreenWidth(3.4),
    padding: responsiveScreenWidth(6),
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E2EC",
    marginTop: responsiveScreenHeight(2),
  },
  watermarkContainer: {
    position: "absolute",
    right: responsiveScreenWidth(4),
    top: responsiveScreenHeight(1.7),
    opacity: 0.8,
  },
  content: {
    zIndex: 1,
  },
  badge: {
    backgroundColor: "#FCD400",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: responsiveFontSize(1.1),
    fontFamily: Fonts.inter.bold,
    color: "#00003C",
    fontWeight: "700",
  },
  title: {
    fontSize: responsiveFontSize(2.35),
    fontFamily: Fonts.manrope.bold,
    color: "#1B1B22",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: Fonts.inter.medium,
    color: "#767684",
    marginTop: responsiveScreenHeight(0.7),
    marginBottom: responsiveScreenHeight(2),
  },
  amountText: {
    fontSize: responsiveFontSize(3.25),
    fontFamily: Fonts.manrope.extraBold,
    color: "#2E7D32",
    fontWeight: "800",
  },
});
