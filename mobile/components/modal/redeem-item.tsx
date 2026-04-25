import { Fonts } from "@/constants/theme";
import { useUser } from "@/hooks/useUser";
import { updateUserPoints } from "@/src/features/auth/authSlice";
import { Ionicons } from "@expo/vector-icons";
import * as Network from "expo-network";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    responsiveFontSize,
    responsiveScreenHeight,
    responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import { useDispatch } from "react-redux";

interface RewardClaimModalProps {
  visible: boolean;
  reward: any | null;
  userBalance: number;
  onClose: () => void;
  onConfirm: (rewardId: string) => Promise<void>;
}

export const RewardClaimModal = ({
  visible,
  reward,
  userBalance,
  onClose,
  onConfirm,
}: RewardClaimModalProps) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setError(null);
      setSuccess(false);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, scaleAnim]);

  const handleConfirm = async () => {
    if (!reward) return;

    const currentNetwork = await Network.getNetworkStateAsync();

    if (!currentNetwork.isConnected || !currentNetwork.isInternetReachable) {
      alert(
        "No internet connection. Please connect to the internet to redeem rewards.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onConfirm(reward?.id);
      dispatch(updateUserPoints(reward.pointsCost));
      setSuccess(true);

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to redeem reward. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  const canClaim = reward && userBalance >= reward.pointsCost;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {!success ? (
            <>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Claim Reward</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  disabled={loading}
                  style={styles.closeButton}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={loading ? "#D3D1C7" : "#00003C"}
                  />
                </TouchableOpacity>
              </View>

              {/* Reward Image */}
              {reward?.image && (
                <View style={styles.imageContainer}>
                  <Text style={styles.placeholderImage}>🎁</Text>
                </View>
              )}

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.rewardTitle}>{reward?.title}</Text>
                <Text style={styles.rewardDescription}>
                  {reward?.description}
                </Text>

                {/* Points  */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Points Required:</Text>
                  <Text style={styles.pointsCost}>{reward?.pointsCost}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Stock Remaining:</Text>
                  <Text
                    style={[
                      styles.stock,
                      {
                        color:
                          reward?.stockRemaining <= 5 ? "#BA1A1A" : "#15803D",
                      },
                    ]}
                  >
                    {reward?.stockRemaining}
                  </Text>
                </View>

                {/* User Balance */}
                <View style={[styles.infoRow, styles.balanceRow]}>
                  <Text style={styles.infoLabel}>Your Points:</Text>
                  <Text style={styles.userBalance}>{userBalance}</Text>
                </View>

                {error && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={18} color="#BA1A1A" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                {/* Insufficient  */}
                {!canClaim && !error && (
                  <View style={styles.warningContainer}>
                    <Ionicons name="warning" size={18} color="#BA7517" />
                    <Text style={styles.warningText}>
                      Insufficient points to claim this reward
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    !canClaim && styles.confirmButtonDisabled,
                  ]}
                  onPress={handleConfirm}
                  disabled={loading || !canClaim}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Confirm Redeem</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* Success  */
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={60} color="#15803D" />
              </View>
              <Text style={styles.successTitle}>Reward Claimed!</Text>
              <Text style={styles.successMessage}>
                Your reward has been successfully redeemed
              </Text>
              <Text style={styles.successDetails}>
                {reward?.pointsCost} points deducted
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: responsiveScreenWidth(85),
    maxHeight: responsiveScreenHeight(75),
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E4E0",
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    color: "#00003C",
  },
  closeButton: {
    padding: 8,
  },
  imageContainer: {
    height: responsiveScreenHeight(12),
    backgroundColor: "#FFFBEB",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImage: {
    fontSize: 48,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  rewardTitle: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    color: "#00003C",
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: Fonts.inter.medium,
    color: "#767684",
    lineHeight: 20,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  balanceRow: {
    backgroundColor: "#F1EFE8",
    paddingHorizontal: 12,
    borderRadius: 8,
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: Fonts.inter.medium,
    color: "#767684",
  },
  pointsCost: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    color: "#FCD400",
  },
  stock: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
  },
  userBalance: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    color: "#185FA5",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FCEBEB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: Fonts.inter.medium,
    color: "#BA1A1A",
    flex: 1,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FAEEDA",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  warningText: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: Fonts.inter.medium,
    color: "#BA7517",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E4E0",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F1EFE8",
  },
  cancelButtonText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    color: "#00003C",
  },
  confirmButton: {
    backgroundColor: "#00003C",
  },
  confirmButtonDisabled: {
    backgroundColor: "#D3D1C7",
  },
  confirmButtonText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    color: "#fff",
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    color: "#15803D",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: Fonts.inter.medium,
    color: "#767684",
    textAlign: "center",
    marginBottom: 12,
  },
  successDetails: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: Fonts.inter.medium,
    color: "#FCD400",
  },
});
