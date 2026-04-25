// import { useUser } from "@/hooks/useUser";
// import React from "react";
// import { Pressable, StyleSheet, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Index() {
//   const { user, logout } = useUser();

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.welcomeText}>Welcome back,</Text>
//         <Text style={styles.userName}>{user?.name || "Member"}</Text>

//         <Pressable
//           onPress={logout}
//           style={({ pressed }) => [
//             styles.logoutButton,
//             pressed && { opacity: 0.8 },
//           ]}
//         >
//           <Text style={styles.logoutText}>Sign Out of Vault</Text>
//         </Pressable>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f9f9ff",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   content: {
//     padding: 30,
//     marginTop: 40,
//   },
//   welcomeText: {
//     fontSize: 16,
//     color: "#4b5563",
//     fontWeight: "500",
//   },
//   userName: {
//     fontSize: 32,
//     fontWeight: "800",
//     color: "#0a0a30",
//     marginBottom: 40,
//   },
//   logoutButton: {
//     backgroundColor: "#050520",
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   logoutText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 16,
//   },
// });
