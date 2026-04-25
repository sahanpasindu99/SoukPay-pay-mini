import { Fonts } from "@/constants/theme";
import { useUser } from "@/hooks/useUser";
import { formatPoints } from "@/util/point-formatter";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  responsiveFontSize,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

export default function HistoryBalance() {
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <Text style={styles.label}>AVAILABLE BALANCE</Text>

      <View style={styles.balanceRow}>
        <Text style={styles.balanceText}>
          {formatPoints(user?.availablePoints || 0)}
        </Text>
        <View style={styles.starCircle}>
          <Ionicons
            name="star"
            size={responsiveFontSize(2.8)}
            color="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>ELITE TIER</Text>
        </View>

        <View style={styles.expiryBadge}>
          <Text style={styles.expiryText}>EXPIRES IN 12D</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: responsiveScreenWidth(6),
    backgroundColor: "transparent",
  },
  label: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: Fonts.inter.medium,
    fontWeight: "400",
    color: "#64748B",
    letterSpacing: 1,
    marginBottom: responsiveScreenWidth(1.1),
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveScreenWidth(0.3),
  },
  balanceText: {
    fontSize: responsiveFontSize(6),
    fontFamily: Fonts.manrope.extraBold,
    fontWeight: "800",
    color: "#00003C",
    marginRight: 10,
  },
  starCircle: {
    width: responsiveScreenWidth(9.5),
    height: responsiveScreenWidth(9.5),
    borderRadius: responsiveScreenWidth(4.75),
    backgroundColor: "#FCD400",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
  },
  tierBadge: {
    backgroundColor: "#FFE16D",
    paddingHorizontal: 16,
    paddingVertical: responsiveScreenWidth(2.3),
    borderRadius: responsiveScreenWidth(4.8),
  },
  tierText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: Fonts.inter.bold,
    fontWeight: "700",
    color: "#00003C",
  },
  expiryBadge: {
    backgroundColor: "#E8E8F0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  expiryText: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: Fonts.inter.bold,
    fontWeight: "700",
    color: "#464653",
  },
});
