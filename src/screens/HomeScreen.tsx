import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS} from '../theme/theme';

const HomeScreen = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.push('MovieDetails');
        }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.Black,
  },
});
