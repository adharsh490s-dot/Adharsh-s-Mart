import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";

type Meta = { full_name?: string; name?: string; phone?: string };

export function AuthSync() {
  const { signIn, signOut } = useStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const apply = (session: { user: { email?: string; phone?: string; user_metadata?: Meta } } | null) => {
      if (!session?.user) {
        signOut();
        return;
      }
      const meta = (session.user.user_metadata ?? {}) as Meta;
      const email = session.user.email ?? "";
      signIn({
        name: meta.full_name || meta.name || email.split("@")[0] || "Shopper",
        email,
        phone: meta.phone || session.user.phone || "",
      });
    };

    supabase.auth.getSession().then(({ data }) => apply(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      apply(session);
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });

    return () => sub.subscription.unsubscribe();
  }, [signIn, signOut, router, queryClient]);

  return null;
}
