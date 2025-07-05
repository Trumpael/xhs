import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  return (
    <SafeAreaView className="flex-1 bg-myBackGround">
      <View className="flex-1 flex-col items-center">
        <View className="flex-row gap-2 items-center justify-center">
          <Text className="text-2xl font-bold">Profile</Text>
        </View>

        <Link href="/sign_in" className="p-4 rouded-lg w-full">
          <Text className="text-center text-lg font-semibold">登录</Text>
        </Link>

        <Link href="/sign_up" className="p-4 rouded-lg w-full">
          <Text className="text-center text-lg font-semibold">注册</Text>
        </Link>

        <Pressable className="p-4 rounded-lg w-full" onPress={() => {}}>
          <Text className="text-center font-semibold text-lg">
            退出登录
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
