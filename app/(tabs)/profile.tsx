import { useGlobalContext } from "@/context/GlobalContext";
import { logout } from "@/lib/appwrite";
import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, refreshUser } = useGlobalContext(); // 获取用户信息

  const handleLogout = async () => {
    await logout()
    refreshUser()
  };

  return (
    <SafeAreaView className="flex-1 bg-myBackGround">
      <View className="flex-1 flex-col items-center">
        <View className="flex-row gap-2 items-center justify-center">
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              className="w-12 h-12 rounded-full"
            ></Image>
          ) : (
            <></>
          )}
          <Text className="text-2xl font-bold">{user?.username}</Text>
        </View>

        <Link href="/sign_in" className="p-4 rouded-lg w-full">
          <Text className="text-center text-lg font-semibold">登录</Text>
        </Link>

        <Link href="/sign_up" className="p-4 rouded-lg w-full">
          <Text className="text-center text-lg font-semibold">注册</Text>
        </Link>

        <Pressable className="p-4 rounded-lg w-full" onPress={() => {
          handleLogout();
        }}>
          <Text className="text-center font-semibold text-lg">退出登录</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
