import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import NewsLetter from "../../components/home/NewsLetter";
import PopularCategories from "../../components/home/PopularCategories";
import FeaturedPosts from "../../components/home/FeaturedPost";
import LatestPosts from "../../components/home/LatestPosts";
import AiBanner from "../../components/home/AiBanner";
import TrendingPosts from "../../components/home/TrendingPosts";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Hero from "../../components/home/Hero";
import Footer from "../../components/layout/Footer";

const Home = () => {
  return (
    <>
      <Navbar/>
      <Hero />
      <PopularCategories />
      {/* <FeaturedPosts /> */}
      <LatestPosts />
      <AiBanner />
      <TrendingPosts />
      <WhyChooseUs />
      <NewsLetter />
      <Footer/>
    </>
  );
};

export default Home;
