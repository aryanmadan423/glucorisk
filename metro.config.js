const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Bundle the ONNX file as an app asset.
config.resolver.assetExts.push('onnx');

module.exports = config;