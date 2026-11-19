"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type Mode = "signIn" | "signUp";

const MIN_PASSWORD_LENGTH = 8;

const inputClass =
  "rounded-md px-4 py-2 bg-background border-foreground border-2 focus:outline-none focus:ring-2 focus:ring-[#7B6EF6] focus:border-transparent transition-all";

const initialMessages: Record<string, string> = {
  "session-expired": "Votre session a expiré, merci de vous reconnecter.",
  "account-created": "Votre mot de passe a été mis à jour. Vous pouvez vous connecter.",
};

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email ou mot de passe incorrect.";
  if (m.includes("email not confirmed")) {
    return "Votre adresse email n'est pas encore confirmée. Vérifiez votre boîte mail (et vos spams).";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
  }
  if (m.includes("password") && m.includes("characters")) {
    return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }
  if (m.includes("password") && (m.includes("weak") || m.includes("pwned"))) {
    return "Ce mot de passe est trop faible ou trop courant. Choisissez-en un autre.";
  }
  if (m.includes("valid email") || m.includes("invalid email")) {
    return "Cette adresse email n'est pas valide.";
  }
  if (m.includes("failed to fetch") || m.includes("network")) {
    return "Impossible de joindre le serveur. Vérifiez votre connexion.";
  }
  return "Une erreur est survenue. Réessayez dans un instant.";
}

export function AuthForm({ initialMessage }: { initialMessage?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const info = initialMessage ? initialMessages[initialMessage] : undefined;

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNeedsConfirmation(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNeedsConfirmation(false);

    const cleanEmail = email.trim();
    if (mode === "signUp") {
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`);
        return;
      }
      if (password !== confirmPassword) {
        setError("Les deux mots de passe ne correspondent pas.");
        return;
      }
    }

    setPending(true);
    const supabase = createClient();

    if (mode === "signIn") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      setPending(false);
      if (signInError) {
        setError(translateAuthError(signInError.message));
        setNeedsConfirmation(signInError.message.toLowerCase().includes("email not confirmed"));
        return;
      }
      router.replace("/");
      router.refresh();
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    setPending(false);
    if (signUpError) {
      setError(translateAuthError(signUpError.message));
      return;
    }
    // Same screen whether or not the address already existed (Supabase does not reveal it).
    router.push(`/auth/check-email?email=${encodeURIComponent(cleanEmail)}`);
  };

  return (
    <div className="flex flex-col w-full gap-4 text-foreground">
      <div className="grid grid-cols-2 rounded-md border border-foreground/20 p-1" role="tablist">
        {(["signIn", "signUp"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={mode === tab}
            onClick={() => switchMode(tab)}
            className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
              mode === tab ? "bg-[#AF80FF] text-white" : "hover:bg-foreground/5"
            }`}
          >
            {tab === "signIn" ? "Se connecter" : "Créer un compte"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-2" noValidate={false}>
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={`${inputClass} mb-4`}
          placeholder="adresseemail@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="text-md" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "signIn" ? "current-password" : "new-password"}
          className={`${inputClass} ${mode === "signUp" ? "mb-1" : "mb-2"}`}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={mode === "signUp" ? MIN_PASSWORD_LENGTH : undefined}
          required
        />
        {mode === "signUp" ? (
          <>
            <p className="text-xs text-foreground/60 mb-3">
              Au moins {MIN_PASSWORD_LENGTH} caractères.
            </p>
            <label className="text-md" htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={`${inputClass} mb-4`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </>
        ) : (
          <div className="mb-3 text-right">
            <Link href="/forgot-password" className="text-sm underline text-foreground/70 hover:text-foreground">
              Mot de passe oublié ?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-[#AF80FF] rounded-md px-4 py-2 text-white hover:bg-[#6a5dd5] transition-colors disabled:opacity-60"
        >
          {pending
            ? mode === "signIn" ? "Connexion..." : "Création..."
            : mode === "signIn" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      {mode === "signUp" && (
        <p className="text-xs text-foreground/60 text-center">
          Après la création, vous recevrez un email pour confirmer votre adresse. L&apos;accès aux
          fonctionnalités est ensuite activé par un administrateur.
        </p>
      )}

      {info && !error && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md" role="status">
          <p className="text-green-700 text-center text-sm font-medium">{info}</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
          <p className="text-red-600 text-center text-sm font-medium">{error}</p>
          {needsConfirmation && (
            <p className="text-center text-sm mt-2">
              <Link
                className="underline text-red-700"
                href={`/auth/check-email?email=${encodeURIComponent(email.trim())}`}
              >
                Renvoyer l&apos;email de confirmation
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
