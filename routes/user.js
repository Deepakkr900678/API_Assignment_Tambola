const express = require("express")
const router = express.Router();
const bodyParser = require('body-parser')
router.use(bodyParser.json())

const User = require("../models/users")
const Ticket = require("../models/tickets")

// Generate a single Tambola ticket
function generateTicket() {
    const ticket = [];

    // Generate an array of numbers from 1 to 90
    const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

    // Generate columns
    const columns = [];
    for (let i = 0; i < 9; i++) {
        const column = [];

        // Generate numbers for the column
        for (let j = 0; j < 3; j++) {
            if (numbers.length === 0) break; // All numbers used

            // Get a random index from the remaining numbers and remove it from the array
            const randomIndex = Math.floor(Math.random() * numbers.length);
            const number = numbers.splice(randomIndex, 1)[0];
            column.push(number);
        }

        // Sort numbers in ascending order
        column.sort((a, b) => a - b);
        columns.push(column);
    }

    // Generate rows using the columns
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            row.push(columns[j][i] || 0); // Fill blank cells with zero
        }
        ticket.push(row);
    }

    return ticket;
}

// API endpoint for creating a Tambola ticket
router.post('/tickets', async (req, res) => {
    try {
        const ticket = generateTicket();

        // Save the ticket to the database
        const newTicket = new Ticket({ ticket });
        await newTicket.save();

        res.json({ id: newTicket._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all tickets
router.get('/tickets', async (req, res) => {
    try {
        const allTickets = await Ticket.find();
        res.json(allTickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get tickets associated with a specific ID with pagination
router.get('/tickets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const tickets = await Ticket.find({ userId: id }).skip(startIndex).limit(limit);
        const totalCount = await Ticket.countDocuments({ userId: id });

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit)
        };

        res.json({ tickets, pagination });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("*", (req, res) => {
    res.status(404).json({
        status: "Failed",
        message: "Invalid Request"
    });
})

module.exports = router;







