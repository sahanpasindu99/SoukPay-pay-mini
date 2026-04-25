import { Colors, Fonts } from "@/constants/theme";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/constants/Toast-message";
import { setCredentials } from "@/src/features/auth/authSlice";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export default function LoginScreen() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      showInfoToast("Email Required");
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      showInfoToast("Please enter a valid email address.");
      return;
    }
    if (!password) {
      showInfoToast("Password Required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        { email: email.toLowerCase().trim(), password },
      );
      const { token, user } = response.data;
      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userData", JSON.stringify(user));

      dispatch(setCredentials({ token, user }));
      showSuccessToast("Login successful! Welcome back.");
    } catch (error: any) {
      console.log(error);
      showErrorToast(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodySection}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Access your editorial vault</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="name@institution.com"
                placeholderTextColor="#767684"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>SECURITY KEY</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••••"
                  placeholderTextColor="#767684"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={responsiveScreenFontSize(2.5)}
                    color="#202022"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonInner}>
                  <Text style={styles.buttonText}>Enter The Vault</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={responsiveScreenFontSize(2.3)}
                    color={Colors.secondary.main}
                    style={{ marginLeft: responsiveScreenWidth(2) }}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            New to the ecosystem?{" "}
            <Text style={styles.linkText}>Request Access</Text>
          </Text>

          <View style={styles.securityBadgeContainer}>
            <View style={styles.badgeItem}>
              <Ionicons
                name="lock-closed-outline"
                size={responsiveScreenFontSize(1.4)}
                color="#1B1B22"
              />
              <Text style={styles.badgeText}>AES-256</Text>
            </View>
            <View style={styles.badgeItem}>
              <Ionicons
                name="shield-checkmark-outline"
                size={responsiveScreenFontSize(1.4)}
                color="#1B1B22"
              />
              <Text style={styles.badgeText}>SIPC PROTECTED</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.institutionalFooter}>
        <Text style={styles.copyrightText}>
          © 2024 SOUKPAY INSTITUTIONAL. ALL RIGHTS RESERVED.
        </Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLinkText}>PRIVACY</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLinkText}>COMPLIANCE</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLinkText}>SUPPORT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9ff",
    justifyContent: "space-between",
  },
  bodySection: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: responsiveScreenWidth(6),
  },
  card: {
    marginTop: responsiveScreenHeight(2),
    backgroundColor: "#fff",
    paddingTop: responsiveScreenHeight(3.5),
    paddingBottom: responsiveScreenHeight(4),
    paddingHorizontal: responsiveScreenWidth(7),
    borderRadius: responsiveScreenWidth(6),
    alignItems: "center",
    shadowColor: "#1B1B220F",
    shadowOpacity: 0.05,
    elevation: 2,
    width: "100%",
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: responsiveScreenFontSize(4),
    fontWeight: "800",
    lineHeight: responsiveScreenFontSize(4.2),
    letterSpacing: -0.75,
    color: Colors.primary.dark,
    alignSelf: "flex-start",
  },
  subtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: responsiveScreenFontSize(1.8),
    color: Colors.neutral.greyMildText,
    alignSelf: "flex-start",
    paddingBottom: responsiveScreenHeight(5),
  },
  inputGroup: {
    marginBottom: responsiveScreenHeight(3.5),
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: responsiveScreenFontSize(1.4),
    fontFamily: "Inter_600SemiBold",
    color: "#4b5563",
    marginBottom: responsiveScreenHeight(1),
    letterSpacing: 0.5,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#E4E1EB",
    padding: responsiveScreenWidth(4),
    borderRadius: responsiveScreenWidth(3.5),
    fontSize: responsiveScreenFontSize(1.7),
    color: "#0a0a30",
  },
  eyeIcon: {
    position: "absolute",
    right: responsiveScreenWidth(4),
    padding: 4,
  },
  forgotText: {
    fontSize: responsiveScreenFontSize(1.4),
    fontFamily: "Inter_700Bold",
    color: "#000080",
    marginBottom: responsiveScreenHeight(1),
  },
  button: {
    backgroundColor: Colors.primary.dark,
    width: "100%",
    height: responsiveScreenHeight(7.5),
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: responsiveScreenHeight(2),
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: "700",
    fontFamily: Fonts.manrope.bold,
  },
  footerText: {
    textAlign: "center",
    color: "#4b5563",
    fontFamily: Fonts.inter.medium,
    fontWeight: "500",
    fontSize: responsiveScreenFontSize(1.6),
    marginBottom: responsiveScreenHeight(3),
    marginTop: responsiveScreenHeight(5.5),
  },
  linkText: {
    fontWeight: "800",
    color: "#00003C",
  },
  securityBadgeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: responsiveScreenWidth(6),
    opacity: 0.3,
    marginTop: responsiveScreenHeight(5),
  },
  badgeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveScreenWidth(1),
  },
  badgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: responsiveScreenFontSize(1.2),
    textTransform: "uppercase",
    color: "#1B1B22",
  },
  institutionalFooter: {
    width: "100%",
    height: responsiveScreenHeight(12),
    borderTopWidth: 1,
    borderTopColor: "#C6C5D51A",
    paddingTop: responsiveScreenHeight(3.5),
    paddingBottom: responsiveScreenHeight(3),
    paddingHorizontal: responsiveScreenWidth(7),
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  copyrightText: {
    fontFamily: "Inter_500Medium",
    fontSize: responsiveScreenFontSize(1.4),
    fontWeight: "500",
    color: "#46465399",
    textAlign: "left",
    lineHeight: responsiveScreenFontSize(1.8),
    letterSpacing: 1,
  },
  footerLinks: {
    flexDirection: "row",
    width: "100%",
    height: responsiveScreenHeight(2),
    gap: responsiveScreenWidth(8),
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  footerLinkText: {
    fontFamily: "Inter_700SemiBold",
    fontWeight: "700",
    fontSize: responsiveScreenFontSize(1.4),
    color: "#46465399",
    letterSpacing: 1,
    lineHeight: responsiveScreenFontSize(1.8),
    textTransform: "uppercase",
  },
});
