import { useGlobalContext } from "@/context/GlobalContext";
import { getPosts } from "@/lib/appwrite";
import { MasonryFlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

const Index_all = () => {
  const { freshPostCnt } = useGlobalContext(); // 获取刷新帖子列表的函数

  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 10;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async (isRefresh = false) => {
    if (loading) return;
    setLoading(true);

    let page = pageNumber;

    if (isRefresh) {
      setRefreshing(true);
      setPageNumber(0);
      setHasMore(true);
      page = 0;
    }

    try {
      const newPosts = await getPosts(page, pageSize);
      // 判断是否是上拉刷新
      if (isRefresh) {
        setPosts(newPosts);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
      setPageNumber(page + 1);
      setHasMore(newPosts.length === pageSize);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, [freshPostCnt]);

  return (
    <MasonryFlashList
      data={posts}
      numColumns={2}
      // 底部加载
      onEndReached={() => {
        if (hasMore && pageNumber > 0) {
          fetchPosts();
        }
      }}
      // 上拉刷新
      refreshing={refreshing}
      onRefresh={() => {
        fetchPosts(true);
      }}
      // 距离底部多少触发加载
      onEndReachedThreshold={0.7}
      renderItem={({ item }) => (
        <Pressable
          className="flex-1 flex-col bg-myWhite rounded-sm m-1"
          onPress={() => {
            router.push(`/detail/${item?.$id}`);
          }}
        >
          <Image
            source={{ uri: item?.image_url }}
            style={{
              width: "100%",
              height: 200,
              maxHeight: 270,
              aspectRatio: 1,
            }}
            resizeMode="cover"
          />
          <View className="flex-col">
            <Text className="font-bold mt-1 text-md">{item?.title}</Text>
            <Text className="text-sm  mt-1">{item?.content}</Text>
          </View>
        </Pressable>
      )}
      estimatedItemSize={200}
    />
  );
};

export default Index_all;
