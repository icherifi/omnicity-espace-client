"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import AuthCard, { inputClass, primaryButtonClass } from "@/components/AuthCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);
    const { error: resetError } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
    });
    setPending(false);
    if (resetError && resetError.message.toLowerCase().includes("rate")) {
      setError("Trop de demandes. Patientez quelques minutes avant de réessayer.");
      return;
    }
    // Same answer whether or not the address has an account (no account enumeration).
    setSent(true);
  };

  if (sent) {
    return (
      <AuthCard title="Vérifiez votre boîte mail">
        <p className="text-center">
          Si un compte existe pour <strong>{email.trim()}</strong>, vous allez recevoir un email
          avec un lien pour choisir un nouveau mot de passe. Il est valable 1 heure.
        </p>
        <Link href="/login" className={primaryButtonClass}>
          Retour à la connexion
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Mot de passe oublié">
      <p className="text-center text-sm text-foreground/70">
        Indiquez votre adresse email, nous vous enverrons un lien pour en choisir un nouveau.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label htmlFor="email" className="text-md">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          placeholder="adresseemail@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Envoi..." : "Envoyer le lien"}
        </button>
      </form>
      {error && <p className="text-sm text-center text-red-600" role="alert">{error}</p>}
      <p className="text-sm text-center">
        <Link href="/login" className="underline">
          Retour à la connexion
        </Link>
      </p>
    </AuthCard>
  );
}
