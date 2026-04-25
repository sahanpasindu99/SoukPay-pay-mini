import { IndexHeader } from "@/components/header";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: { display: "none" },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "HOME",
          header: () => <IndexHeader isHome={true} />,
          tabBarIcon: ({ color, focused }: any) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: "HISTORY",
          header: () => <IndexHeader />,
          tabBarIcon: ({ color, focused }: any) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="rewards"
        options={{
          tabBarLabel: "REWARDS",
          header: () => <IndexHeader />,
          tabBarIcon: ({ color, focused }: any) => (
            <Ionicons
              name={focused ? "gift" : "gift-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            preventDefault: false,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const iconColor = isFocused ? "#00003C" : "#64748B";

        return (
          <View key={route.key} style={styles.tabItemContainer}>
            <Pressable
              onPress={onPress}
              android_ripple={{
                color: "rgba(0, 0, 0, 0.05)",
                borderless: false,
              }}
              // The style prop can take a function to handle iOS active opacity
              style={({ pressed }) => [
                styles.fullPill,
                isFocused && styles.activePill,
                pressed && { opacity: 0.8 },
              ]}
            >
              {options.tabBarIcon({ color: iconColor, focused: isFocused })}

              <Text
                style={[
                  styles.label,
                  { color: iconColor, fontWeight: isFocused ? "700" : "500" },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    height: responsiveScreenHeight(12.5),
    paddingBottom: responsiveScreenHeight(3),
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  tabItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fullPill: {
    width: responsiveScreenWidth(23.8),
    height: responsiveScreenHeight(6.5),
    borderRadius: responsiveScreenWidth(7),
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    overflow: "hidden",
  },
  activePill: {
    backgroundColor: "#FCD400",
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
