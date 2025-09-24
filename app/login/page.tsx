import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./components/SubmitButton";
import { ThemeSwitch } from "./components/ThemeSwitch";
import { LoginBackground } from "./components/LoginBackground";
import dynamic from "next/dynamic";
const LoginLogo = dynamic(() => import("./components/LoginLogo").then(mod => mod.LoginLogo), { ssr: false });

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center">
      <LoginBackground />
      <div className="flex-col w-full px-8 sm:max-w-md justify-center gap-2 z-10">
        <div className="flex flex-col gap-2 items-center">
          <LoginLogo />
          <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-background border-foreground border-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#7B6EF6] focus:border-transparent transition-all"
              name="email"
              placeholder="adresseemail@exemple.com"
              required
            />
            <label className="text-md" htmlFor="password">
              Mot de Passe
            </label>
            <input
              className="rounded-md px-4 py-2 bg-background border-foreground border-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#7B6EF6] focus:border-transparent transition-all"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
            <SubmitButton
              formAction={signIn}
              className="bg-[#AF80FF] rounded-md px-4 py-2 text-white mb-2 hover:bg-[#6a5dd5] transition-colors"
              pendingText="Connexion..."
            >
              Se connecter
            </SubmitButton>
            <SubmitButton
              formAction={signUp}
              className="bg-black border border-foreground/20 rounded-md px-4 py-2 text-white mb-2 hover:bg-gray-800 transition-colors"
              pendingText="Création..."
            >
              Créer un compte
            </SubmitButton>
            {searchParams?.message && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-center font-medium">
                  {searchParams.message}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
      <ThemeSwitch />
    </div>
  );
}
