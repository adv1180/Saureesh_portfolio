export const decryptFile = async (url: string, password: string) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  
  const iv = buffer.slice(0, 16);
  const encryptedData = buffer.slice(16);
  
  const encoder = new TextEncoder();
  const keyHash = await crypto.subtle.digest("SHA-256", encoder.encode(password));
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyHash,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: new Uint8Array(iv) },
    cryptoKey,
    encryptedData
  );
  
  return decryptedData;
};
