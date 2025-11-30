exports.createMatch = (req, res) => {
  res.json({ message: "Match created" });
};

exports.getMatches = (req, res) => {
  res.json({ message: "List of matches" });
};

exports.updateMatch = (req, res) => {
  res.json({ message: "Match updated" });
};

exports.deleteMatch = (req, res) => {
  res.json({ message: "Match deleted" });
};
