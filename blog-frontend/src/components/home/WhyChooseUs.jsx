const features = [
  {
    icon: "🤖",
    title: "AI Powered",
    description:
      "Generate high-quality blog content instantly with integrated AI assistance.",
  },
  {
    icon: "✍️",
    title: "Rich Text Editor",
    description:
      "Write beautiful articles using an intuitive editor with image support.",
  },
  {
    icon: "🌍",
    title: "Community Driven",
    description:
      "Read, share, like and comment on blogs from developers around the world.",
  },
  {
    icon: "🚀",
    title: "Fast Performance",
    description:
      "Optimized for speed to provide a smooth reading and writing experience.",
  },
  {
    icon: "🔒",
    title: "Secure Platform",
    description:
      "Authentication and protected routes keep your account and content safe.",
  },
  {
    icon: "📱",
    title: "Fully Responsive",
    description:
      "Enjoy a seamless experience across desktop, tablet, and mobile devices.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-gray-950 py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="text-sky-400 uppercase tracking-widest font-semibold">
            Why Choose Us
          </span>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Everything You Need To Start Blogging
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-gray-400 text-lg">
            Our platform combines AI, modern tools, and a beautiful experience
            to help you create and discover amazing blogs.
          </p>

        </div>

        {/* Cards */}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (

            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 transition-all duration-300 hover:border-sky-500 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-xl bg-sky-500/10 flex items-center justify-center text-3xl mb-6">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-400 leading-7">
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;