const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Onnx asset registration
config.resolver.assetExts.push('onnx');

module.exports = config;