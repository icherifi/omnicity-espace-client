"use server";
export async function handleSubmit(responses: any) {
  const isResponsesEmpty = Object.keys(responses).length === 0;
  let requestBody;

  if (isResponsesEmpty) {
    const defaultQuestions = require("./default-questions.json");
    requestBody = JSON.stringify(defaultQuestions);
  } else {
    requestBody = JSON.stringify(responses);
  }

  try {
    const response = await fetch(
      "https://api.irenov.izi-by-edf.fr/api/session",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain",
          "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          Referer: "https://www.izi-by-edf-renov.fr/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: requestBody,
      }
    );

    const data = await response.json();
    return data; // Return the fetched data
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error to handle it in the component
  }
}
