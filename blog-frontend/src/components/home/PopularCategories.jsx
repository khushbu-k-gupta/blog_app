import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "React",
    slug: "react",
    icon: "⚛️",
    color: "hover:border-sky-500 hover:bg-sky-500/10",
  },
  {
    name: "Next.js",
    slug: "next-js",
    icon: "▲",
    color: "hover:border-gray-400 hover:bg-gray-700/20",
  },
  {
    name: "JavaScript",
    slug: "javascript",
    icon: "🟨",
    color: "hover:border-yellow-500 hover:bg-yellow-500/10",
  },
  {
    name: "Node.js",
    slug: "node-js",
    icon: "🟢",
    color: "hover:border-green-500 hover:bg-green-500/10",
  },
  {
    name: "MongoDB",
    slug: "mongodb",
    icon: "🍃",
    color: "hover:border-green-600 hover:bg-green-600/10",
  },
  {
    name: "AI",
    slug: "ai",
    icon: "🤖",
    color: "hover:border-cyan-500 hover:bg-cyan-500/10",
  },
  {
    name: "CSS",
    slug: "css",
    icon: "🎨",
    color: "hover:border-pink-500 hover:bg-pink-500/10",
  },
  {
    name: "Career",
    slug: "career",
    icon: "💼",
    color: "hover:border-orange-500 hover:bg-orange-500/10",
  },
];

const PopularCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-sky-400 font-semibold uppercase tracking-widest">
            Categories
          </span>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Explore Popular Topics
          </h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Discover articles across modern web technologies, AI, programming,
            and career growth.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className={`
                group
                bg-gray-900
                border
                border-gray-800
                rounded-2xl
                p-8
                transition-all
                duration-300
                hover:-translate-y-2
                ${category.color}
              `}
            >
              <div className="text-5xl mb-5 transition-transform duration-300 group-hover:scale-110">
                {category.icon}
              </div>

              <h3 className="text-xl font-semibold text-white">
                {category.name}
              </h3>

              <p className="text-gray-500 mt-2 text-sm">
                Explore Articles →
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;