import { Fonts } from "@/constants/theme";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import { AnimatedCounter } from "../loader/amount-loader";

export default function StatCard() {
  const { user } = useUser();

  return (
    <View style={styles.heroCard}>
      <LinearGradient
        colors={["#05052b", "#00003C"]}
        locations={[0.2, 0.9]}
        style={styles.heroAccentCircle}
      />

      <View style={styles.heroContent}>
        <Text style={styles.heroLabel}>CURRENT ASSETS</Text>
        <AnimatedCounter
          value={user?.availablePoints || 0}
          style={styles.pointsValue}
        />
        {/* <Text style={styles.pointsValue}>
          {formatPoints(user?.availablePoints || 0)}
        </Text> */}
        <Text style={styles.pointsSub}>Vault Points Available</Text>

        <View style={styles.heroFooter}>
          {/* coin stack */}
          <View style={styles.coinStack}>
            <View style={[styles.coin, styles.coinWhite, { zIndex: 1 }]}>
              <Text style={styles.coinText}>S</Text>
            </View>
            <View style={[styles.coin, styles.coinYellow, { zIndex: 2 }]}>
              <Ionicons name="star" size={14} color="#00003C" />
            </View>
          </View>

          <Pressable style={styles.redeemBtn}>
            <Text style={styles.redeemText}>Redeem Now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#00003C",
    borderRadius: responsiveScreenWidth(4),
    height: responsiveScreenHeight(26),
    overflow: "hidden",
    position: "relative",
    padding: responsiveScreenWidth(8),
  },
  heroAccentCircle: {
    position: "absolute",
    width: responsiveScreenWidth(70),
    height: responsiveScreenWidth(70),
    borderRadius: responsiveScreenWidth(35),
    top: -responsiveScreenWidth(25),
    right: -responsiveScreenWidth(20),
  },
  heroContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  heroLabel: {
    color: "#FFE16D",
    fontSize: responsiveFontSize(1.35),
    fontWeight: "600",
    fontFamily: Fonts.inter.medium,
    letterSpacing: 1.2,
  },
  pointsValue: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(5.6),
    fontWeight: "800",
    fontFamily: Fonts.manrope.extraBold,
    marginTop: 4,
  },
  pointsSub: {
    color: "#E4E1EBCC",
    fontSize: responsiveFontSize(1.75),
    fontFamily: Fonts.inter.medium,
    fontWeight: "500",
  },
  heroFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  coinStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  coin: {
    width: responsiveScreenWidth(10),
    height: responsiveScreenWidth(10),
    borderRadius: responsiveScreenWidth(5),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00003C",
  },
  coinWhite: {
    backgroundColor: "#FFFFFF",
  },
  coinYellow: {
    backgroundColor: "#FCD400",
    marginLeft: -responsiveScreenWidth(4),
  },
  coinText: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: "800",
    color: "#00003C",
  },
  redeemBtn: {
    backgroundColor: "#FCD400",
    paddingVertical: responsiveScreenHeight(1.35),
    paddingHorizontal: responsiveScreenWidth(6.5),
    borderRadius: 25,
  },
  redeemText: {
    color: "#00003C",
    fontWeight: "700",
    fontFamily: Fonts.manrope.bold,
    fontSize: responsiveFontSize(1.65),
  },
});
