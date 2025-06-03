const clientId = import.meta.env.VITE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const authUri = import.meta.env.VITE_AUTH_URI;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

const oauth2 = {
  clientId,
  redirectUri,
  authUri,
  clientSecret: clientSecret,
};

export default oauth2;
