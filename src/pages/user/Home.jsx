import { Link } from "react-router-dom";
import { Logo } from "../../components/Icons";
import "../../styles/styles.css";
import {
  Scissors,
  Palette,
  Sparkles,
  Droplets,
  Leaf,
} from "lucide-react";


const Home = () => {
  return (
    <>
      <section className="relative overflow-hidden px-4 sm:px-8 py-16 sm:py-16 lg:py-20">
        <div
          className="absolute -top-14 -left-12 w-64 h-64 rounded-full blur-3xl opacity-40"
          style={{ background: "color-mix(in srgb, var(--brand) 34%, transparent)" }}
        />
        <div
          className="absolute -bottom-20 right-0 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{ background: "color-mix(in srgb, var(--brand-strong) 30%, transparent)" }}
        />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center app-enter">
          <div>
            <p className="inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-[var(--brand-soft)] text-[var(--brand-strong)]">
              Premium Grooming Studio
            </p>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-[var(--ink-strong)]">
              Crafted cuts, modern confidence.
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[var(--ink-mid)] max-w-xl">
              CoolCuts blends precision barbering and elevated styling in one flow. Book in
              seconds, pick your services, and track your appointments with a smooth app-first experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/book-appointment"
                className="inline-flex items-center rounded-xl px-5 py-3 text-white font-semibold transition hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-strong) 100%)",
                  boxShadow: "0 14px 32px color-mix(in srgb, var(--brand) 40%, transparent)",
                }}
              >
                Book Appointment
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center rounded-xl px-5 py-3 font-semibold border border-[var(--line)] text-[var(--ink-mid)] hover:bg-[var(--surface-hover)] transition"
              >
                Explore Services
              </Link>
            </div>
          </div>

          <div className="surface-card p-4 sm:p-5">
            <img
              src="/Images/hero.png"
              alt="CoolCuts interior"
              className="w-full h-[320px] sm:h-[420px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-3 mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--ink-strong)]">
              Signature Services
            </h2>
            <Link to="/services" className="text-sm font-semibold text-[var(--brand-strong)] hover:underline">
              Full list
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {services.map((service, idx) => {
              const Icon = service.icon;

              return (
                <div
                  key={idx}
                  className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 transition hover:shadow-md"
                >
                  <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-[var(--brand-soft)] p-3">
                    <Icon
                      size={22}
                      className="text-[var(--brand-strong)]"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-[var(--ink-strong)]">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm text-[var(--ink-soft)]">
                    {service.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 pb-14 sm:pb-20">
        <div
          className="max-w-7xl mx-auto rounded-3xl p-8 sm:p-10 border"
          style={{
            borderColor: "var(--line)",
            background:
              "linear-gradient(140deg, color-mix(in srgb, var(--brand-soft) 72%, white 28%) 0%, color-mix(in srgb, var(--surface) 94%, transparent) 65%)",
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--ink-strong)]">
            Ready for your next look?
          </h2>
          <p className="text-[var(--ink-mid)] mt-2 max-w-2xl">
            Pick one or multiple services, choose your slot, and let our team handle the rest.
          </p>
          <div className="mt-6">
            <Link
              to="/book-appointment"
              className="inline-flex items-center rounded-xl px-5 py-3 text-white font-semibold transition hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-strong) 100%)",
              }}
            >
              Start Booking
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-5 py-8 flex items-center sm:flex-row flex-col gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold text-[var(--ink-strong)]">CoolCuts</span>
          </Link>
          <p className="text-sm text-[var(--ink-soft)] sm:ml-4">© 2026 CoolCuts</p>
        </div>
      </footer>
    </>
  );
};


const services = [
  {
    icon: Scissors,
    title: "Precision Haircuts",
    description:
      "Shape, texture, and finish tailored to your face and style preferences.",
  },
  {
    icon: Scissors,
    title: "Beard Design",
    description:
      "Sharp lineups, trims, and clean shaves with skin-comfort detail.",
  },
  {
    icon: Palette,
    title: "Color Sessions",
    description:
      "Professional coloring with tone balancing and healthy post-care.",
  },
  {
    icon: Sparkles,
    title: "Event Styling",
    description:
      "Quick styling sessions for events, meetings, and special occasions.",
  },
  {
    icon: Droplets,
    title: "Facial Refresh",
    description:
      "Deep cleanse and hydration to reset and brighten tired skin.",
  },
  {
    icon: Leaf,
    title: "Scalp Therapy",
    description:
      "Scalp-focused treatment to support comfort and stronger growth.",
  },
];


export default Home;
