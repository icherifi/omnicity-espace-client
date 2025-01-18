"use client";
import * as React from "react";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import MainHeader from "@/components/MainHeader";
import MainComponent from "@/app/home/MainComponent";
import { ComponentsMap } from "@/types/dashboard.types";
import Plan from "@/components/scans/Plan";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ProjectsPage from "@/components/projects/Projects";
import FormPage from "@/components/proto-form/formPage";

const componentsMap: ComponentsMap = {
  main: <MainComponent />,
  import: (
    <div>
      <Plan />
    </div>
  ),
  form: <FormPage />,
  projects: (
    <div>
      <ProjectsPage />
    </div>
  ),
};

export default function Dashboard() {
  const [loading, setLoading] = React.useState(true);
  const [content, setContent] =
    React.useState<keyof typeof componentsMap>("main");
  const renderContent = () => {
    return componentsMap[content] || <div>Dashboard Content</div>;
  };
  const router = useRouter();

  React.useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await createClient().auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center mt-16">
        <Progress value={progress} className="w-[60%]" />
      </div>
    ); // Show a loading state while checking authentication
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="sticky top-0">
        <Navbar content={content} setContent={setContent} />
      </div>
      <div className="flex flex-col">
        <div className="sticky top-0 z-10">
          <MainHeader />
        </div>
        <div className="flex-1 overflow-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
