import * as intervals from '../db/intervals';

export function create({ body, user }, res) {
  intervals.create(Object.assign({}, body, { user: user._id }))
    .then((interval) => res.status(201).json(interval))
    .catch((err) => res.status(500).json(err));
}

export function update({ body, params, user }, res) {
  const { id } = params;
  intervals.update({ id, user: user._id }, body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json(err));
}

export function findAll({ user }, res) {
  intervals.find({ user: user._id })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err));
}

export function remove({ params }, res) {
  const { id } = params;
  intervals.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).json(err));
}

export default {
  create,
  update,
  findAll,
  remove
};
