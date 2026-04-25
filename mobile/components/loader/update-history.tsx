import { Fonts } from "@/constants/theme";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import {
    responsiveFontSize,
    responsiveScreenHeight,
    responsiveScreenWidth,
} from "react-native-responsive-dimensions";

const UpdatingLedgerIndicator = () => (
  <View style={styles.updatingContainer}>
    <ActivityIndicator size="small" color="#94A3B8" />
    <Text style={styles.updatingText}>UPDATING LEDGER</Text>
  </View>
);

export default UpdatingLedgerIndicator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  contentContainer: {
    paddingHorizontal: responsiveScreenWidth(5.3),
    paddingBottom: responsiveScreenHeight(15),
  },
  updatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginBottom: 12,
  },
  updatingText: {
    fontSize: responsiveFontSize(1.3),
    fontFamily: Fonts.inter.medium,
    color: "#94A3B8",
    letterSpacing: 0.8,
    fontWeight: "500",
  },
});
