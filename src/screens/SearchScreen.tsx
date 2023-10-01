import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, SPACING} from '../theme/theme';
import InputHeader from '../components/InputHeader';
import SubMovieCard from '../components/SubMovieCard';
import {baseImagePath, searchMovies} from '../api/apicalls';
import {NavigationProp} from '@react-navigation/native';
import {MainNavigatorParamList} from '../navigators/types';

const {width} = Dimensions.get('screen');

interface SearchMovie {
  id: number;
  original_title: string;
  poster_path: string;
}

type SearchScreenNavigationProps = NavigationProp<
  MainNavigatorParamList,
  'Search'
>;

type SearchScreenProps = {
  navigation: SearchScreenNavigationProps;
};

const SearchScreen = ({navigation}: SearchScreenProps) => {
  const [searchList, setSearchList] = useState<SearchMovie[]>([]);

  const handleSearchMovie = async (name: string) => {
    try {
      const response = await fetch(searchMovies(name));
      const json = await response.json();
      setSearchList(json.results as SearchMovie[]);
    } catch (error) {
      console.error('Something went wrong in searchMoviesFunction ', error);
    }
  };

  return (
    <SafeAreaView style={styles.areaView}>
      <View style={styles.container}>
        <View>
          <FlatList
            data={searchList}
            keyExtractor={item => item.id.toString()}
            bounces={false}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.inputHeaderContainer}>
                <InputHeader onSearch={handleSearchMovie} />
              </View>
            }
            contentContainerStyle={styles.centerContainer}
            renderItem={({item}) => (
              <SubMovieCard
                shouldMarginAtEnd={false}
                shouldMarginAround={true}
                handlePressIcon={() => {
                  navigation.navigate('MovieDetails', {movieId: item.id});
                }}
                cardWidth={width / 2 - SPACING.space_12 * 2}
                title={item.original_title}
                imagePath={baseImagePath('w342', item.poster_path)}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  areaView: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  container: {
    display: 'flex',
    flex: 1,
    width,
    alignItems: 'center',
    backgroundColor: COLORS.Black,
  },
  inputHeaderContainer: {
    display: 'flex',
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
    marginBottom: SPACING.space_28 - SPACING.space_12,
  },
  centerContainer: {
    alignItems: 'center',
  },
});
