function Footer() {
  return (
    <>
      <footer className="mx-8 my-8 rounded-2xl bg-black-primary px-10 py-10">
        <div className="flex flex-row items-center justify-center gap-2 pb-4">
          <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs text-blue-500">
            Technology
          </p>

          <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs text-blue-500">
            AI
          </p>

          <p className="rounded-full bg-purple-500/20 px-2.5 py-1 text-xs text-purple-400">
            Design
          </p>
        </div>

        <h2 className="flex items-center justify-center text-center text-3xl font-bold text-white-primary">
          Ready to find your community?
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-center text-sm leading-6 text-gray-primary">
          Join thousands of developers, designers, and makers in Indonesia's
          <br />
          most active tech communities.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <a
            href=""
            className="rounded-lg bg-orange-primary px-6 py-3 text-sm font-semibold text-white-primary"
          >
            Explore Events
          </a>

          <a
            href=""
            className="rounded-lg border border-gray-secondary/30 bg-transparent px-6 py-3 text-sm font-semibold text-gray-secondary"
          >
            Browse Communities
          </a>
        </div>
      </footer>
    </>
  );
}

export default Footer;
