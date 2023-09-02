import React from "react";
import Brands from "./Brands";
import Category from "./Category";
import Hero from "./Hero";
import NewArrivals from "./NewArrivals";
import Offer from "./Offer";
import ShopByCategory from "./ShopByCategory";

const Main = () => {
  return (
    <div>
      <Hero />
      <Offer />
      <ShopByCategory />
      <Category />
      <Brands />
      <NewArrivals />
    </div>
  );
};

export default Main;
