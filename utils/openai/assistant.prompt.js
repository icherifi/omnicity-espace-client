export const dpeSummaryPrompt = (dpeData) => `
Please provide a summary of the following DPE information:

${JSON.stringify(dpeData, null, 2)}
`;
