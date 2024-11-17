const mongoose = require('mongoose');

const booksSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  
  // Définition des avis (ratings) pour chaque livre
  ratings: [
    {
      userId: { default:[], type: String, required: true }, 
      grade: {default:0, type: Number, required: true }    // grade = note donnée par un utilisateur
    }
  ],
  
  // Moyenne des notes
  averageRating: { type: Number, default: 0, required: true }
});

module.exports = mongoose.model('Books', booksSchema);
