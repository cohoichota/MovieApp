import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, SPACING} from '../theme/theme';
import {
  upcomingMovies,
  nowPlayingMovies,
  popularMovies,
  baseImagePath,
} from '../api/apicalls';
import InputHeader from '../components/InputHeader';
import {NavigationProp} from '@react-navigation/native';
import CategoryHeader from '../components/CategoryHeader';
import {MainNavigatorParamList} from '../navigators/types';
import MovieCard from '../components/MovieCard';
import SubMovieCard from '../components/SubMovieCard';

interface UpcomingMovie {
  id: number;
  original_title: string;
  poster_path: string;
}

interface PopularMovie {
  id: number;
  original_title: string;
  poster_path: string;
}

interface NowPlayingMovie {
  id: number;
  original_title: string;
  poster_path: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
}

const {width} = Dimensions.get('window');

const fetchMovieList = async (url: string) => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json.results;
  } catch (error) {
    console.error('Something went wrong:', error);
    return [];
  }
};

type HomeScreenNavigationProps = NavigationProp<MainNavigatorParamList, 'Home'>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProps;
};

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState<
    NowPlayingMovie[]
  >([]);
  const [popularMoviesList, setPopularMoviesList] = useState<PopularMovie[]>(
    [],
  );
  const [upcomingMoviesList, setUpcomingMoviesList] = useState<UpcomingMovie[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      const nowPlayingResults: NowPlayingMovie[] = await fetchMovieList(
        nowPlayingMovies,
      );
      const popularResults: PopularMovie[] = await fetchMovieList(
        popularMovies,
      );
      const upcomingResults: UpcomingMovie[] = await fetchMovieList(
        upcomingMovies,
      );

      setNowPlayingMoviesList(nowPlayingResults);
      setPopularMoviesList(popularResults);
      setUpcomingMoviesList(upcomingResults);
    };

    fetchData();
  }, []);

  const handSearchMovie = () => {
    navigation.navigate('Search');
  };

  if (!nowPlayingMoviesList && !popularMoviesList) {
    return (
      <SafeAreaView style={styles.areaView}>
        <ScrollView
          style={styles.container}
          bounces={false}
          contentContainerStyle={styles.scrollViewContainer}>
          <StatusBar />
          <View style={styles.inputHeaderContainer}>
            <InputHeader onSearch={handSearchMovie} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={COLORS.Orange} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.areaView}>
      <ScrollView
        style={styles.container}
        bounces={false}
        contentContainerStyle={styles.scrollViewContainer}>
        <StatusBar />
        <View style={styles.inputHeaderContainer}>
          <InputHeader onSearch={handSearchMovie} />
        </View>
        <CategoryHeader title={'Now Playing'} />
        <FlatList
          data={nowPlayingMoviesList}
          keyExtractor={item => item.id.toString()}
          bounces={false}
          snapToInterval={width * 0.7 + SPACING.space_36}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          contentContainerStyle={styles.containerGap36}
          renderItem={({item, index}) => {
            if (!item.original_title) {
              return (
                <View
                  style={{
                    width: (width - (width * 0.7 + SPACING.space_36 * 2)) / 2,
                  }}
                />
              );
            }
            return (
              <MovieCard
                shouldMarginAtEnd={true}
                cardFunction={() => {
                  navigation.navigate('MovieDetails', {movieId: item.id});
                }}
                cardWidth={width * 0.7}
                isFirst={index === 0 ? true : false}
                isLast={index === upcomingMoviesList?.length - 1 ? true : false}
                title={item.original_title}
                imagePath={baseImagePath('w780', item.poster_path)}
                genre={item.genre_ids.slice(1, 4)}
                vote_average={item.vote_average}
                vote_count={item.vote_count}
              />
            );
          }}
        />

        <CategoryHeader title={'Popular'} />
        <FlatList
          data={popularMoviesList}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.containerGap36}
          renderItem={({item, index}) => (
            <SubMovieCard
              shouldMarginAtEnd={true}
              handlePressIcon={() => {
                navigation.navigate('MovieDetails', {movieId: item.id});
              }}
              cardWidth={width / 3}
              isFirst={index === 0 ? true : false}
              isLast={index === upcomingMoviesList?.length - 1 ? true : false}
              title={item.original_title}
              imagePath={baseImagePath('w342', item.poster_path)}
            />
          )}
        />
        <CategoryHeader title={'Upcoming'} />
        <FlatList
          data={upcomingMoviesList}
          keyExtractor={item => item.id.toString()}
          horizontal
          contentContainerStyle={styles.containerGap36}
          renderItem={({item, index}) => (
            <SubMovieCard
              shouldMarginAtEnd={true}
              handlePressIcon={() => {
                navigation.navigate('MovieDetails', {movieId: item.id});
              }}
              cardWidth={width / 3}
              isFirst={index === 0 ? true : false}
              isLast={index === upcomingMoviesList?.length - 1 ? true : false}
              title={item.original_title}
              imagePath={baseImagePath('w342', item.poster_path)}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  areaView: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  container: {
    display: 'flex',
    backgroundColor: COLORS.Black,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  inputHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
  },
  containerGap36: {
    gap: SPACING.space_36,
  },
});
