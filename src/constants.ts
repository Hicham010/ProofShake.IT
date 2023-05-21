const baseUrlpriv = window.location.origin;

export const basePath = "/ProofShake.IT";

export const baseUrl = `${baseUrlpriv}${basePath}/#`;

export const messageToSign = `Welcome to Proof Shake\n\nHereby you verify your ownership.\n\n${new Date().toDateString()}`;

export const truncateAddress = (address: string) =>
  address.substring(0, 6) +
  "..." +
  address.substring(address?.length - 4, address.length);
