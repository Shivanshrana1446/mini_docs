const Document = require('../models/Document');
const User = require('../models/User');

exports.shareDocument = async (req, res, next) => {
  try {
    const { email } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (!document.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the owner can share this document' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (document.owner.equals(user._id)) {
      return res.status(400).json({ message: 'Owner already has access' });
    }

    if (document.collaborators.some((id) => id.equals(user._id))) {
      return res.status(400).json({ message: 'User already has access' });
    }

    document.collaborators.push(user._id);
    await document.save();

    res.json({ message: 'Document shared successfully', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
};

exports.getShares = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id).populate('collaborators', 'name email');
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (!document.owner.equals(req.user._id) && !document.collaborators.some((id) => id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json({ owner: document.owner, collaborators: document.collaborators });
  } catch (error) {
    next(error);
  }
};

exports.unshareDocument = async (req, res, next) => {
  try {
    const { email } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (!document.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the owner can unshare this document' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    document.collaborators = document.collaborators.filter((id) => !id.equals(user._id));
    await document.save();

    res.json({ message: 'Document unshared successfully' });
  } catch (error) {
    next(error);
  }
};
