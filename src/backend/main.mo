import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  type MenuItem = {
    name : Text;
    category : Text;
    price : Float;
    description : Text;
  };

  module MenuItem {
    public func compare(menuItem1 : MenuItem, menuItem2 : MenuItem) : Order.Order {
      Text.compare(menuItem1.name, menuItem2.name);
    };
  };

  type Review = {
    customerName : Text;
    rating : Nat8;
    comment : Text;
    date : Time.Time;
  };

  module Review {
    public func compare(review1 : Review, review2 : Review) : Order.Order {
      if (review1.date > review2.date) { return #less };
      if (review1.date < review2.date) { return #greater };
      #equal;
    };
  };

  let menuItems : [MenuItem] = [
    {
      name = "Masala Dosa";
      category = "Tiffins";
      price = 50.0;
      description = "Crispy crepe stuffed with spiced potatoes";
    },
    {
      name = "Veg Thali";
      category = "Meals";
      price = 120.0;
      description = "Assorted vegetarian dishes with rice and bread";
    },
    {
      name = "Chicken Biryani";
      category = "Special Items";
      price = 180.0;
      description = "Fragrant rice with marinated chicken and spices";
    },
    {
      name = "Filter Coffee";
      category = "Beverages";
      price = 30.0;
      description = "Traditional South Indian coffee";
    },
  ];

  var reviews : [Review] = [
    {
      customerName = "Alice";
      rating = 5;
      comment = "Excellent food and service!";
      date = 1_694_975_200_000_000_000;
    },
    {
      customerName = "Bob";
      rating = 4;
      comment = "Loved the dosas, will visit again.";
      date = 1_694_888_800_000_000_000;
    },
  ];

  public query ({ caller }) func getAllMenuItems() : async [MenuItem] {
    menuItems;
  };

  public query ({ caller }) func getMenuItemsByCategory(category : Text) : async [MenuItem] {
    menuItems.values().filter(func(item) { item.category == category }).toArray();
  };

  public query ({ caller }) func getAllReviews() : async [Review] {
    reviews.sort();
  };

  public shared ({ caller }) func addReview(customerName : Text, rating : Nat8, comment : Text) : async () {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let newReview : Review = {
      customerName;
      rating;
      comment;
      date = Time.now();
    };

    reviews := reviews.concat([newReview]);
  };
};
