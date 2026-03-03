import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    name: string;
    description: string;
    category: string;
    price: number;
}
export type Time = bigint;
export interface Review {
    customerName: string;
    date: Time;
    comment: string;
    rating: number;
}
export interface backendInterface {
    addReview(customerName: string, rating: number, comment: string): Promise<void>;
    getAllMenuItems(): Promise<Array<MenuItem>>;
    getAllReviews(): Promise<Array<Review>>;
    getMenuItemsByCategory(category: string): Promise<Array<MenuItem>>;
}
