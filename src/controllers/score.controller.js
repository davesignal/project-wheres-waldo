import Score from '../models/score.model.js';
import { body, validationResult } from 'express-validator/check';
import He from 'he';
import dotenv from 'dotenv';
import { Base64 } from 'js-base64'

dotenv.config();

let ScoreController = {}

// Test command
ScoreController.test = (req, res) => {
  return res.send('ScoreController');
};

// Ensures time is in format suitable for use
ScoreController.validate = (method) => {
  switch (method) {
    case 'addScore':
      return [
        body('name').trim().escape(),
        body('time', 'Time must be numeric (in seconds)').isNumeric().trim().escape()
      ]
    case 'updateName':
      return [
        body('name').trim().escape(),
      ]
  }
};

// Authenticate
ScoreController.authenticate = (req, res, next) => {
  let authentication = `Basic ${Base64.encode(process.env.API_KEY)}`;
  try {
    if(req.headers.authorization === authentication){
      next();
    } else {
      res.status(511).json({ errors: "Valid API Key required" });
    }
  } catch (e) {
    res.send(e)
  }
}

// Create
ScoreController.addScore = (req, res, next) => {
  const name = req.body.name;
  const time = req.body.time;
  let score = new Score(
    {
      name: name || 'anonymous',
      time: time
    }
  );
  const errors = validationResult(req);

  score.save(function (err) {
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    if (err) return next(err);
    res.send(score);
  })
};

// Read
ScoreController.getScore = (req, res, next) => {
  Score.findById(req.params.id, (err, score) => {
    if (err) return next(err);
    res.send(score);
  })
}

// Read (all)
ScoreController.getAllScores = (req, res, next) => {
  Score.find({}, (err, scores) => {
    if (err) return next(err);
    scores.forEach(score => {
      score.name = He.decode(score.name);
    })
    res.send(scores);
  })
};

// Update
ScoreController.updateName = (req, res, next) => {
  Score.findById(req.params.id, (err, score) => {
    if (err) return next(err);
    score.name = req.body.name;
    const errors = validationResult(req);

    score.save(function (err) {
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
      if (err) return next(err);
      res.send(score);
    })
  })
}

export default ScoreController;