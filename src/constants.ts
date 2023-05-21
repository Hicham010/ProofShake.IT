const baseUrlpriv = window.location.origin;

export const basePath = "/ProofShake.IT";

export const baseUrl = `${baseUrlpriv}${basePath}/#`;

export const messageToSign = `Welcome to ProofShake.IT\n\nSign this message to verify your ownership.\n\n${new Date().toDateString()}`;
