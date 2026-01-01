import { Beer, Calendar, UserWithoutChildren } from "@/types/generated";

export default interface BeerWithCalendar {
    beer: Beer;
    calendar: Calendar;
    day: number;
    brewer: UserWithoutChildren;
}
