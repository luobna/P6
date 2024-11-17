const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const  Books = require ('../models/Books')



exports.createBooks = async (req, res, next) => {
  const booksObject = JSON.parse(req.body.book);
  delete booksObject._id;
  delete booksObject._userId;

  try {
    // Chemin de l'image uploadée par Multer
    const originalImagePath = req.file.path;
    // Définir le chemin de l'image optimisée
    const optimizedImagePath = `images/optimized-${req.file.filename}`;

    // Optimiser l'image avec Sharp
    await sharp(originalImagePath)
      .resize({ width: 800 }) // Ajuste la largeur à 800px
      .jpeg({ quality: 80 })  // Compresse l'image avec une qualité de 80%
      .toFile(optimizedImagePath); // Sauvegarde l'image optimisée

    // Supprimer l'image d'origine pour libérer de l'espace
    fs.unlinkSync(originalImagePath);

    // Créer une instance du livre avec le chemin de l'image optimisée
    const books = new Books({
      ...booksObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/${optimizedImagePath}`
    });

    // Sauvegarder le livre dans la base de données
    await books.save();
    res.status(201).json({ message: 'Book saved successfully!' });
  } catch (error) {
    console.error("Détails de l'erreur :", error); 
    res.status(500).json({ error: "Erreur lors de l'optimisation de l'image." });
  }
};



exports.getOneBooks = (req, res, next) => {
  Books.findOne({ _id: req.params.id })
    .then(books => {
    // Renvoie les détails du livre, y compris la moyenne des note
    console.log(books);
    
      return res.status(200).json(books)
    }).catch(error => 
      res.status(404).json({ error }));
};



exports.modifyBooks = (req, res, next) => {
  console.log(req.body)
  const booksObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete booksObject._userId;
  Books.findOne({_id: req.params.id})
      .then((books) => {
          if (books.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Books.updateOne({ _id: req.params.id}, { ...booksObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Book modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};


  

exports.deleteBooks = (req, res, next) => {
  
  Books.findOne({ _id: req.params.id})
  
      .then(books => {
          if (books.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = books.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Books.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};
  

  exports.getAllBooks = (req, res, next) => {
    Books.find()
    .then((books) => { 
      // Renvoie tous les livres, y compris la moyenne des notes
      res.status(200).json(books);
      })
    .catch((error) => {
      res.status(400).json({error: error});
      });
  };


  exports.getbestratingBooks = (req, res, next) => {
    Books.find()
    .then((books) => { 
      console.log((books));
      books.sort((a,b)=>((b.averageRating - a.averageRating)))
      console.log((books));
      
       // Trier par rating en ordre décroissant
        res.status(200).json(books);
    })
    .catch(
      (error) => {res.status(400).json({error: error});
    });
  };
  


  exports.ratingBooks = async (req, res, next) => {
    try {
      const userId = req.auth.userId;
      const { rating } = req.body;
  
      if (typeof rating !== "number" || rating < 0 || rating > 5) {
        return res
          .status(400)
          .json({ error: "La note doit être un nombre entre 0 et 5." });
      }
  
      const book = await Books.findOne({ _id: req.params.id });
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé." });
      }
  
      const existingRating = book.ratings.find((r) => r.userId === userId);
      if (existingRating) {
        return res.status(400).json({ error: "Vous avez déjà noté ce livre." });
      }
      
      book.ratings = [...book.ratings, {userId, grade: rating }]
      
  
      // Calcule la nouvelle moyenne
      const totalRatings = book.ratings.reduce((sum, rate) => sum + rate.grade, 0);
      book.averageRating = totalRatings / book.ratings.length;

      // throw("stop here")
      await book.save();
  
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ error });
    }
};
  