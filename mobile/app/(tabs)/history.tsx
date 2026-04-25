import MilestoneCard from "@/components/history/milestone-card";
import PortfolioCard from "@/components/history/portfolio-card";
import RecentActivity from "@/components/history/recent-activity";
import SearchBar from "@/components/history/search-bar";
import UpdatingLedgerIndicator from "@/components/loader/update-history";
import React, { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";

export default function History() {
  const scrollViewRef = useRef<ScrollView>(null);
  const recentActivityRef = useRef<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);

    if (distanceFromBottom < 60) {
      recentActivityRef.current?.loadMoreIfNeeded?.();
    }
  };

  // handle pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await recentActivityRef.current?.refreshData?.();
    } catch (error) {
      console.log("Refresh failed", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      onScroll={handleScroll}
      scrollEventThrottle={400}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#767684"
          colors={["#534AB7", "#185FA5"]}
          progressBackgroundColor="#fff"
        />
      }
    >
      {refreshing && <UpdatingLedgerIndicator />}
      <PortfolioCard />
      <View style={{ height: responsiveScreenHeight(5) }} />
      <SearchBar />
      <View style={{ height: responsiveScreenHeight(5) }} />
      <RecentActivity ref={recentActivityRef} />
      <MilestoneCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf8ff",
  },
  contentContainer: {
    paddingHorizontal: responsiveScreenWidth(5.3),
    paddingBottom: responsiveScreenHeight(15),
  },
});
