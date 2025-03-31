import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/matrices_db");

const MatrizSchema = new mongoose.Schema({
    matriz1: [[Number]],
    matriz2: [[Number]],
    resultado: [[Number]]
});
const Matriz = mongoose.model("Matriz", MatrizSchema);

app.post("/sumar", async (req, res) => {
    const { matriz1, matriz2 } = req.body;
    if (!matriz1 || !matriz2) {
        return res.status(400).json({ error: "Matrices no proporcionadas" });
    }
    const resultado = matriz1.map((fila, i) => fila.map((num, j) => num + matriz2[i][j]));
    const nuevaMatriz = new Matriz({ matriz1, matriz2, resultado });
    await nuevaMatriz.save();
    res.json({ resultado });
});

app.get("/matrices", async (req, res) => {
    const matrices = await Matriz.find({}, { _id: 0 });
    res.json(matrices);
});

app.listen(3000, () => {
    console.log("Servidor en puerto 3000");
});
