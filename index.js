const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

// Verfügbarkeits-Route
app.get("/health", (_req, res) => res.json({ ok: true }));

// Meldung speichern
app.post("/add-message", (req, res) => {
    const { title, id, problemType, description } = req.body;

    // check für ungültige eingaben
    if (!title || !id || !problemType) {
        return res.status(400).json({ error: "Titel, ID und Art des Problems sind erforderlich." });
    }

    const message = {
        title,
        id,
        problemType,
        description: description || "", // Beschreibung ist optional
        timestamp: new Date().toISOString()
    };

    // Vorher lesen
    fs.readFile("messages.json", "utf8", (err, data) => {
        let messages = [];
        
        if (!err && data) {
            try {
                messages = JSON.parse(data);
            } catch (parseError) {
                console.error("Fehler beim Parsen der Datei:", parseError);
            }
        }

        // meldung hinzufügen
        messages.push(message);

        // zurück schreiben
        fs.writeFile("messages.json", JSON.stringify(messages, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: "Fehler beim Speichern der Meldung." });
            }
            res.status(200).json({ success: "Meldung erfolgreich gespeichert!" });
        });
    });
});

app.listen(8000, () => console.log("Server läuft auf http://localhost:8000"));

