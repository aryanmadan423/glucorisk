# Glucorisk

A mobile app that estimates Type 2 diabetes and prediabetes risk from twelve
health questions. Made for the Congressional App Challenge.

The model runs on your phone using ONNX Runtime, so you don't need an
internet connection to get a result and nothing leaves the device. Two of
the buttons (finding a program, finding care nearby) do open external
links and need a connection, but the actual risk check doesn't.

## What it does

- 12 questions: general health, age, sex, BMI, exercise, blood pressure/cholesterol history, smoking, mobility, cardiovascular history
- Runs those answers through a model trained on real CDC BRFSS survey data (259,829 people in the training set)
- Shows a calibrated risk percentage plus personalized, cited advice based on which risk factors actually apply to you

## Running locally

Needs Node.js, and Xcode if you're building for iOS.

npm install
npx expo prebuild
npx expo run:ios


(`npx expo run:android` for Android)

This app can't run in Expo Go since it uses a native ML module. You need the custom dev build from the commands above.

## Where to find it

[Link to App Store listing, once it's live, placeholder]

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

None. No API keys, no backend, no `.env`.

## Limitations

- Only screens for Type 2 diabetes and prediabetes, not Type 1
- This is a risk estimate, not a diagnosis
- The personalized advice is based on which risk factors show up in your answers, not a live per-person model recalculation
- Finding a program and finding care nearby both need internet; the risk check itself doesn't

## Disclaimer

This isn't a replacement for real medical advice. Talk to a doctor about your result either way.