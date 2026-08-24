import { useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { roleHome, type Role } from "@/lib/authStore";
import { useAuth } from "@/lib/useAuth";

/**
 * Client-side navigation guard. The Spring Boot API remains authoritative:
 * this only keeps users out of screens their role cannot use.
 */
export function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate({ to: "/login", replace: true });
    }
  }, [session, navigate]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  if (session.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="panel max-w-md p-6 text-center">
          <ShieldAlert className="mx-auto size-8 text-destructive" />
          <h1 className="mt-3 text-lg font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You don&apos;t have permission to access this page.
          </p>
          <Button className="mt-5" onClick={() => navigate({ to: roleHome[session.role] })}>
            Go to my workspace
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
