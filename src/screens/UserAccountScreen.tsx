import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SettingComponent from '../components/SettingComponent';
import AppHeader from '../components/AppHeader';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import {NavigationProp} from '@react-navigation/native';
import {MainNavigatorParamList} from '../navigators/types';

type UserAccountScreenNavigationProps = NavigationProp<
  MainNavigatorParamList,
  'User'
>;

type UserAccountScreenProps = {
  navigation: UserAccountScreenNavigationProps;
};

const UserAccountScreen = ({navigation}: UserAccountScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="close"
          header={'My Profile'}
          action={() => navigation.goBack()}
        />
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/image/avatar.png')}
          style={styles.avatarImage}
        />
        <Text style={styles.avatarText}>John Doe</Text>
      </View>

      <View style={styles.profileContainer}>
        <SettingComponent
          icon="user"
          heading="Account"
          subheading="Edit Profile"
          subtitle="Change Password"
        />
        <SettingComponent
          icon="setting"
          heading="Settings"
          subheading="Theme"
          subtitle="Permissions"
        />
        <SettingComponent
          icon="dollar"
          heading="Offers & Refferrals"
          subheading="Offer"
          subtitle="Refferrals"
        />
        <SettingComponent
          icon="info"
          heading="About"
          subheading="About Movies"
          subtitle="more"
        />
      </View>
    </View>
  );
};

export default UserAccountScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  profileContainer: {
    alignItems: 'center',
    padding: SPACING.space_36,
  },
  avatarImage: {
    height: 80,
    width: 80,
    borderRadius: 80,
  },
  avatarText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    marginTop: SPACING.space_16,
    color: COLORS.White,
  },
});
