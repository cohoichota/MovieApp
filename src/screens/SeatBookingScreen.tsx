import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import AppHeader from '../components/AppHeader';
import CustomIcon from '../components/CustomIcon';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-simple-toast';

interface TempDate {
  date: number;
  day: string;
}

interface SeatArray {
  number: number;
  taken: boolean;
  selected: boolean;
}

const timeArray: string[] = [
  '10:30',
  '12:30',
  '14:30',
  '15:00',
  '19:30',
  '21:00',
];

const TICKET_PRICE = 5;

const generateDate = (): TempDate[] => {
  const date = new Date();
  let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let weekdays = [];
  for (let i = 0; i < 7; i++) {
    let tempDate: TempDate = {
      date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
      day: weekday[new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
    };
    weekdays.push(tempDate);
  }
  return weekdays;
};

const generateSeat = (): SeatArray[][] => {
  let numRow = 8;
  let numColumn = 3;
  let rowArray = [];
  let start = 1;
  let reachNine = false;

  for (let i = 0; i < numRow; i++) {
    let columnArray: SeatArray[] = [];
    for (let j = 0; j < numColumn; j++) {
      let seatObject = {
        number: start,
        taken: Boolean(Math.round(Math.random())),
        selected: false,
      };
      columnArray.push(seatObject);
      start++;
    }
    if (i === 3) {
      numColumn += 2;
    }
    if (numColumn < 9 && !reachNine) {
      numColumn += 2;
    } else {
      reachNine = true;
      numColumn -= 2;
    }
    rowArray.push(columnArray);
  }
  return rowArray;
};

const SeatBookingScreen = ({navigation, route}: any) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>();
  const [price, setPrice] = useState<number>(0);
  const [twoDSeatArray, setTwoDSeatArray] = useState<SeatArray[][]>(
    generateSeat(),
  );
  const [selectedSeatArray, setSelectedSeatArray] = useState<number[]>([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>();

  const dateArray = generateDate();

  const handSelectSeat = (index: number, subIndex: number, num: number) => {
    if (!twoDSeatArray[index][subIndex].taken) {
      let array = [...selectedSeatArray];
      let temp = [...twoDSeatArray];
      temp[index][subIndex].selected = !temp[index][subIndex].selected;
      if (!array.includes(num)) {
        array.push(num);
        setSelectedSeatArray(array);
      } else {
        const tempIndex = array.indexOf(num);
        if (tempIndex > -1) {
          array.splice(tempIndex, 1);
          setSelectedSeatArray(array);
        }
      }
      setPrice(array.length * TICKET_PRICE);
      setTwoDSeatArray(temp);
    }
  };

  const handleSelectDate = (index: number) => {
    setSelectedDateIndex(index);
  };

  const handleSelectTime = (index: number) => {
    setSelectedTimeIndex(index);
  };

  const handleBookSeat = async () => {
    if (
      selectedSeatArray.length !== 0 &&
      selectedTimeIndex !== undefined &&
      timeArray[selectedTimeIndex] !== undefined &&
      selectedDateIndex !== undefined &&
      dateArray[selectedDateIndex] !== undefined
    ) {
      try {
        await EncryptedStorage.setItem(
          'ticket',
          JSON.stringify({
            seatArray: selectedSeatArray,
            time: timeArray[selectedTimeIndex],
            date: dateArray[selectedDateIndex],
            ticketImage: route.params.PosterImage,
          }),
        );
      } catch (error) {
        console.error(
          'Something went Wrong while storing in BookSeats Functions',
          error,
        );
      }
      navigation.navigate('Ticket', {
        seatArray: selectedSeatArray,
        time: timeArray[selectedTimeIndex],
        date: dateArray[selectedDateIndex],
        ticketImage: route.params.PosterImage,
      });
    } else {
      Toast.showWithGravity(
        'Please Select Seats, Date and Time of the Show',
        Toast.LONG,
        Toast.TOP,
      );
      // AlertIOS.(
      //   'Please Select Seats, Date and Time of the Show',
      //   ToastAndroid.SHORT,
      //   ToastAndroid.BOTTOM,
      // );
    }
  };

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      <View>
        <ImageBackground
          source={{uri: route.params?.BgImage}}
          style={styles.ImageBG}>
          <LinearGradient
            colors={[COLORS.BlackRGB10, COLORS.Black]}
            style={styles.linearGradient}>
            <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header={''}
                action={() => navigation.goBack()}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
        <Text style={styles.screenText}>Screen this side</Text>
      </View>

      <View style={styles.seatContainer}>
        <View style={styles.containerGap20}>
          {twoDSeatArray?.map((item, index) => {
            return (
              <View key={index} style={styles.seatRow}>
                {item?.map((subItem, subIndex) => {
                  return (
                    <TouchableOpacity
                      key={subItem.number}
                      onPress={() => {
                        handSelectSeat(index, subIndex, subItem.number);
                      }}>
                      <CustomIcon
                        name="seat"
                        style={[
                          styles.seatIcon,
                          subItem.taken ? {color: COLORS.Grey} : {},
                          subItem.selected ? {color: COLORS.Orange} : {},
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>

        <View style={styles.seatRadioContainer}>
          <View style={styles.radioContainer}>
            <CustomIcon name="radio" style={styles.radioIcon} />
            <Text style={styles.radioText}>Available</Text>
          </View>
          <View style={styles.radioContainer}>
            <CustomIcon
              name="radio"
              style={[styles.radioIcon, {color: COLORS.Grey}]}
            />
            <Text style={styles.radioText}>Taken</Text>
          </View>
          <View style={styles.radioContainer}>
            <CustomIcon
              name="radio"
              style={[styles.radioIcon, {color: COLORS.Orange}]}
            />
            <Text style={styles.radioText}>Selected</Text>
          </View>
        </View>
      </View>

      <View>
        <FlatList
          data={dateArray}
          keyExtractor={item => item.date.toString()}
          bounces={false}
          horizontal
          contentContainerStyle={styles.containerGap24}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity onPress={() => handleSelectDate(index)}>
                <View
                  style={[
                    styles.dateContainer,
                    index === 0
                      ? {marginLeft: SPACING.space_24}
                      : index === dateArray.length - 1
                      ? {marginRight: SPACING.space_24}
                      : {},
                    index === selectedDateIndex
                      ? {backgroundColor: COLORS.Orange}
                      : {},
                  ]}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.outerContainer}>
        <FlatList
          data={timeArray}
          keyExtractor={item => item}
          bounces={false}
          horizontal
          contentContainerStyle={styles.containerGap24}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity onPress={() => handleSelectTime(index)}>
                <View
                  style={[
                    styles.timeContainer,
                    index === 0
                      ? {marginLeft: SPACING.space_24}
                      : index === dateArray.length - 1
                      ? {marginRight: SPACING.space_24}
                      : {},
                    index === selectedTimeIndex
                      ? {backgroundColor: COLORS.Orange}
                      : {},
                  ]}>
                  <Text style={styles.timeText}>{item}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.buttonPriceContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalPriceText}>Total Price</Text>
          <Text style={styles.price}>$ {price}.00</Text>
        </View>
        <TouchableOpacity onPress={handleBookSeat}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Buy Tickets</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SeatBookingScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  ImageBG: {
    width: '100%',
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    height: '100%',
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  screenText: {
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.WhiteRGBA15,
  },
  seatContainer: {
    marginVertical: SPACING.space_20,
  },
  containerGap20: {
    gap: SPACING.space_20,
  },
  seatRow: {
    flexDirection: 'row',
    gap: SPACING.space_20,
    justifyContent: 'center',
  },
  seatIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  seatRadioContainer: {
    marginTop: SPACING.space_36,
    marginBottom: SPACING.space_20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  radioContainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
  radioIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
  radioText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  containerGap24: {
    gap: SPACING.space_24,
  },
  dateContainer: {
    width: SPACING.space_10 * 7,
    height: SPACING.space_10 * 10,
    borderRadius: SPACING.space_10 * 10,
    backgroundColor: COLORS.DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  dayText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  outerContainer: {
    marginVertical: SPACING.space_24,
  },
  timeContainer: {
    paddingVertical: SPACING.space_10,
    borderWidth: 1,
    borderColor: COLORS.WhiteRGBA50,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_25,
    backgroundColor: COLORS.DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  buttonPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: SPACING.space_24,
    paddingBottom: SPACING.space_24,
  },
  priceContainer: {
    alignItems: 'center',
  },
  totalPriceText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Grey,
  },
  price: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  buttonContainer: {
    borderRadius: BORDERRADIUS.radius_25,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    backgroundColor: COLORS.Orange,
  },
  buttonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
  },
});
