import Link from "next/link";
import AuthCard, { primaryButtonClass, secondaryButtonClass } from "@/components/AuthCard";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const isRecovery = searchParams?.type === "recovery";

  return (
    <AuthCard title="Ce lien n'est plus valable">
      <p className="text-center">
        Le lien reçu par email a expiré ou a déjà été utilisé. Ce n&apos;est pas grave : vous
        pouvez en demander un nouveau en quelques secondes.
      </p>
      <Link href={isRecovery ? "/forgot-password" : "/login"} className={primaryButtonClass}>
        {isRecovery ? "Demander un nouveau lien" : "Retour à la connexion"}
      </Link>
      {!isRecovery && (
        <p className="text-sm text-center text-foreground/70">
          Si vous venez de créer votre compte, connectez-vous : nous vous proposerons de renvoyer
          l&apos;email de confirmation.
        </p>
      )}
      {isRecovery && (
        <Link href="/login" className={secondaryButtonClass}>
          Retour à la connexion
        </Link>
      )}
    </AuthCard>
  );
}
