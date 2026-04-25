import { Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Network from "expo-network";
import { useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const OfflineBanner = () => {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    //check initial net
    const updateState = (state: Network.NetworkState) => {
      const offline =
        state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
    };

    Network.getNetworkStateAsync().then(updateState);

    const subscription = Network.addNetworkStateListener((state) => {
      updateState(state);
    });

    return () => subscription.remove();
  }, [segments]);

  if (!isOffline) return null;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "ios"
              ? insets.top
              : (StatusBar.currentHeight || 0) + 10,
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name="cloud-offline"
          size={responsiveFontSize(2)}
          color="#FFFFFF"
        />
        <Text style={styles.text}>Internet connection lost</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#BA1A1A",
    width: "100%",
    paddingBottom: 8,
    zIndex: 10000,
    position: "absolute",
    top: 0,
  },
  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(1.6),
    fontFamily: Fonts.inter.medium,
    fontWeight: "600",
  },
});
