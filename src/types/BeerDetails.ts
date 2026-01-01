import { Beer, Review } from "@/types/generated";

export default interface BeerDetails {
    calendarId: string;
    day: number;
    beer: Beer;
    review?: Review;
}
