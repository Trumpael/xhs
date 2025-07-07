import { useGlobalContext } from "@/context/GlobalContext";
import { register } from "@/lib/appwrite"; // Adjust the import path as necessary
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {refreshUser} = useGlobalContext(); // 获取刷新用户信息的函数

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      // 调用appwrite注册函数
      await register(email, password, username);
      setIsLoading(false);
      // 注册成功后跳转到主页
      router.push("/");
      // 刷新用户信息
      refreshUser();
    } catch (error) {
      console.log("注册失败:", error);
      alert("注册失败，请检查您的信息是否正确。");
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-myBackGround">
      <View className="flex-1 flex-col mx-6">
        <Text className="text-2xl font-bold text-myGreen text-center mt-20">
          注册
        </Text>
        {/* 邮箱输入 */}
        <TextInput
          placeholder="邮箱"
          className="rounded-md border border-myGreen mt-6 p-2 h-12"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {/* 用户名输入 */}
        <TextInput
          placeholder="用户名"
          className="rounded-md border border-myGreen mt-6 p-2 h-12"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        {/* 密码输入 */}
        <TextInput
          placeholder="密码"
          className="rounded-md border border-myGreen mt-6 p-2 h-12"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
        />

        {/* 注册按钮 */}
        <Pressable 
          className="bg-myGreen rounded-md mt-6 p-2 h-12 flex items-center justify-center"
          onPress={handleSignUp}
        >
          <Text className="text-myWhite text-lg font-semibold text-center">
            {isLoading ? "加载中..." : "注册"}
          </Text>
        </Pressable>

        <View className="flex-row items-center justify-center mt-4">
          <Text>已有账号？</Text>
          <Link href="/sign_in" className="text-myGreen ml-2">
            登录
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
