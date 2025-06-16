const express = require('express');
const router = express.Router();
const {
  assignChore,
  getChores,
  updateChoreStatus,
  deleteChore
} = require('../controllers/choresController');


router.post('/', assignChore);

router.get('/', getChores);

router.patch('/:id/status', updateChoreStatus);

router.delete('/:id', deleteChore);


module.exports = router;
