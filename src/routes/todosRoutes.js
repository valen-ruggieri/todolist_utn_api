const express = require('express');
const todosController = require('../controllers/todosController');
const authMiddleware = require('../middlewares/auth');
const { createTodoValidator, idParamValidator } = require('../validators/todoValidators');
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/', authMiddleware, todosController.listTodos);
router.post('/', authMiddleware, createTodoValidator, validate, todosController.createTodo);
router.get('/:id', authMiddleware, idParamValidator, validate, todosController.getTodo);
router.put('/:id', authMiddleware, idParamValidator, validate, todosController.updateTodo);
router.delete('/:id', authMiddleware, idParamValidator, validate, todosController.deleteTodo);

module.exports = router;

