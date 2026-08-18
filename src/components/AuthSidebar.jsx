function AuthSidebar() {
  return (
    <aside className="relative flex min-h-screen flex-col overflow-hidden bg-black-primary bg-radial from-orange-600/20 from-0% via-orange-500/10 via-35% to-transparent to-70% px-6 py-5 text-white-primary">
      <div className="flex items-center gap-2">
        <p className="rounded-xl bg-orange-primary px-3.5 py-1.5 font-bold text-white-primary">
          E
        </p>

        <p className="text-lg font-bold">EventHub</p>
      </div>

      <div className="mt-20">
        <h1 className="max-w-sm text-4xl font-bold leading-tight">
          Discover events
          <br />
          that shape careers.
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-gray-secondary">
          Workshops, conferences, and community meetups from Indonesia's most
          active tech communities — all in one place.
        </p>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm leading-5 text-gray-300">
            "Found my last three workshops here. The community is fantastic."
          </p>

          <div className="mt-3 flex items-center gap-3">
            <img
              src="Image (Dina Rahayu).svg"
              alt="Dina Rahayu"
              className="h-8 w-8 rounded-full object-cover"
            />

            <div>
              <p className="text-sm font-semibold text-white-primary">
                Dina Rahayu
              </p>

              <p className="text-xs text-gray-secondary">
                Backend Lead, Cakrawala Digital
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm leading-5 text-gray-300">
            "EventHub is where Jakarta's tech scene actually happens."
          </p>

          <div className="mt-3 flex items-center gap-3">
            <img
              src="Image (Kevin Santoso).svg"
              alt="Kevin Santoso"
              className="h-8 w-8 rounded-full object-cover"
            />

            <div>
              <p className="text-sm font-semibold text-white-primary">
                Kevin Santoso
              </p>

              <p className="text-xs text-gray-secondary">
                ML Engineer, Nusantara Labs
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-10">
          <div>
            <p className="text-2xl font-bold">12k+</p>

            <p className="text-xs text-gray-secondary">Members</p>
          </div>

          <div>
            <p className="text-2xl font-bold">200+</p>

            <p className="text-xs text-gray-secondary">Events/year</p>
          </div>

          <div>
            <p className="text-2xl font-bold">50+</p>

            <p className="text-xs text-gray-secondary">Communities</p>
          </div>
        </div>
      </div>

      <p className="mt-auto pt-10 text-xs text-gray-secondary">
        © 2026 EventHub · Indonesia
      </p>
    </aside>
  );
}

export default AuthSidebar;
