import { Fonts } from "@/constants/theme";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  responsiveFontSize,
  responsiveScreenHeight,
} from "react-native-responsive-dimensions";

const CATEGORIES = ["All Rewards", "Lifestyle", "Travel", "Dining", "Shopping"];

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState("All Rewards");

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => setActiveCategory(category)}
              activeOpacity={0.8}
              style={[
                styles.chip,
                isActive ? styles.activeChip : styles.inactiveChip,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    paddingLeft: 4,
    gap: 12,
    paddingRight: 20,
    marginTop: responsiveScreenHeight(2),
  },
  chip: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  activeChip: {
    backgroundColor: "#00003C",
  },
  inactiveChip: {
    backgroundColor: "#F5F2FC",
  },
  chipText: {
    fontSize: responsiveFontSize(1.85),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
  },
  activeText: {
    color: "#FFFFFF",
  },
  inactiveText: {
    color: "#464653",
  },
});
