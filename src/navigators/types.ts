export type MainNavigatorParamList = {
  Home: undefined;
  MovieDetails: {
    movieId: number;
  };
  Search: undefined;
  Ticket: {
    seatArray: number[];
    time: string;
    date: TempDate;
    ticketImage: string;
  };
  User: undefined;
  SeatBooking: {
    PosterImage: string;
    BgImage?: string;
  };
};

interface TempDate {
  date: number;
  day: string;
}
