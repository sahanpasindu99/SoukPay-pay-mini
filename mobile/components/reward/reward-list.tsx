import { useUser } from "@/hooks/useUser";
import api from "@/src/services/api";
import { useFocusEffect } from "@react-navigation/native";
import * as Network from "expo-network";
import React, { useCallback, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { responsiveScreenHeight } from "react-native-responsive-dimensions";
import { RewardClaimModal } from "../modal/redeem-item";
import RewardSkeleton from "../skeleton/skeleton-rewards";
import CategoryFilter from "./category-filter";
import HistoryBalance from "./history-balance";
import RewardCard from "./reward-card";

const showContent = () => (
  <View>
    <HistoryBalance />
    <View style={{ height: responsiveScreenHeight(5) }} />
    <CategoryFilter />
    <View style={{ height: responsiveScreenHeight(5) }} />
  </View>
);

export default function RewardsList() {
  const { user } = useUser();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any | null>(null);

  const fetchRewards = useCallback(async () => {
    try {
      const response = await api.get("/rewards");

      if (response.data?.success) {
        const mappedData = response.data?.data.map((item: any) => ({
          id: item?.id,
          title: item?.name || "",
          description: item?.description || "",
          pointsCost: item?.pointsCost || 0,
          stockRemaining: item?.stockRemaining || 0,
          image: item?.imageUrl,
        }));

        setRewards(mappedData);
      }
    } catch (error) {
      console.log("Rewards fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRewards();
    }, [fetchRewards]),
  );

  const handleClaimReward = useCallback((reward: any) => {
    setSelectedReward(reward);
    setModalVisible(true);
  }, []);

  const handleConfirmRedeem = useCallback(
    async (rewardId: string) => {
      const currentNetwork = await Network.getNetworkStateAsync();

      if (!currentNetwork.isConnected || !currentNetwork.isInternetReachable) {
        throw new Error(
          "No internet connection. Please connect to the internet to redeem rewards.",
        );
      }
      try {
        const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const response = await api.post(
          `/rewards/${rewardId}/redeem`,
          {},
          {
            headers: {
              "X-Idempotency-Key": idempotencyKey,
            },
          },
        );

        if (response.data?.success) {
          setRewards((prevRewards) =>
            prevRewards.map((r) =>
              r.id === rewardId
                ? { ...r, stockRemaining: Math.max(0, r.stockRemaining - 1) }
                : r,
            ),
          );
          fetchRewards();
          return response?.data || {};
        } else {
          throw new Error(response.data?.message || "Failed to redeem reward");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to redeem reward";
        throw new Error(errorMessage);
      }
    },
    [fetchRewards],
  );

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedReward(null);
  }, []);

  if (loading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: responsiveScreenHeight(5) }}
      >
        {showContent()}
        <RewardSkeleton count={3} />
      </ScrollView>
    );
  }

  return (
    <>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RewardCard
            item={item}
            userBalance={user?.availablePoints || 0}
            onClaimPress={() => handleClaimReward(item)}
          />
        )}
        ListHeaderComponent={() => (
          <View>
            <HistoryBalance />
            <View style={{ height: responsiveScreenHeight(5) }} />
            <CategoryFilter />
            <View style={{ height: responsiveScreenHeight(5) }} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: responsiveScreenHeight(6) }}
        showsVerticalScrollIndicator={false}
      />

      <RewardClaimModal
        visible={modalVisible}
        reward={selectedReward}
        userBalance={user?.availablePoints || 0}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRedeem}
      />
    </>
  );
}
