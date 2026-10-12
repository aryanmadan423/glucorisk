# Glucorisk

Glucorisk is a mobile app that helps people review their diabetes and prediabetes risk using a short health questionnaire. I built it for the Congressional App Challenge.

The goal is to give people a simple way to check their risk factors and find useful prevention resources. The model runs on the phone, so the questionnaire and result work without an internet connection once the app is installed.

## Using the app

Answer 13 questions about your health, age, height, weight, activity, and medical history. The app calculates a screening score and provides recommendations based on your answers. You can also share your result or open links to prevention programs.

Height and weight are combined into BMI, giving the model 12 inputs. The recommendations use rules based on your answers; they are separate from the model's prediction.

## The model

I trained the model in Python using the [2023 CDC BRFSS survey](https://www.cdc.gov/brfss/annual_data/annual_2023.html). After cleaning, there were 324,787 responses. I split them into 259,829 for training, 32,479 for validation, and 32,479 for testing, using seed 42.

I compared ten classifiers and selected gradient boosting because it had the highest validation AUC. I then calibrated its probabilities and chose the screening cutoff using the validation set. The final cutoff is 11.5%.

The training label combines self-reported diabetes and prediabetes. It does not separate diabetes types or track future diagnoses. The app gives a screening estimate, not a diagnosis.

## Performance

These results come from the test-set output in the training notebook.

| Metric | Glucorisk | Published ADA risk-score results |
| --- | ---: | ---: |
| AUC | 0.796 | 0.78-0.83 |
| Positive predictive value (PPV) | 30.3% | About 10% |
| Sensitivity | 85.1% | 72-79% |

The ADA figures are from the [review linked in the app](https://mdcalc.scholasticahq.com/article/159088-updated-review-of-the-american-diabetes-association-ada-risk-calculator). They measure undiagnosed diabetes in different populations, while Glucorisk uses self-reported diabetes or prediabetes. This comparison does not establish formal superiority over the ADA tool.

## Privacy

The app has no backend or account system. Answers stay in app memory and are not uploaded or saved as a history. Sharing sends the result to an app you choose. Resource links open external websites and need internet access.

## Run the app

The app uses JavaScript, React Native, Expo, and ONNX Runtime. You need Node.js, npm, and the Android or iOS development tools. iOS builds require macOS and Xcode.

```sh
npm ci
npm run android
# For iOS:
npm run ios
```

ONNX Runtime needs a native build, so the app cannot run in Expo Go. Browser inference is not supported. For development after the native build, run `npm start`. To demonstrate offline use, install a build that includes its JavaScript bundle.

Run the input and encoding tests with `npm test`.

## Files

- `App.js`: screen navigation.
- `src/screens/`: questionnaire, results, recommendations, resources, and app information.
- `src/constants.js`: questions, feature encoding, calibration, and recommendation rules.
- `src/lib/runModel.js`: loads the model and runs predictions.
- `assets/model/diabetes_risk_model.onnx`: the trained scaler and classifier.
- `model-training/diabetes_risk_prediction_notebook.ipynb`: training, evaluation, SHAP analysis, and model export.

To run the notebook in Colab, download and extract `LLCP2023.XPT` from CDC and update `xpt_path` to its location in Google Drive. The raw dataset is not included. If the model is retrained, its ONNX file, calibration constants, cutoff, and reported results need to be updated together.
