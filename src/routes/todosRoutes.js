const express = require('express');
const todosController = require('../controllers/todosController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, todosController.listTodos);
router.post('/', authMiddleware, todosController.createTodo);
router.get('/:id', authMiddleware, todosController.getTodo);
router.put('/:id', authMiddleware, todosController.updateTodo);
router.delete('/:id', authMiddleware, todosController.deleteTodo);

module.exports = router;

