import { Link } from "react-router";

function Footer() {
  return (
    <footer className="mx-4 my-8 rounded-2xl bg-black-primary px-5 py-10 sm:mx-8 sm:px-10 sm:py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        {/* Categories */}
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-500">
            Technology
          </span>

          <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-500">
            AI
          </span>

          <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-400">
            Design
          </span>
        </div>

        {/* Heading */}
        <h2 className="max-w-xl text-balance text-center text-2xl leading-tight font-bold tracking-tight text-white-primary sm:text-3xl lg:text-4xl">
          Ready to find your community?
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-lg text-center text-sm leading-relaxed text-gray-secondary sm:text-base">
          Join thousands of developers, designers, and makers in Indonesia's
          most active tech communities.
        </p>

        {/* Buttons */}
        <div className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
          <Link
            to="/event"
            className="flex min-h-12 items-center justify-center rounded-xl bg-orange-primary px-6 py-3 text-center text-sm font-semibold text-white-primary transition-opacity hover:opacity-90"
          >
            Explore Events
          </Link>

          <Link
            to="/communities"
            className="flex min-h-12 items-center justify-center rounded-xl border border-gray-secondary/30 px-6 py-3 text-center text-sm font-semibold text-white-primary transition-colors hover:border-orange-primary hover:text-orange-primary"
          >
            Browse Communities
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
