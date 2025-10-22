export function FeaturedQuiz() {
    return (
      <div className="card bg-base-300 rounded-4xl w-full flex flex-col gap-4 py-6">
        <div className="badge badge-soft badge-accent ml-6">Space Cat</div>
        <h3 className="text-2xl font-bold ml-6 my-4">Imagine you are a space cat</h3>
        <div className="flex flex-row ml-6 mb-6 overflow-x-scroll gap-4 scroll-smooth snap-x">
          <FeaturedQuizItem
            imageUrl="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            title="Attractionszzzzzzzzzzasdsadsaasd"
          />
          <FeaturedQuizItem
            imageUrl="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            title="Attractions"
          />
          <FeaturedQuizItem
            imageUrl="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            title="Attractions"
          />
          <FeaturedQuizItem
            imageUrl="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            title="Attractions"
          />
          <FeaturedQuizItem
            imageUrl="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            title="Attractions"
          />
          <FeaturedQuizItem
            imageUrl="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            title="Attractions"
          />
        </div>
        <div className="px-6">
        <button className="btn btn-accent text-white rounded-full">
          Get your personality
        </button>
  
        </div>
      </div>
    );
  }
  
  interface FeaturedQuizItemProps {
    imageUrl: string;
    title: string;
  }
  
  function FeaturedQuizItem({ imageUrl, title }: FeaturedQuizItemProps) {
    return (
      <div className="snap-start rounded-xl w-48 h-56 overflow-hidden relative shrink-0">
        <figure className="h-full">
          <img className="object-cover h-full " src={imageUrl} alt="Shoes" />
        </figure>
        <div className="absolute truncate bottom-0 bg-gradient-to-t from-black/60 to-transparent from-20% w-full px-2 py-4">
          <span className="text-white font-semibold">{title}</span>
        </div>
      </div>
    );
  }
  