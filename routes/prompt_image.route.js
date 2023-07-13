const express = require("express");
const router = express.Router();
const { imageSchema } = require("../utils/image-schema.joi");
const imageController = require("../controllers/image.controller");
const winston = require("winston");

router.post("/generate_prompt_image", async (req, res) => {
  const { error } = imageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { prompt, n, size } = req.body;

  try {
    const imageUrl = await imageController.generateImage(prompt, n, size);
    res.json({ imageUrl });
  } catch (error) {
    winston.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
});

module.exports = router;