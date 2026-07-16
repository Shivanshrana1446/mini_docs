exports.importFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    const normalized = fileContent
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');

    res.json({
      fileName: req.file.originalname,
      content: normalized
    });
  } catch (error) {
    next(error);
  }
};
