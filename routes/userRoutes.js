const express = require('express');
const { registerUser, loginUser, getUserLinks, addLink, updateLink, deleteLink } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:uniqueKey/links', getUserLinks);
router.post('/:uniqueKey/links', addLink);
router.put('/:uniqueKey/links/:linkId', updateLink);
router.delete('/:uniqueKey/links/:linkId', deleteLink);

module.exports = router;
