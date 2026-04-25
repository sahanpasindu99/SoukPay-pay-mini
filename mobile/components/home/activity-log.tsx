import { Fonts } from "@/constants/theme";
import { showErrorToast } from "@/constants/Toast-message";
import api from "@/src/services/api";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import ActivitySkeleton from "../skeleton/skeleton-activity-loader";

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    })
    .toUpperCase();
};

const ActivityItem = ({ item }: { item: any }) => {
  const isPositive = item.amount >= 0;

  return (
    <View style={styles.itemCard}>
      <View style={styles.leftSection}>
        <View style={styles.iconBox}>
          {item.iconType === "material" ? (
            <MaterialCommunityIcons
              name={item.icon as any}
              size={22}
              color="#00003C"
            />
          ) : (
            <Ionicons name={item.icon as any} size={22} color="#00003C" />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemMeta}>
            {formatDate(item.createdAt)} • {item.type}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text
          style={[
            styles.amountText,
            { color: isPositive ? "#00003C" : "#BA1A1A" },
          ]}
        >
          <Text
            style={[
              styles.amountText,
              { color: isPositive ? "#00003C" : "#BA1A1A" },
            ]}
          >
            {isPositive ? "+" : "-"}
          </Text>
          {Math.round(Math.abs(item.amount) * 100) / 100}
        </Text>
        <Text style={styles.pointsLabel}>POINTS</Text>
      </View>
    </View>
  );
};

export default function ActivityLog() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const limit = 5;
  const page = 1;

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/users/me/transactions?page=${page}&limit=${limit}`,
      );

      if (response.data.success) {
        const mappedData = response.data.data.map((transaction: any) => ({
          //map data
          id: transaction?.id,
          title: transaction?.reason,
          createdAt: transaction?.createdAt,
          type: transaction?.delta >= 0 ? "CREDIT" : "DEBIT",
          amount: transaction?.delta,
          icon: transaction?.reason?.toLowerCase().includes("welcome")
            ? "gift-outline"
            : "star-outline",
          iconType: "ionicons",
        }));
        setActivities(mappedData);
      }
    } catch (error) {
      console.log("Error fetching transactions:", error);
      showErrorToast("Failed to load. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();

      return () => {};
    }, [fetchTransactions]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity Log</Text>
        <Pressable>
          <Text style={styles.viewAll}>VIEW ALL</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivitySkeleton count={3} />
      ) : (
        activities?.map((item) => <ActivityItem key={item.id} item={item} />)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginTop: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: Fonts.manrope.extraBold,
    fontWeight: "800",
    color: "#1B1B22",
  },
  viewAll: {
    fontSize: responsiveFontSize(1.35),
    fontFamily: Fonts.inter.semibold,
    fontWeight: "700",
    color: "#00003C",
    letterSpacing: 1,
    marginTop: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#FCD400",
    paddingBottom: 2,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: responsiveScreenWidth(3),
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: responsiveScreenHeight(1.7),
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: responsiveScreenHeight(5),
    height: responsiveScreenHeight(5),
    borderRadius: responsiveScreenHeight(0.9),
    backgroundColor: "#EFECF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    color: "#1B1B22",
  },
  itemMeta: {
    fontSize: responsiveFontSize(1.3),
    fontFamily: Fonts.inter.medium,
    color: "#464653",
    fontWeight: "400",
    marginTop: responsiveScreenHeight(0.5),
    textTransform: "uppercase",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  pointsLabel: {
    fontSize: responsiveFontSize(1.1),
    fontFamily: Fonts.inter.bold,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.4,
    marginTop: responsiveScreenHeight(0.5),
  },
});
