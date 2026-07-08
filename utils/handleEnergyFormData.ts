// import { getToken } from "./supabase/client";

// export async function createSession() {
//     const token = await getToken();
//     if (!token) {
//         console.error("You are not authenticated");
//         return null;
//     }

//     const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/energy/form/session`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!resp.ok) throw new Error(`Erreur création session: ${resp.status}`);
//     return resp.json();
// }

// export async function sendStepAnswer(stepId: string, answer: any, sessionId: string) {
//     const token = await getToken();
//     if (!token) {
//         console.error("You are not authenticated");
//         return null;
//     }

//     const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/energy/form/step-answer`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ stepId, answer, sessionId }),
//     });

//     if (!resp.ok) throw new Error(`Erreur sendStepAnswer: ${resp.status}`);
//     return resp.json();
// }

// export async function getQuizSummary(sessionId: string) {
//     const token = await getToken();
//     if (!token) {
//         console.error("You are not authenticated");
//         return null;
//     }

//     const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/energy/form/quiz-summary/${sessionId}`, {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     if (!resp.ok) throw new Error(`Erreur getQuizSummary: ${resp.status}`);
//     return resp.json();
// }

// export async function handleQuizResults(responses: any) {
//     const token = await getToken();
//     if (!token) {
//         console.error("You are not authenticated");
//         return null;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/energy/form/quiz-results`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ responses }),
//         }
//       );

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("Error:", error);
//       throw error;
//     }
//   }

// export async function getQrPotentialNextQuestions(stepId: string) {
//   const token = await getToken();
//   if (!token) {
//       console.error("You are not authenticated");
//       return null;
//   }

//   const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/energy/form/qr-potential-next-questions/${stepId}`, {
//       headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//       },
//   });

//   if (!resp.ok) throw new Error(`Erreur getQrPotentialNextQuestions: ${resp.status}`);
//   return resp.json();
// }
