import React from "react";

const Offer = () => {
  const picture = [
    {
      id: 1,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/homepage/2023/bts/4-story/4_story_1.jpg",
      title: "Back-to-School",
    },
    {
      id: 2,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/homepage/2023/summer/4-story/wk18_060123_4_story_2_nike.jpg",
      title: "Nike Savings for",
    },
    {
      id: 3,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/homepage/2023/summer/4-story/wk18_060123_4_story_1_50_sandals.jpg",
      title: "Save on Summer",
    },
    {
      id: 4,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/homepage/2023/bts/4-story/story-4.gif",
      title: "Save on Famous",
    },
  ];

  return (
    <div className="bg-white">
      <div className="py-10 w-4/5 m-auto bg-white">
        <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
          {picture.map((val) => {
            return (
              <div className="text-center text-gray-700 font-bold" key={val.id}>
                <img src={val.img} alt="" className="mb-2" />
                <h2>{val.title}</h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Offer;
