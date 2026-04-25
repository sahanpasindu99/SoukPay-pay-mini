import { Fonts } from "@/constants/theme";
import api from "@/src/services/api";
import { formatTime } from "@/util/date-time-formatter";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import ItemLoader from "../loader/item-loader";
import ActivitySkeleton from "../skeleton/skeleton-activity-loader";

const mapData = (tx: any) => ({
  id: tx.id,
  title: tx.reason,
  createdAt: tx.createdAt,
  location: tx.delta >= 0 ? "Points Earned" : "Points Redeemed",
  amount: tx.delta,
  status: tx.delta >= 0 ? "EARNED" : "REDEEMED",
  icon: tx.delta >= 0 ? "gift-outline" : "shopping-outline",
  iconType: tx.delta >= 0 ? "ionicons" : "material",
  iconBg: tx.delta >= 0 ? "#FFFBEB" : "#FEF2F2",
  iconColor: tx.delta >= 0 ? "#FCD400" : "#BA1A1A",
});

const formatDateHeader = (isoString: string) => {
  const date = new Date(isoString);
  return date
    .toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
};

const ActivityItem = ({ item }: { item: any }) => {
  const isPositive = item.amount >= 0;
  const sign = isPositive ? "+" : "-";
  const absoluteValue = Math.round(Math.abs(item.amount) * 100) / 100;

  return (
    <View style={styles.itemCard}>
      <View style={styles.leftSection}>
        <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
          {item.iconType === "material" ? (
            <MaterialCommunityIcons
              name={item?.icon as any}
              size={22}
              color={item.iconColor}
            />
          ) : (
            <Ionicons
              name={item?.icon as any}
              size={22}
              color={item.iconColor}
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>{item?.title}</Text>
          <Text style={styles.itemMeta}>
            {item?.location} • {formatTime(item?.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text
          style={[
            styles.amountText,
            { color: isPositive ? "#15803D" : "#BA1A1A" },
          ]}
        >
          {sign} {absoluteValue}
        </Text>
        <Text style={styles.statusLabel}>{item.status}</Text>
      </View>
    </View>
  );
};

interface RecentActivityHandle {
  loadMoreIfNeeded: () => void;
  refreshData: () => Promise<void>;
}

const RecentActivity = forwardRef<RecentActivityHandle>((props, ref) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 5;

  const fetchRecentData = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await api.get(
          `/users/me/transactions?page=${pageNum}&limit=${LIMIT}`,
        );

        if (response.data?.success) {
          const mapped = response.data?.data.map(mapData) || [];

          if (append) {
            setActivities((prev) => [...prev, ...mapped]);
          } else {
            setActivities(mapped);
          }

          const totalItems = response.data?.data.length || 0;
          setHasMore(totalItems === LIMIT);
          setPage(pageNum);
        }
      } catch (error) {
        console.log("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  // Initial fetch
  useFocusEffect(
    useCallback(() => {
      fetchRecentData(1, false);
    }, [fetchRecentData]),
  );

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchRecentData(page + 1, true);
    }
  }, [page, loadingMore, hasMore, fetchRecentData]);

  // Refresh function - reload from page 1
  const handleRefresh = useCallback(async () => {
    await fetchRecentData(1, false);
  }, [fetchRecentData]);

  // Expose both loadMoreIfNeeded and refreshData through ref
  useImperativeHandle(ref, () => ({
    loadMoreIfNeeded: handleLoadMore,
    refreshData: handleRefresh,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Activity</Text>
        <Text style={styles.dateHeader}>
          {activities.length > 0
            ? formatDateHeader(activities[0].createdAt)
            : ""}
        </Text>
      </View>

      {loading && activities.length === 0 ? (
        <ActivitySkeleton count={3} />
      ) : (
        <>
          {activities.length > 0 ? (
            activities.map((item) => <ActivityItem key={item.id} item={item} />)
          ) : (
            <Text style={styles.emptyText}>No recent transactions found.</Text>
          )}

          {loadingMore && <ItemLoader />}
        </>
      )}
    </View>
  );
});

RecentActivity.displayName = "RecentActivity";

export default RecentActivity;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: Fonts.manrope.extraBold,
    fontWeight: "800",
    color: "#1B1B22",
  },
  dateHeader: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: Fonts.inter.bold,
    color: "#767684",
    letterSpacing: 1.2,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: responsiveScreenWidth(5),
    padding: 18,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: responsiveScreenHeight(1.5),
    elevation: 2,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    width: responsiveScreenHeight(5.5),
    height: responsiveScreenHeight(5.5),
    borderRadius: responsiveScreenHeight(2.75),
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    justifyContent: "center",
    flex: 1,
  },
  itemTitle: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: Fonts.manrope.bold,
    fontWeight: "700",
    color: "#1B1B22",
  },
  itemMeta: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: Fonts.inter.medium,
    color: "#767684",
    marginTop: 4,
  },
  rightSection: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  amountText: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: Fonts.manrope.extraBold,
    fontWeight: "800",
  },
  statusLabel: {
    fontSize: responsiveFontSize(1.2),
    fontFamily: Fonts.inter.bold,
    color: "#767684",
    letterSpacing: 0.8,
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#767684",
    fontFamily: Fonts.inter.medium,
    marginVertical: 20,
  },
  endMessage: {
    textAlign: "center",
    color: "#767684",
    fontFamily: Fonts.inter.medium,
    marginVertical: 15,
    fontSize: responsiveFontSize(1.4),
  },
});
