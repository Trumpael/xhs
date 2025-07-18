import { useGlobalContext } from "@/context/GlobalContext";
import { createPost, uploadFile } from "@/lib/appwrite"; // Adjust the import path as necessary
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ID } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

function Add() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // const user = useGlobalContext().user; // 获取当前用户信息
  const { user, refreshPosts } = useGlobalContext(); // 获取当前用户信息

  const compressImage = async (uri: string, quality = 0.2, maxWidth = 640) => {
    try {
      const mainpResult = await manipulateAsync(
        uri,
        [{ resize: { width: maxWidth } }],
        {
          compress: quality,
          format: SaveFormat.JPEG,
        }
      );
      return mainpResult;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const pickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // console.log(result);

      if (!result.canceled) {
        // 压缩图片
        const compressedImage = await compressImage(result.assets[0].uri);
        if (compressedImage) {
          // setImage(compressedImage.uri);
          const { fileId, fileUrl } = await uploadFile(
            ID.unique(),
            compressedImage
          );
          setImage(fileUrl.toString());
        }
      }
    } catch (error) {
      console.log("Error picking image:", error);
      alert("选择图片失败，请稍后再试");
    }
  };

  // 点击发布
  const handleAdd = async () => {
    if (!image || !title || !content) {
      alert("请填写所有必要信息");
      return;
    }

    setLoading(true);
    try {
      const res = await createPost(
        title,
        content,
        image,
        user.userId,
        user.username,
        user.avatarUrl
      );
      console.log("发布成功:", res);
      setTitle("");
      setContent("");
      setImage(null);
      alert("发布成功");
      router.replace("/"); // 发布成功后跳转到主页
      refreshPosts(); // 刷新帖子列表
    } catch (error) {
      console.log(error);
      alert("发布失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <View className='flex-1 items-center justify-center'>
    //   <Button title="Pick an image from camera roll" onPress={pickImage} />
    //   {image && <Image source={{ uri: image }} />}
    // </View>
    <SafeAreaView className="flex-1 flex-col items-center bg-myBackGround">
      <Pressable
        onPress={pickImage}
        className="border-2 mt-10 h-[260px] w-[300px] rounded-lg border-myGreen"
      >
        <View className="flex-1 items-center justify-center">
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-full rounded-lg"
            />
          ) : (
            <Text className="text-myGreen">点击选择图片</Text>
          )}
        </View>
      </Pressable>

      <TextInput
        placeholder="标题"
        value={title}
        onChangeText={setTitle}
        className="w-[300px] h-[40px] rounded-lg border-myGreen border-2 mt-10 p-2"
      />

      <TextInput
        placeholder="内容"
        value={content}
        onChangeText={setContent}
        className="w-[300px] h-[40px] rounded-lg border-myGreen border-2 mt-10 p-2"
      />

      <Pressable
        onPress={handleAdd}
        className="w-[300px] h-[40px] rounded-lg bg-myGreen mt-10 p-2 flex items-center justify-center"
      >
        <Text className="text-myWhite text-xl">
          {loading ? "发布中..." : "发布"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default Add;

const styles = StyleSheet.create({});
