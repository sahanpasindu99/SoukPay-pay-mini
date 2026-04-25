import { Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  stockRemaining: number;
  image: string;
}

interface RewardCardProps {
  item: RewardItem;
  userBalance: number;
  onClaimPress?: (reward: RewardItem) => void;
}

export default function RewardCard({
  item,
  userBalance,
  onClaimPress,
}: RewardCardProps) {
  //offline state
  const isOutOfStock = (item?.stockRemaining || 0) <= 0;
  const isInsufficientBalance = userBalance < (item?.pointsCost || 0);
  const isLowStock =
    (item?.stockRemaining || 0) > 0 && (item?.stockRemaining || 0) < 20;

  const IMAGE_THUMBNAIL = require("@/assets/images/reward_placholder.jpg");

  const getStockBadge = () => {
    if (isOutOfStock) {
      return {
        label: "SOLD OUT",
        style: styles.soldOutBadge,
        textColor: "#BA1A1A",
      };
    }
    if (isLowStock) {
      return {
        label: `${item?.stockRemaining || 0} LEFT`,
        style: styles.yellowBadge,
        textColor: "#705D00",
      };
    }
    return {
      label: "IN STOCK",
      style: styles.yellowBadge,
      textColor: "#705D00",
    };
  };

  const handleClaimPress = async () => {
    if (!isOutOfStock && !isInsufficientBalance && onClaimPress) {
      onClaimPress(item);
    }
  };

  const badge = getStockBadge();

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={item?.image ? { uri: item.image } : IMAGE_THUMBNAIL}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.details}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item?.title || ""}
            </Text>
            <View style={[styles.inlineBadge, badge.style]}>
              <Text style={[styles.badgeText, { color: badge.textColor }]}>
                {badge.label}
              </Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {item?.description || ""}
          </Text>

          <View style={styles.footer}>
            <View>
              <Text style={styles.costLabel}>COST</Text>
              <Text style={styles.costValue}>
                {(item?.pointsCost || 0).toLocaleString()} pts
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                isInsufficientBalance && styles.lockedBtn,
                isOutOfStock && styles.soldOutBtn,
              ]}
              onPress={handleClaimPress}
              disabled={isInsufficientBalance || isOutOfStock}
              activeOpacity={isInsufficientBalance || isOutOfStock ? 1 : 0.7}
            >
              <Text
                style={[
                  styles.actionText,
                  isInsufficientBalance && styles.lockedActionText,
                ]}
              >
                {isOutOfStock
                  ? "Notify Me"
                  : isInsufficientBalance
                    ? "Locked"
                    : "Claim Now"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {(isInsufficientBalance || isOutOfStock) && (
        <View style={styles.fullCardOverlay}>
          <View style={styles.fullCardLockedBadge}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              {!isOutOfStock && (
                <Ionicons
                  name={"lock-closed"}
                  size={responsiveFontSize(2.4)}
                  color="#00003C"
                />
              )}

              <Text style={styles.fullCardLockedText}>
                {isOutOfStock ? "OUT OF STOCK" : "INSUFFICIENT POINTS"}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: responsiveScreenHeight(4),
    position: "relative",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: responsiveScreenWidth(4),
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  imageContainer: {
    height: responsiveScreenHeight(33),
    width: "100%",
  },
  image: { width: "100%", height: "100%" },
  details: { padding: responsiveScreenHeight(3) },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveScreenHeight(2.3),
  },
  title: {
    flex: 1,
    fontSize: responsiveFontSize(2.2),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    color: "#00003C",
    marginRight: responsiveScreenWidth(2),
  },
  inlineBadge: {
    paddingHorizontal: responsiveScreenWidth(2.6),
    paddingVertical: responsiveScreenHeight(0.8),
    borderRadius: 6,
  },
  yellowBadge: { backgroundColor: "#FCD40033" },
  soldOutBadge: { backgroundColor: "#FEE2E2" },
  badgeText: {
    fontSize: responsiveFontSize(1.25),
    fontFamily: Fonts.inter.bold,
    color: "#00003C",
    fontWeight: "800",
  },
  description: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: Fonts.inter.medium,
    color: "#464653",
    lineHeight: responsiveFontSize(2.2),
    fontWeight: "400",
    marginBottom: responsiveScreenHeight(4),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  costLabel: {
    fontSize: responsiveFontSize(1.3),
    fontFamily: Fonts.inter.medium,
    color: "#767684",
    fontWeight: "400",
  },
  costValue: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.manrope.extraBold,
    fontWeight: "700",
    color: "#00003C",
  },
  actionBtn: {
    backgroundColor: "#00003C",
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: 30,
  },
  lockedBtn: { backgroundColor: "#E8E8F0" },
  soldOutBtn: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#E8E8F0",
  },
  actionText: {
    color: "#FFF",
    fontFamily: Fonts.manrope.bold,
    fontSize: responsiveFontSize(1.7),
    fontWeight: "700",
  },
  lockedActionText: { color: "#00003C" },
  fullCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 60, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderRadius: 24,
  },
  fullCardLockedBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: responsiveScreenWidth(5),
    paddingVertical: responsiveScreenHeight(1.3),
    borderRadius: responsiveScreenWidth(7),
  },
  fullCardLockedText: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: Fonts.inter.bold,
    color: "#00003C",
    fontWeight: "700",
  },
});
