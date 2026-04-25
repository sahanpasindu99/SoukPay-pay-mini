import { Fonts } from "@/constants/theme";
import { useUser } from "@/hooks/useUser";
import { formatPoints } from "@/util/point-formatter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

export default function PortfolioCard() {
  const { user } = useUser();
  return (
    <View style={styles.outerContainer}>
      {/* <View style={styles.ledgerRow}>
        <MaterialCommunityIcons name="refresh" size={16} color="#94A3B8" />
        <Text style={styles.ledgerText}>UPDATING LEDGER</Text>
      </View> */}

      <View style={styles.card}>
        <LinearGradient
          colors={["#0000805b", "#00003cc7"]}
          locations={[0.12, 0.6]}
          style={styles.cardAccentCircle}
        />

        <Text style={styles.label}>PORTFOLIO VALUE</Text>

        <View style={styles.valueRow}>
          <Text style={styles.currencySymbol}>$</Text>
          <Text style={styles.valueText}>
            {formatPoints(user?.availablePoints || 0)}
          </Text>
        </View>

        <View style={styles.growthBadge}>
          <MaterialCommunityIcons
            name="trending-up"
            size={responsiveFontSize(1.7)}
            color="#FCD400"
          />
          <Text style={styles.growthText}>+12.4%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  ledgerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  ledgerText: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: Fonts.inter.bold,
    color: "#94A3B8",
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#00003C",
    width: "100%",
    borderRadius: 24,
    padding: responsiveScreenWidth(8),
    height: responsiveScreenHeight(22),
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  cardAccentCircle: {
    position: "absolute",
    width: responsiveScreenWidth(60),
    height: responsiveScreenWidth(60),
    borderRadius: responsiveScreenWidth(30),
    top: -responsiveScreenWidth(20),
    right: -responsiveScreenWidth(15),
    opacity: 0.6,
  },
  label: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: Fonts.inter.bold,
    color: "#94A3B8",
    letterSpacing: 1.2,
    marginBottom: 12,
    zIndex: 1,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    zIndex: 1,
  },
  currencySymbol: {
    fontSize: responsiveFontSize(3),
    fontFamily: Fonts.manrope.bold,
    color: "#FCD400",
    marginTop: 8,
    marginRight: 4,
  },
  valueText: {
    fontSize: responsiveFontSize(5.2),
    fontFamily: Fonts.manrope.extraBold,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    zIndex: 1,
  },
  growthText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: Fonts.inter.bold,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
