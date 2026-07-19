const { Settings } = require('../models');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findAll();
    res.json({
      success: true,
      message: 'Settings retrieved successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.createSettings = async (req, res) => {
  try {
    const settings = await Settings.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Settings created successfully',
      data: settings
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating settings', error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findByPk(req.params.id);
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Settings not found' });
    }
    await settings.update(req.body);
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating settings', error: error.message });
  }
};
