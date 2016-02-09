'use strict';

const intervals = {
  find() { return Promise.resolve(); }
};

function errorResponse(res, method, status = 500) {
  return (error) => {
    console.log('error in', method, error);
    res.status(status).json(error);
  };
}

function create({ body, user }, res) {
  const newInterval = Object.assign({}, body, { user: user._id });
  delete newInterval.id;
  intervals.create(newInterval)
    .then((interval) => res.status(201).json(interval))
    .catch(errorResponse(res, 'create'));
}

function update({ body, params }, res) {
  const { id } = params;
  delete body._id; // not allowed to mutate
  intervals.update({ id }, body)
    .then((result) => res.status(200).json(result))
    .catch(errorResponse(res, 'update'));
}

function findAll({ user }, res) {
  intervals.find({ user: user._id })
    .then((result) => res.status(200).json(result))
    .catch(errorResponse(res, 'findAll'));
}

function findOne({ params }, res) {
  intervals.findOne({ id: params.id })
    .then((result) => res.status(200).json(result))
    .catch(errorResponse(res, 'findOne'));
}

function remove({ params }, res) {
  const { id } = params;
  intervals.remove(id)
    .then(() => res.status(204).end())
    .catch(errorResponse(res, 'remove'));
}

module.exports = {
  create,
  update,
  findOne,
  findAll,
  remove
};
