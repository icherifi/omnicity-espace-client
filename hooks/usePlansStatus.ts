import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * Hook personnalisé pour vérifier la présence de plans dans un projet
 */
export function usePlansStatus(projectId: string | null) {
  const [hasPlans, setHasPlans] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    const checkPlans = async () => {
      if (!projectId) {
        setHasPlans(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const folder = `plans-${projectId}`;
        const { data, error } = await supabase.storage.from("documents").list(folder);
        
        if (error) {
          console.error("Erreur lors de la vérification des plans:", error);
          setHasPlans(false);
        } else {
          setHasPlans(!!(data && data.length > 0));
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des plans:", error);
        setHasPlans(false);
      } finally {
        setLoading(false);
      }
    };

    checkPlans();
  }, [projectId]);

  return { hasPlans, loading };
} 