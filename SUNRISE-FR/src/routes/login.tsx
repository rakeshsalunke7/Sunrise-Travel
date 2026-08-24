import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Hotel,
  Loader2,
  Lock,
  MapPin,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { authApi } from "@/api/authApi";
import { getApiErrorMessage } from "@/api/axiosClient";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleHome, setAuth } from "@/lib/authStore";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/login")({
  ssr: false,

  head: () => ({
    meta: [
      { title: "Sign in — Sunrise Travel" },
      {
        name: "description",
        content:
          "Sign in to Sunrise Travel to book corporate flights and hotels, track approvals and manage tickets.",
      },
      {
        property: "og:title",
        content: "Sign in — Sunrise Travel",
      },
      {
        property: "og:description",
        content:
          "Corporate travel booking, approvals and ticketing for Sunrise employees.",
      },
    ],
  }),

  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate({
        to: roleHome[session.role],
        replace: true,
      });
    }
  }, [session, navigate]);

  function validate() {
    const next: {
      email?: string;
      password?: string;
    } = {};

    if (!email.trim()) {
      next.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      next.email = "Enter a valid email address";
    }

    if (!password) {
      next.password = "Password is required";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setFormError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.login(email.trim(), password);

      if (!data?.token || !data?.role) {
        setFormError(
          "Unexpected response from the server. Please contact IT support.",
        );
        return;
      }

      setAuth({
        token: data.token,
        role: data.role,
        email: email.trim(),
      });

      navigate({
        to: roleHome[data.role],
        replace: true,
      });
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Invalid email or password."),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3eb] text-[#123b35]">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col lg:flex-row">

        {/* ========================================================= */}
        {/* LEFT — TRAVEL BRAND EXPERIENCE */}
        {/* ========================================================= */}

        <section className="relative hidden overflow-hidden bg-[#003f35] lg:flex lg:w-[55%]">

          {/* Decorative background shapes */}
          <div className="absolute -right-32 -top-32 size-[420px] rounded-full border border-white/10" />
          <div className="absolute -right-20 -top-20 size-[300px] rounded-full border border-white/10" />

          <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-[#087c67]/20" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            {/* Logo */}
            <div>
              <Logo />

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-[#a7d8cc]">
                Corporate Travel Portal
              </p>
            </div>

            {/* Main travel visual */}
            <div className="max-w-2xl">

              <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-white xl:text-5xl">
                Move people,
                <br />
                not paperwork.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
                One place to discover company travel options, stay within
                policy, get approvals and manage every booking.
              </p>

              {/* Route card */}
              <div className="mt-10 max-w-xl rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                      Upcoming journey
                    </p>

                    <p className="mt-1 text-sm font-medium text-white/80">
                      Corporate trip
                    </p>
                  </div>

                  <div className="rounded-full bg-[#ccefe6]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#a7d8cc]">
                    Policy checked
                  </div>

                </div>

                <div className="mt-7 flex items-center gap-4">

                  {/* Pune */}
                  <div className="min-w-20">

                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-[#6ed1bd]" />

                      <span className="text-xs text-white/50">
                        FROM
                      </span>
                    </div>

                    <p className="mt-1 text-2xl font-semibold text-white">
                      Pune
                    </p>

                    <p className="text-xs text-white/45">
                      PNQ
                    </p>

                  </div>

                  {/* Route */}
                  <div className="relative flex flex-1 items-center">

                    <div className="h-px w-full bg-white/20" />

                    <div className="absolute left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#075548]">
                      <Plane
                        className="size-4 rotate-90 text-[#8ee0cf]"
                        strokeWidth={1.8}
                      />
                    </div>

                  </div>

                  {/* Delhi */}
                  <div className="min-w-20 text-right">

                    <div className="flex items-center justify-end gap-2">

                      <span className="text-xs text-white/50">
                        TO
                      </span>

                      <MapPin className="size-4 text-[#6ed1bd]" />

                    </div>

                    <p className="mt-1 text-2xl font-semibold text-white">
                      Delhi
                    </p>

                    <p className="text-xs text-white/45">
                      DEL
                    </p>

                  </div>

                </div>
              </div>

              {/* Feature cards */}
              <div className="mt-5 grid max-w-xl grid-cols-3 gap-3">

                <Feature
                  icon={<Plane />}
                  title="Flights"
                  description="Company fares"
                />

                <Feature
                  icon={<Hotel />}
                  title="Hotels"
                  description="Approved stays"
                />

                <Feature
                  icon={<ShieldCheck />}
                  title="Policy"
                  description="Auto checked"
                />

              </div>

            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6">

              <p className="text-xs text-white/40">
                Sunrise Travel
              </p>

              <div className="flex items-center gap-2 text-xs text-white/40">
                <CheckCircle2 className="size-3.5" />
                Secure corporate access
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* RIGHT — LOGIN */}
        {/* ========================================================= */}

        <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:min-h-0 lg:px-12 xl:px-20">

          <div className="w-full max-w-md">

            {/* Mobile branding */}
            <div className="mb-10 lg:hidden">
              <Logo />

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#087c67]">
                Corporate Travel Portal
              </p>
            </div>

            {/* Login heading */}
            <div>

              <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-[#087c67]/10">
                <ShieldCheck className="size-5 text-[#087c67]" />
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-[#123b35]">
                Welcome back.
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#607c76]">
                Sign in to continue to your Sunrise Travel workspace.
              </p>

            </div>

            {/* Login form */}
            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* Email */}
              <div className="space-y-2">

                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-[#123b35]"
                >
                  Work email
                </Label>

                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@sunrise.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  className="h-12 rounded-xl border-[#d5ddd8] bg-white px-4 text-sm shadow-none transition-all placeholder:text-[#9aa9a4] focus-visible:border-[#087c67] focus-visible:ring-[#087c67]/20"
                />

                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* Password */}
              <div className="space-y-2">

                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-[#123b35]"
                >
                  Password
                </Label>

                <div className="relative">

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    aria-invalid={Boolean(errors.password)}
                    className="h-12 rounded-xl border-[#d5ddd8] bg-white px-4 pr-12 text-sm shadow-none transition-all placeholder:text-[#9aa9a4] focus-visible:border-[#087c67] focus-visible:ring-[#087c67]/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#718681] transition-colors hover:text-[#087c67]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>

                </div>

                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password}
                  </p>
                )}

              </div>

              {/* Error */}
              {formError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {formError}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-full bg-[#087c67] text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#066b59] hover:shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 size-4" />
                    Sign in
                    <ArrowRight className="ml-1 size-4" />
                  </>
                )}
              </Button>

            </form>

            {/* Register */}
            <div className="mt-7 rounded-xl border border-[#dce5e1] bg-white/60 px-4 py-4 text-center">

              <p className="text-sm text-[#607c76]">
                New to Sunrise Travel?{" "}

                <Link
                  to="/register"
                  className="font-semibold text-[#087c67] transition-colors hover:text-[#055b4c] hover:underline"
                >
                  Create an account
                </Link>

              </p>

            </div>

            {/* Security */}
            <div className="mt-5 flex items-start gap-3 px-1">

              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#087c67]" />

              <p className="text-xs leading-5 text-[#718681]">
                Access is controlled by your travel administrator.
                Your bookings and travel activity are protected by
                company security policies.
              </p>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

/* =============================================================== */
/* FEATURE CARD                                                     */
/* =============================================================== */

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3">

      <div className="flex size-7 items-center justify-center rounded-lg bg-[#8ee0cf]/10 text-[#8ee0cf]">
        {icon}
      </div>

      <p className="mt-2 text-xs font-semibold text-white">
        {title}
      </p>

      <p className="mt-0.5 text-[10px] text-white/40">
        {description}
      </p>

    </div>
  );
}