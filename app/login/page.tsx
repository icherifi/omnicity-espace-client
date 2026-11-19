import { ThemeSwitch } from "./components/ThemeSwitch";
import { LoginBackground } from "./components/LoginBackground";
import { AuthForm } from "./components/AuthForm";
import dynamic from "next/dynamic";
const LoginLogo = dynamic(() => import("./components/LoginLogo").then(mod => mod.LoginLogo), { ssr: false });

export default function Login({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return (
    <div className="relative min-h-screen w-full flex justify-center items-center">
      <LoginBackground />
      <div className="flex-col w-full px-8 sm:max-w-md justify-center gap-2 z-10">
        <div className="flex flex-col gap-4 items-center">
          <LoginLogo />
          <AuthForm initialMessage={searchParams?.message} />
        </div>
      </div>
      <ThemeSwitch />
    </div>
  );
}
