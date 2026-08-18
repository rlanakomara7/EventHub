import AuthSidebar from "./AuthSidebar";

function AuthLayout({ children }) {
  return (
    <main className="grid min-h-screen md:grid md:grid-cols-2">
      <div className="hidden md:block">
        <AuthSidebar />
      </div>

      <section className="flex items-center justify-center bg-white">
        {children}
      </section>
    </main>
  );
}

export default AuthLayout;
