const Joi = require('joi');

const messageSchema = Joi.object({
  category: Joi.string().valid(
    "movie-script", 
    "recipe", 
    "short-story", 
    "speech", 
    "biography", 
    "song-lyrics", 
    "poetry", 
    "news-article", 
    "book-review", 
    "tutorial", 
    "travel-guide", 
    "personal-letter", 
    "resume", 
    "cover-letter", 
    "business-proposal", 
    "research-paper", 
    "lesson-plan", 
    "press-release", 
    "interview", 
    "product-description"
  ).required()
});

module.exports = {
  messageSchema
};