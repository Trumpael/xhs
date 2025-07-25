import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const Detail = () => {
  const {post_id} = useLocalSearchParams()
  
  return (
    <View>
      <Text>Hello, RNFES!</Text>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({})