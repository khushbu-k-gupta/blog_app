import { Link } from "react-router-dom";

const AiBanner = () => {
  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700 p-10 lg:p-16">

          {/* Blur Background */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-400 opacity-20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-400 opacity-20 blur-3xl rounded-full"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}

            <div>

              <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-sky-200 text-sm font-semibold mb-6">
                🤖 AI Powered Writing
              </span>

              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Generate Amazing Blog Posts
                <br />
                in Seconds
              </h2>

              <p className="mt-6 text-lg text-sky-100 leading-relaxed">
                Turn your ideas into engaging articles using AI.
                Generate titles, content, and tags with just one click.
              </p>

              <div className="flex flex-wrap gap-4 mt-10">

                <Link
                  to="/create-post"
                  className="px-8 py-4 rounded-full bg-white text-sky-700 font-bold hover:bg-gray-100 transition"
                >
                  Generate with AI
                </Link>

                <Link
                  to="/blogs"
                  className="px-8 py-4 rounded-full border border-white/40 text-white hover:bg-white/10 transition"
                >
                  Explore Blogs
                </Link>

              </div>

            </div>

            {/* Right */}

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">

              <div className="text-sm text-sky-200 mb-3">
                AI Preview
              </div>

              <h3 className="text-2xl font-bold text-white">
                How AI is Transforming Web Development
              </h3>

              <p className="mt-5 text-gray-200 leading-7">
                Artificial Intelligence is reshaping modern web
                development by improving productivity, automating
                repetitive tasks, generating code, assisting with
                debugging, and helping developers build applications
                faster than ever before...
              </p>

              <div className="mt-8 flex gap-3 flex-wrap">

                <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-sky-100">
                  #AI
                </span>

                <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-sky-100">
                  #JavaScript
                </span>

                <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-sky-100">
                  #Productivity
                </span>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AiBanner;