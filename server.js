import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises'; // gebruik fs.promises om asynchroon bestanden te lezen

// Create an Express application
const app = express();

// Get the directory name of the current script
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static')); // Serve static files from the 'public' directory
app.set('view engine', 'ejs');

async function fetchData() {
  try {
    const filePath = path.join(__dirname, 'static/data/data2.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('Failed to read data.json: ' + error.message);
  }
}

// Routes
app.get("/", async (req, res) => {
  try {
    const data = await fetchData(); // Wait for the results of fetchData()
    console.log(data.kleding);
    res.render('pages/index', { kleuren: data.soortenKleuren, kleding: data.kleding});
  } catch (error) {
    console.error('Fetching movies failed:', error);
    res.status(500).send('Failed to fetch movies');
  }
});

app.post("/resultaten", async (req, res) => {
    try {
      const data = await fetchData(); // Wacht op de resultaten van fetchData()
      
      const selectedKleur = req.body.kleur;
      const selectedType = req.body.typeKleding;
      const selectedCategory = req.body.positie;
      
      // Filter de kledingstukken op basis van de gebruiker selectie
      const filteredKleding = data.kleding.filter(item => {
        return item.kleur !== selectedKleur && item.type !== selectedType;
      });
  
      res.render('pages/resultaten', { filteredKleding });
    } catch (error) {
      console.error('Het ophalen van gegevens is mislukt:', error);
      res.status(500).send('Het ophalen van gegevens is mislukt');
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});