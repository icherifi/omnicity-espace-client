export const fetchOpenAIMissingQuestions = async (dpeData: any) => {
    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          prompt: `Analyse ces données DPE:\n${JSON.stringify(dpeData)}\n\nQuelles informations manquent pour compléter l'analyse énergétique du logement ? Liste-les sous forme de tableau JSON.`,
          max_tokens: 150,
        }),
      });
  
      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        throw new Error("Réponse vide d'OpenAI");
      }
  
      // Parser la réponse JSON retournée par OpenAI
      return JSON.parse(data.choices[0].text.trim());
    } catch (error) {
      console.error("Erreur lors de l'appel OpenAI:", error);
      return [];
    }
  };

export const simulateAnswer = (question: any) => {
    // Exemple de réponses pré-remplies basées sur le type de question
    const predefinedAnswers: Record<string, any> = {
      "Type de chauffage": "Chaudière gaz à condensation",
      "Isolation des murs": "Isolation intérieure avec laine de verre",
      "Type de fenêtres": "Double vitrage PVC",
      "Présence de panneaux solaires": "Non",
    };
  
    // Si la question existe dans nos réponses prédéfinies, on la retourne
    if (predefinedAnswers[question.label]) {
      return predefinedAnswers[question.label];
    }
  
    // Sinon, on retourne une réponse par défaut
    return "Information non disponible";
  };
  