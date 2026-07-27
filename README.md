# Glucorisk

A mobile app that estimates Type 2 diabetes and prediabetes risk using machine learning. 

The model runs using ONNX Runtime; no internet connection and nothing leaves the device. 
Two of the buttons (finding a program, finding care nearby) do open external
links and need a connection, but the actual risk prediction does not.

## What it does

- 13 questions: general health, age, sex, BMI (height and weight), exercise, blood pressure/cholesterol history, smoking, mobility, cardiovascular history
- Runs those answers through a model trained on real CDC BRFSS survey data (259,829 people in the training set)
- Shows a calibrated risk percentage plus personalized, cited advice based on which risk factors actually apply to you
- Includes a performance comparison against the standard ADA screening quiz

## Where to find it

[Link to App Store listing, once it's live]

## Project layout

App.js
navigation setup

src/
constants.js questions, feature encoding, calibration, advice content
theme.js colors and spacing
lib/runModel.js loads and runs the on-device model
screens/ one file per screen

assets/model/
the trained ONNX model file


## Environment variables

No API keys, no backend, no `.env`.

## Disclaimer

This is not a replacement for real medical advice. Talk to a doctor about your result either way.
