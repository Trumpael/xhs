import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Detail = () => {
  const {post_id} = useLocalSearchParams()
  const [post, setPost] = useState<any>(null)
  return (
    <View>
      <Text>Hello, RNFES!</Text>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({})