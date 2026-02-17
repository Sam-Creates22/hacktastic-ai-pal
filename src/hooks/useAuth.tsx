import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  profileCompleted: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  profileCompleted: false,
  loading: true,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("profile_completed")
      .eq("user_id", userId)
      .maybeSingle();
    setProfileCompleted(!!(data as any)?.profile_completed);
  };

  const refreshProfile = async () => {
    if (user) await checkProfile(user.id);
  };

  const setupUser = async (currentSession: Session | null) => {
    setSession(currentSession);
    setUser(currentSession?.user ?? null);

    if (currentSession?.user) {
      const [{ data: adminData }] = await Promise.all([
        supabase.rpc("has_role", { _user_id: currentSession.user.id, _role: "admin" }),
        checkProfile(currentSession.user.id),
      ]);
      setIsAdmin(!!adminData);
    } else {
      setIsAdmin(false);
      setProfileCompleted(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await setupUser(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setupUser(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, profileCompleted, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
