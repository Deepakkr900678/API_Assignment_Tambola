const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

const ticketSchema = new Schema({
    _id: { type: String, default: shortid.generate },
    ticket: [[Number]],
})

const ticketModel = mongoose.model("Ticket", ticketSchema);
module.exports = ticketModel;