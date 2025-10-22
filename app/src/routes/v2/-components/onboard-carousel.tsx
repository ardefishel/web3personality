
import Onboard01 from "./assets/onboard-01.png";
import Onboard02 from "./assets/onboard-02.png";
import Onboard03 from "./assets/onboard-03.png";

export default function OnBoardCarousel() {
    const carouselItems = [
      {
        id: "item1",
        image: Onboard01,
        alt: "Discover your quiz",
        text: "Discover your quiz",
      },
      {
        id: "item2",
        image: Onboard02,
        alt: "Complete the quiz",
        text: "Complete the quiz to get your result PFP NFT",
      },
      {
        id: "item3",
        image: Onboard03,
        alt: "Join the web3 world",
        text: "Use the PFP to join the web3 world",
      },
    ];
  
    return (
      <div className="mb-8 py-12">
        <div className="carousel w-full rounded-xl overflow-hidden shadow-lg">
          {carouselItems.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="carousel-item w-full relative"
            >
              <img
                src={item.image}
                className="w-full h-96 object-contain bg-white p-4"
                alt={item.alt}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                <p className="text-sm font-medium">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
  
        <div className="flex w-full justify-center gap-2 py-4">
          {carouselItems.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="btn btn-circle btn-sm bg-white/20 hover:bg-white/30 border-none text-white"
            >
              {index + 1}
            </a>
          ))}
        </div>
      </div>
    );
  }