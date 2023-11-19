export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = "";
  const bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b: any) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};