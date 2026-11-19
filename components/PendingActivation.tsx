"use client";
import { useState } from "react";
import { useAccount } from "@/contexts/account.context";
import { useSignOut } from "@/hooks/useSignOut";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

/** Shown instead of the app while an administrator has not activated the account yet. */
export default function PendingActivation() {
  const { me, refresh, status } = useAccount();
  const signOut = useSignOut();
  const [checking, setChecking] = useState(false);
  const [checkedOnce, setCheckedOnce] = useState(false);

  const recheck = async () => {
    setChecking(true);
    await refresh();
    setChecking(false);
    setCheckedOnce(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-card text-card-foreground rounded-2xl shadow-xl p-8 flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-bold">Votre compte est créé</h1>
        <p>
          Votre adresse email{me?.email ? <> (<strong>{me.email}</strong>)</> : null} est bien
          vérifiée. L&apos;accès aux fonctionnalités d&apos;Omnicity est activé par un
          administrateur, dans le cadre du contrat conclu avec votre entreprise.
        </p>
        <p>
          Pour activer votre accès, contactez votre interlocuteur Omnicity
          {CONTACT_EMAIL ? (
            <>
              {" "}ou écrivez-nous à{" "}
              <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </>
          ) : null}
          .
        </p>
        {checkedOnce && status === "pending" && (
          <p className="text-sm text-muted-foreground">
            Votre compte n&apos;est pas encore activé. Réessayez dans quelques instants.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-2">
          <button
            onClick={recheck}
            disabled={checking}
            className="bg-[#AF80FF] rounded-md px-4 py-2 text-white hover:bg-[#6a5dd5] transition-colors disabled:opacity-60"
          >
            {checking ? "Vérification..." : "Vérifier à nouveau"}
          </button>
          <button
            onClick={signOut}
            className="border border-foreground/20 rounded-md px-4 py-2 hover:bg-foreground/5 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
