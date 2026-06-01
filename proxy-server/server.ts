import app from "./app.js";
import ENV from "./config/env.js";

// PORT
const HTTP_SERVER_PORT = ENV.HTTP_SERVER_PORT || 3001;

// LISTEN
app.listen(HTTP_SERVER_PORT, () => {
  console.log(`🚀 Serveur prêt sur http://localhost:${HTTP_SERVER_PORT}`);
});
