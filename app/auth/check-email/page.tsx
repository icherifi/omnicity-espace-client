"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import AuthCard, { secondaryButtonClass } from "@/components/AuthCard";

const RESEND_COOLDOWN_SECONDS = 60;

function CheckEmail() {
  const email = useSearchParams().get("email") ?? "";
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const resend = async () => {
    setMessage(null);
    setError(null);
    const { error: resendError } = await createClient().auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    if (resendError) {
      setError(
        resendError.message.toLowerCase().includes("rate")
          ? "Merci de patienter un peu avant de demander un nouvel email."
          : "L'email n'a pas pu être renvoyé. Réessayez dans un instant.",
      );
      setCooldown(RESEND_COOLDOWN_SECONDS);
      return;
    }
    setMessage("Un nouvel email vient de vous être envoyé.");
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  return (
    <AuthCard title="Vérifiez votre boîte mail">
      <p className="text-center">
        Nous avons envoyé un lien de confirmation
        {email ? (
          <>
            {" "}à <strong>{email}</strong>
          </>
        ) : null}
        . Cliquez dessus pour activer votre adresse, puis connectez-vous.
      </p>
      <p className="text-sm text-center text-foreground/70">
        Rien reçu ? Regardez dans vos courriers indésirables. Le lien est valable 1 heure.
      </p>

      {email && (
        <button onClick={resend} disabled={cooldown > 0} className={secondaryButtonClass}>
          {cooldown > 0 ? `Renvoyer l'email (${cooldown} s)` : "Renvoyer l'email"}
        </button>
      )}

      {message && <p className="text-sm text-center text-green-700" role="status">{message}</p>}
      {error && <p className="text-sm text-center text-red-600" role="alert">{error}</p>}

      <p className="text-sm text-center">
        <Link href="/login" className="underline">
          Mauvaise adresse ? Retour à la connexion
        </Link>
      </p>
    </AuthCard>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={null}>
      <CheckEmail />
    </Suspense>
  );
}
