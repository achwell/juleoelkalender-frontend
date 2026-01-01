import { Beer, Calendar, Review, User } from "@/types/generated";

export default interface BeerWithCalendarAndDayAndReview {
    beer: Beer;
    calendar: Calendar;
    day: number;
    brewer: User;
    review: Review;
}
