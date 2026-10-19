# Glucorisk

Glucorisk is a mobile app that helps people review their diabetes and prediabetes risk using a short health questionnaire and a trained machine learning model.

The goal is to give people a simple way to check their risk factors and find useful prevention resources. The model runs on the phone. Once a standalone build is installed, the questionnaire and results work without an internet connection.

## Using the app

Answer 13 questions about your health, age, height, weight, activity, and medical history. The result displays a testing recommendation ("Diabetes testing recommended" or "Below screening cutoff") and a calibrated risk score. The app also provides recommendations based on your answers. You can share your result and open links to prevention programs.

Height and weight are combined into BMI, giving the model 12 inputs. The recommendations use rules based on your answers; they are separate from the model's prediction.

## The model

I trained the model in Python using the [2023 CDC BRFSS survey](https://www.cdc.gov/brfss/annual_data/annual_2023.html). After cleaning, there were 324,787 responses. I split them into 259,829 for training, 32,479 for validation, and 32,479 for testing.

I compared ten classifiers and selected gradient boosting because it had the highest validation ROC-AUC. I calibrated its probabilities using a fitted sigmoid function and selected the highest cutoff that achieved validation sensitivity above 96%. The cutoff is approximately 4.73%; the code retains its full precision.

The training label combines self-reported diabetes and prediabetes in adults. It does not separate diabetes types or track future diagnoses. The app gives a screening estimate, not a diagnosis.

## Performance

These results come from the test-set output in the training notebook. On 32,479 held-out responses, the model identified 95.8% of reported diabetes and prediabetes cases. Of the responses it flagged, 23.7% were positive.

Published results for the American Diabetes Association (ADA) diabetes risk calculator are also shown in the table.

| Metric | Glucorisk test set | Published ADA risk-score results |
| --- | ---: | ---: |
| ROC-AUC | 0.796 | 0.78–0.83 |
| Positive predictive value (PPV) | 23.7% | About 10% |
| Sensitivity | 95.8% | 72–79% |

The ADA figures are from this [review in MDCalc Journal](https://mdcalc.scholasticahq.com/article/159088-updated-review-of-the-american-diabetes-association-ada-risk-calculator). They measure undiagnosed diabetes in different populations, while Glucorisk uses self-reported diabetes or prediabetes. This comparison places Glucorisk’s test results in context alongside an established screening tool, but does not establish superiority over the ADA tool.

## Privacy

The app has no backend or account system. Answers stay in app memory and are not uploaded or saved as a history. Sharing sends the result to an app you choose. Resource links open external websites and need internet access.

## Run the app

The app uses JavaScript, React Native, Expo, and ONNX Runtime. You need Node.js, npm, and the Android or iOS development tools. iOS builds require macOS and Xcode.

Install dependencies:

```sh
npm ci
```

Then choose one platform.

For Android:

```sh
npm run android
```

For iOS:

```sh
npm run ios
```

ONNX Runtime needs a native build, so the app cannot run in Expo Go. Browser inference is not supported. For development after the native build, run `npm start`. For offline use, install a build that includes its JavaScript bundle.

Run the input and encoding tests with `npm test`.

## Files

- `App.js`: screen navigation.
- `src/screens/`: questionnaire, results, recommendations, resources, and app information.
- `src/constants.js`: questions, feature encoding, calibration, and recommendation rules.
- `src/lib/runModel.js`: loads the model and runs predictions.
- `assets/model/diabetes_risk_model.onnx`: the trained scaler and classifier.
- `model-training/diabetes_risk_prediction_notebook.ipynb`: training, evaluation, and model export.
