import { OfflineBanner } from "@/components/banners/network-banner";
import { restoreToken } from "@/src/features/auth/authSlice";
import { store, type AppDispatch, type RootState } from "@/src/store/store";
import {
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import Toast from "react-native-toast-message";
import { Provider, useDispatch, useSelector } from "react-redux";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const segments = useSegments();

  const { isLoading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  // restore token on  launch
  useEffect(() => {
    dispatch(restoreToken()).finally(() => {
      SplashScreen.hideAsync();
    });
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated) {
      // validate login
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    } else {
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_600SemiBold,
    Inter_500Medium,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <Provider store={store}>
      <RootLayoutNav />
      <Toast position="top" topOffset={Platform.OS === "ios" ? 60 : 50} />
    </Provider>
  );
}
