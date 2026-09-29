import type { ReactNode } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import {
  ArrowRight,
  MapPin,
  ShoppingBag,
  Store,
  Truck,
} from 'lucide-react'

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-2xl font-black tracking-tight text-slate-900"
          >
            ?JA <span className="text-orange-500">?BA</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              <MapPin size={16} />
              Shop local. Deliver simply.
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
              Your local supermarket,
              <span className="text-orange-500"> at your doorstep.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover supermarkets around you, compare products, order what you
              need, and get it delivered without unnecessary hidden charges.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 font-bold text-white hover:bg-orange-600"
              >
                Start shopping
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-800 hover:bg-slate-50"
              >
                Become a partner
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <FeatureCard
              icon={<ShoppingBag size={24} />}
              title="For customers"
              text="Find nearby supermarkets and order your everyday essentials."
            />

            <FeatureCard
              icon={<Store size={24} />}
              title="For merchants"
              text="List your store, manage products, receive orders and grow."
            />

            <FeatureCard
              icon={<Truck size={24} />}
              title="For riders"
              text="Deliver orders and earn through the ?JA ?BA network."
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
        {icon}
      </div>

      <h2 className="text-lg font-bold text-slate-900">{title}</h2>

      <p className="mt-2 leading-7 text-slate-600">{text}</p>
    </div>
  )
}

function SimplePage({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Link
          to="/"
          className="text-sm font-semibold text-orange-500 hover:text-orange-600"
        >
          ? Back to ?JA ?BA
        </Link>

        <h1 className="mt-6 text-3xl font-black text-slate-950">
          {title}
        </h1>

        <p className="mt-3 leading-7 text-slate-600">{text}</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/login"
        element={
          <SimplePage
            title="Log in"
            text="Customer, merchant, rider and admin authentication will live here."
          />
        }
      />

      <Route
        path="/signup"
        element={
          <SimplePage
            title="Create your account"
            text="New accounts begin as customers. Merchant and rider onboarding will be handled separately."
          />
        }
      />

      <Route
        path="/customer"
        element={
          <SimplePage
            title="Customer dashboard"
            text="Nearby stores, products, cart and orders will live here."
          />
        }
      />

      <Route
        path="/merchant"
        element={
          <SimplePage
            title="Merchant dashboard"
            text="Store setup, products, orders and merchant operations will live here."
          />
        }
      />

      <Route
        path="/rider"
        element={
          <SimplePage
            title="Rider dashboard"
            text="Onboarding, KYC, deliveries, earnings and availability will live here."
          />
        }
      />

      <Route
        path="/admin"
        element={
          <SimplePage
            title="Admin dashboard"
            text="Applications, approvals, platform operations and audit activity will live here."
          />
        }
      />

      <Route
        path="*"
        element={
          <SimplePage
            title="Page not found"
            text="The page you requested does not exist."
          />
        }
      />
    </Routes>
  )
}

export default App
