// utils/getSubdomain.js
export const getSubdomain = () => {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (host.includes('localhost')) return parts[0]; 
  return parts.length > 2 ? parts[0] : null;
};
