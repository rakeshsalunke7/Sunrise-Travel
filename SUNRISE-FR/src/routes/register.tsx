import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";

import { authApi } from "@/api/authApi";
import { getApiErrorMessage } from "@/api/axiosClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/register")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Register — Sunrise Travel" },
      {
        name: "description",
        content: "Create a Sunrise Travel employee account.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !designation
    ) {
      setFormError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await authApi.register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        designation,
      });

      navigate({
        to: "/login",
        search: {
          registered: "true",
        },
      });
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Unable to create your account."),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="panel p-6 sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="size-6 text-primary" />
            </div>

            <h1 className="text-2xl font-semibold text-foreground">
              Create your account
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Register as a Sunrise Travel employee.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>

              <Input
                id="fullName"
                type="text"
                placeholder="Neha Kulkarni"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>

              <Input
                id="email"
                type="email"
                placeholder="name@sunrise.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="designation">Designation</Label>

              <Select
                value={designation}
                onValueChange={setDesignation}
              >
                <SelectTrigger id="designation">
                  <SelectValue placeholder="Select your designation" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Junior Executive">
                    Junior Executive
                  </SelectItem>

                  <SelectItem value="Executive">
                    Executive
                  </SelectItem>

                  <SelectItem value="Senior Executive">
                    Senior Executive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 size-4" />
                  Create account
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}