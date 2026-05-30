const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur Cabrel Décor sur le port ${PORT}`);
});
