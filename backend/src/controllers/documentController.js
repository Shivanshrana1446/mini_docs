const Document = require('../models/Document');

exports.listDocuments = async (req, res, next) => {
  try {
    const owned = await Document.find({ owner: req.user._id }).sort({ updatedAt: -1 });
    const shared = await Document.find({ collaborators: req.user._id }).sort({ updatedAt: -1 });
    res.json({ owned, shared });
  } catch (error) {
    next(error);
  }
};

exports.createDocument = async (req, res, next) => {
  try {
    const document = await Document.create({
      title: req.body.title || 'Untitled Document',
      content: req.body.content || '',
      owner: req.user._id
    });
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};

exports.getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const isOwner = document.owner.equals(req.user._id);
    const isCollaborator = document.collaborators.some((id) => id.equals(req.user._id));
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(document);
  } catch (error) {
    next(error);
  }
};

exports.updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (!document.owner.equals(req.user._id) && !document.collaborators.some((id) => id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    document.title = req.body.title ?? document.title;
    document.content = req.body.content ?? document.content;
    await document.save();

    res.json(document);
  } catch (error) {
    next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (!document.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await document.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
