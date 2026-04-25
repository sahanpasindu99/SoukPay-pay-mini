import { Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
    responsiveFontSize,
    responsiveScreenHeight,
    responsiveScreenWidth,
} from "react-native-responsive-dimensions";

export default function PromoCard() {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.contentSection}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PLATINUM EXCLUSIVE</Text>
        </View>

        <Text style={styles.title}>Unlock the Safari Collection.</Text>

        <Text style={styles.description}>
          Use 5,000 points to access curated travel experiences across
          Sub-Saharan Africa.
        </Text>

        <Pressable onPress={() => {}} style={styles.actionRow}>
          <Text style={styles.actionText}>Explore Collection</Text>
          <Ionicons name="arrow-forward" size={20} color="#00003C" />
        </Pressable>
      </View>

      <Image
        source={require("@/assets/images/banner/safari.png")}
        style={styles.heroImage}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#EAE7F0",
    borderRadius: responsiveScreenHeight(1.6),
    overflow: "hidden",
  },
  contentSection: {
    padding: responsiveScreenWidth(6),
  },
  badge: {
    backgroundColor: "#00003C",
    alignSelf: "flex-start",
    paddingHorizontal: responsiveScreenHeight(1.5),
    paddingVertical: responsiveScreenHeight(0.7),
    borderRadius: responsiveScreenHeight(0.8),
    marginBottom: responsiveScreenHeight(2),
    letterSpacing: 0.5,
  },
  badgeText: {
    color: "#FCD400",
    fontSize: responsiveFontSize(1.2),
    fontFamily: Fonts.inter.semibold,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: responsiveFontSize(3.7),

    fontFamily: Fonts.manrope.extraBold,
    fontWeight: "800",
    color: "#00003C",
    lineHeight: 34,
    marginBottom: 16,
  },
  description: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: Fonts.inter.light,
    color: "#464653",
    lineHeight: 24,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    color: "#00003C",
    marginRight: 8,
  },
  heroImage: {
    width: "100%",
    height: responsiveScreenHeight(22),
  },
});
