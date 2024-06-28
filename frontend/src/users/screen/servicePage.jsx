import React from "react";
import ServiceCard from "../components/serviceCard";
import worker from "../assests/worker.jpeg";
import serviceInfo from "../data/serviceInfo";

const Service = () => {
  return (
    <div id="service" className="flex flex-wrap">
      <div id="serviceContent" className="flex-1 p-10">
        <div className="text-4xl mb-2 mt-3 font-pt-sans-bold max-w-md">
          WE OFFER A WIDE RANGE OF CAR SERVICES
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {serviceInfo.map((card, index) => (
            <ServiceCard
              key={index}
              image={card.image}
              description={card.description}
            />
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-16 mt-10">
        <img src={worker} alt="service" className="w-full h-3/4 object-cover" />
      </div>
    </div>
  );
};

export default Service;
