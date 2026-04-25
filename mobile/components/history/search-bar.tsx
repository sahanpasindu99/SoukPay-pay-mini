import { Fonts } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search-outline"
          size={22}
          color="#767684"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search History"
          placeholderTextColor="#767684"
        />
      </View>

      {/* Filter Button */}
      <Pressable style={styles.filterBtn}>
        <MaterialCommunityIcons
          name="filter-variant"
          size={24}
          color="#00003C"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E4E1EB",
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    fontFamily: Fonts.inter.medium,
    color: "#00003C",
  },
  filterBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F5F2FC",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
});
