
import Onboard01 from "./assets/onboard-01.png";
import Onboard02 from "./assets/onboard-02.png";
import Onboard03 from "./assets/onboard-03.png";

export default function OnBoardCarousel() {
  const carouselItems = [
    {
      id: "item1",
      image: Onboard01,
      alt: "Discover quizzes",
      title: "Discover Quizzes",
      text: "Find tests curated to map your unique on-chain identity.",
    },
    {
      id: "item2",
      image: Onboard02,
      alt: "Complete the quiz",
      title: "Take the Quiz",
      text: "Answer quick prompts and unlock your personality archetype.",
    },
    {
      id: "item3",
      image: Onboard03,
      alt: "Join the web3 world",
      title: "Own Your Result",
      text: "Mint your profile and use it across the web3 ecosystem.",
    },
  ];

  return (
    <div className="mb-8 py-6">
      <div className="carousel w-full rounded-2xl overflow-hidden border border-base-300 bg-base-100">
        {carouselItems.map((item) => (
          <div key={item.id} id={item.id} className="carousel-item w-full">
            <div className="w-full">
              <div className="w-full aspect-[4/3] bg-base-200">
                <img
                  src={item.image}
                  className="w-full bg-white h-full object-contain"
                  alt={item.alt}
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-base-content/70">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full justify-center gap-2 py-4">
        {carouselItems.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="btn btn-circle btn-xs md:btn-sm bg-base-300 hover:bg-base-200 border-none"
          >
            {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
}
