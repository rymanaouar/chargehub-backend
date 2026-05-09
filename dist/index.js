"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ==================== STATIONS ====================
// GET toutes les stations
app.get('/api/stations', async (req, res) => {
    try {
        const stations = await prisma.chargingStation.findMany();
        res.json(stations);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// GET une station par ID
app.get('/api/stations/:id', async (req, res) => {
    try {
        const station = await prisma.chargingStation.findUnique({
            where: { id: req.params.id }
        });
        if (!station)
            return res.status(404).json({ error: 'Station introuvable' });
        res.json(station);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// POST créer une station
app.post('/api/stations', async (req, res) => {
    try {
        const station = await prisma.chargingStation.create({
            data: req.body
        });
        res.status(201).json(station);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// PUT modifier une station
app.put('/api/stations/:id', async (req, res) => {
    try {
        const station = await prisma.chargingStation.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(station);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// DELETE supprimer une station
app.delete('/api/stations/:id', async (req, res) => {
    try {
        await prisma.chargingStation.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Station supprimée' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// ==================== BOOKINGS ====================
// GET tous les bookings d'un utilisateur
app.get('/api/bookings/:userId', async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.params.userId },
            include: { station: true }
        });
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// POST créer un booking
app.post('/api/bookings', async (req, res) => {
    try {
        const booking = await prisma.booking.create({
            data: req.body,
            include: { station: true }
        });
        res.status(201).json(booking);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// PUT modifier statut booking
app.put('/api/bookings/:id', async (req, res) => {
    try {
        const booking = await prisma.booking.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// ==================== USERS ====================
// POST créer/sync utilisateur depuis Keycloak
app.post('/api/users', async (req, res) => {
    try {
        const { keycloakId, email, username, role } = req.body;
        const user = await prisma.user.upsert({
            where: { keycloakId },
            update: { email, username, role },
            create: { keycloakId, email, username, role }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// ==================== SESSIONS ====================
// GET sessions d'un utilisateur
app.get('/api/sessions/:userId', async (req, res) => {
    try {
        const sessions = await prisma.session.findMany({
            where: { userId: req.params.userId },
            orderBy: { createdAt: 'desc' },
            include: { station: true }
        });
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// POST créer une session
app.post('/api/sessions', async (req, res) => {
    try {
        const session = await prisma.session.create({
            data: req.body
        });
        res.status(201).json(session);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Charge Hub API fonctionne !' });
});
// Démarrer le serveur
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
