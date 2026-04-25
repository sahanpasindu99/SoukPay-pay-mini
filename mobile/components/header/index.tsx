import { Fonts } from "@/constants/theme";
import { showSuccessToast } from "@/constants/Toast-message";
import { useUser } from "@/hooks/useUser";
import { logoutUser } from "@/src/features/auth/authSlice";
import { AppDispatch } from "@/src/store/store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

interface IndexHeaderProps {
  isHome?: boolean;
}

export function IndexHeader({ isHome = false }: IndexHeaderProps) {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
    showSuccessToast("Logged out successfully.");
  };
  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require("@/assets/images/logo/user.png")}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.headerText}>
              {isHome && <Text style={styles.greetingText}>WELCOME BACK</Text>}
              <Text style={styles.headerTitle}>{user?.name}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.logoutBtnText}>LOGOUT</Text>
            </Pressable>

            <Pressable style={styles.notificationButton}>
              <Ionicons
                name="notifications-outline"
                size={26}
                color="#00003C"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: 100,
    shadowColor: "#1b1b2246",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  headerContainer: {
    paddingHorizontal: responsiveScreenWidth(5),
    paddingVertical: responsiveScreenHeight(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    width: responsiveScreenWidth(13),
    height: responsiveScreenWidth(13),
    borderRadius: responsiveScreenWidth(6.5),
    borderWidth: 2,
    borderColor: "#FCD400",
    padding: 1,
    marginRight: 14,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: responsiveScreenWidth(6.5),
    backgroundColor: "#E2E8F0",
  },
  headerText: {
    justifyContent: "center",
  },
  greetingText: {
    fontSize: responsiveFontSize(1.4),
    color: "#464653",
    fontFamily: "Inter_500SemiBold",
    fontWeight: "500",
    letterSpacing: 0.5,
    marginBottom: -2,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.4),
    fontFamily: "Manrope_800ExtraBold",
    fontWeight: "800",
    color: "#00003C",
    letterSpacing: 0.5,
    lineHeight: 26,
  },
  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveScreenWidth(2.7),
  },
  logoutBtn: {
    paddingVertical: responsiveScreenHeight(0.8),
    paddingHorizontal: responsiveScreenWidth(2),
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  logoutBtnText: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: Fonts.manrope.bold,
    color: "#00003C",
    letterSpacing: 0.5,
  },
});
