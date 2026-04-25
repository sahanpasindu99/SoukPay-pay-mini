import { Fonts } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

interface ActionItemProps {
  title: string;
  subtitle: string;
  iconName: any;
  iconType: "ionicons" | "material";
  iconBg: string;
  bgColor: string;
  onPress?: () => void;
  type?: "primary" | "secondary";
}

const ActionItem = ({
  title,
  subtitle,
  iconName,
  iconType,
  iconBg,
  bgColor,
  type,
  onPress = () => {},
}: ActionItemProps) => (
  <Pressable
    style={[styles.card, { backgroundColor: bgColor }]}
    onPress={onPress}
  >
    <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
      {iconType === "ionicons" ? (
        <Ionicons
          name={iconName}
          size={responsiveFontSize(2.7)}
          color="#000080"
        />
      ) : (
        <MaterialCommunityIcons
          name={iconName}
          size={responsiveFontSize(2.7)}
          color={type === "primary" ? "#000080" : "#705D00"}
        />
      )}
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  </Pressable>
);

export default function ActionCards() {
  return (
    <View style={styles.container}>
      <ActionItem
        title={`Transfer \nPoints`}
        subtitle="Send to partners"
        iconName="send-outline"
        iconType="material"
        iconBg="#EBEBFF"
        bgColor="#FFFFFF"
        type="primary"
      />
      <ActionItem
        title={`Boost \nEarnings`}
        subtitle="Active multipliers"
        iconName="credit-card-plus-outline"
        iconType="material"
        iconBg="#FCD40033"
        bgColor="#F5F2FC"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: responsiveHeight(1.2),
    padding: responsiveWidth(4.5),
    height: responsiveHeight(18),
    justifyContent: "space-between",
    shadowColor: "#19191e1f",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 9,
    elevation: 2,
  },
  iconCircle: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginTop: responsiveHeight(1.5),
  },
  title: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: Fonts.manrope.extraBold,
    fontWeight: "800",
    color: "#1B1B22",
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: Fonts.inter.medium,
    color: "#464653",
    fontWeight: "500",
    letterSpacing: 0.3,
    marginTop: 2,
  },
});
