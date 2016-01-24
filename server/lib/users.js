import users from '../db/users';

export function post(req, res) {
  const { username, password } = req.body;
    users.add({ username, password })
      .then((user) => {
        req.login(user, (err) => {
          if (err) return res.status(500).json(err);
          res.redirect('/');
        });
      })
      .catch((error) => res.status(500).json({ error: error.toString() }));
}

export function get(req, res) {
  if (req.isAuthenticated()) return res.json(req.user);
  res.status(401).json({});
}

export function put(req, res) {
  res.status(200).json({});
}

export default {
  post,
  put,
  get
};
