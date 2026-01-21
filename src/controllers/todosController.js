const Todo = require('../models/todos');
const { sendSuccess, sendError } = require('../utils/responseHelper');

async function listTodos(req, res) {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, todos, 200);
  } catch (error) {
    return sendError(res, error.message, 500, 'INTERNAL_ERROR');
  }
}

async function createTodo(req, res) {
  try {
    const { title, completed } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return sendError(res, 'El título es requerido', 422, 'MISSING_TITLE');
    }
    const todo = await Todo.create({ title: title.trim(), completed: !!completed, user: req.user._id });
    return sendSuccess(res, todo, 201);
  } catch (error) {
    return sendError(res, error.message, 500, 'INTERNAL_ERROR');
  }
}

async function getTodo(req, res) {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, user: req.user._id });
    if (!todo) return sendError(res, 'Todo no encontrado', 404, 'NOT_FOUND');
    return sendSuccess(res, todo, 200);
  } catch (error) {
    return sendError(res, 'Id inválido', 400, 'INVALID_ID');
  }
}

async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    const updates = {};
    if (req.body.title !== undefined) {
      if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
        return sendError(res, 'Título inválido', 422, 'INVALID_TITLE');
      }
      updates.title = req.body.title.trim();
    }
    if (req.body.completed !== undefined) updates.completed = !!req.body.completed;

    const todo = await Todo.findOneAndUpdate({ _id: id, user: req.user._id }, { $set: updates }, { new: true });
    if (!todo) return sendError(res, 'Todo no encontrado', 404, 'NOT_FOUND');
    return sendSuccess(res, todo, 200);
  } catch (error) {
    return sendError(res, 'Id inválido', 400, 'INVALID_ID');
  }
}

async function deleteTodo(req, res) {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });
    if (!todo) return sendError(res, 'Todo no encontrado', 404, 'NOT_FOUND');
    return sendSuccess(res, todo, 200);
  } catch (error) {
    return sendError(res, 'Id inválido', 400, 'INVALID_ID');
  }
}

module.exports = { listTodos, createTodo, getTodo, updateTodo, deleteTodo };

