"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import AuthCard, { inputClass, primaryButtonClass } from "@/components/AuthCard";

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // /auth/confirm already exchanged the email link for a session; without one the link was
  // missing, expired or already used.
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setHasSession(Boolean(data.user)));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setPending(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setPending(false);
      setError(
        updateError.message.toLowerCase().includes("different")
          ? "Le nouveau mot de passe doit être différent de l'ancien."
          : "Le mot de passe n'a pas pu être modifié. Réessayez ou demandez un nouveau lien.",
      );
      return;
    }
    // Make the user sign in with the new password explicitly.
    await supabase.auth.signOut();
    router.replace("/login?message=account-created");
  };

  if (hasSession === null) return null;

  if (!hasSession) {
    return (
      <AuthCard title="Ce lien n'est plus valable">
        <p className="text-center">
          Le lien de réinitialisation a expiré ou a déjà été utilisé. Demandez-en un nouveau.
        </p>
        <Link href="/forgot-password" className={primaryButtonClass}>
          Demander un nouveau lien
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Nouveau mot de passe">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label htmlFor="password" className="text-md">
          Nouveau mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className={inputClass}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={MIN_PASSWORD_LENGTH}
          required
        />
        <p className="text-xs text-foreground/60 -mt-2">Au moins {MIN_PASSWORD_LENGTH} caractères.</p>
        <label htmlFor="confirmPassword" className="text-md">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={inputClass}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Enregistrement..." : "Enregistrer le mot de passe"}
        </button>
      </form>
      {error && <p className="text-sm text-center text-red-600" role="alert">{error}</p>}
    </AuthCard>
  );
}
