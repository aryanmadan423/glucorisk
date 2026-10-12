# Glucorisk

**An offline mobile screening prototype that uses everyday health information to produce a diabetes/prediabetes screening estimate and personalized educational recommendations.**

Created by Aryan Madan for the Congressional App Challenge.

## What the app does

- Guides adults through 13 questions covering 12 model inputs; height and weight are combined into BMI.
- Runs a bundled machine-learning model directly on the phone using ONNX Runtime.
- Shows a calibrated score and whether it exceeds the app's elevated-score threshold.
- Provides rule-based recommendations tailored to answers, with links to educational sources and prevention programs.
- Lets users voluntarily share a text summary through their phone's share menu.

Risk inference requires no backend, account, API key, or internet connection in an installed native build. Answers are held in app memory, not sent to a prediction server. Sharing sends the chosen text to another app; external resource links require internet and use external services. The app does not save a history of results.

## How it works

1. The questionnaire collects answers, accepting imperial or metric height and weight.
2. `src/constants.js` encodes those answers in the same order as the training features. Age becomes a BRFSS age category and BMI is encoded as BMI × 100.
3. `assets/model/diabetes_risk_model.onnx` applies the fitted standard scaler and gradient-boosting classifier.
4. `src/lib/runModel.js` extracts the positive-class probability; JavaScript applies the validation-fitted sigmoid calibration.
5. Scores of at least **0.115 (11.5%)**, before display rounding, receive the elevated-score message. This threshold was chosen on validation data to achieve at least 30% PPV, not to define a clinical diagnosis.
6. Recommendation rules use answers such as physical inactivity and elevated BMI. The app does not run SHAP or generate individualized model attribution on the phone.

## Model and recorded evaluation

The included Colab notebook uses the [2023 CDC Behavioral Risk Factor Surveillance System (BRFSS)](https://www.cdc.gov/brfss/annual_data/annual_2023.html).

| Stage | Respondents |
| --- | ---: |
| Original dataset | 433,323 |
| Retained after the notebook's cleaning | 324,787 |
| Training | 259,829 |
| Validation | 32,479 |
| Test | 32,479 |

The random 80/10/10 split is stratified by the label, with seed 42. The notebook compares ten classifier families using validation ROC-AUC and selects **GradientBoostingClassifier**. The scaler is fitted on training data; balanced class weights are used where supported. Calibration and threshold selection use validation data. The stored test-set results are:

| Metric | Recorded result |
| --- | ---: |
| ROC-AUC | 0.796 |
| Positive predictive value (precision) | 0.303 |
| Sensitivity (recall) | 0.851 |
| Accuracy | 0.630 |
| True negatives / false positives | 15,617 / 11,155 |
| False negatives / true positives | 852 / 4,855 |

These are recorded notebook outputs, not independently reproduced from the original survey during this repository review. The test set is an internal holdout from the same survey dataset, not an external clinical validation cohort.

### What the training label means

The target comes from `DIABETE4`: responses reporting diabetes (`1`) or prediabetes/borderline diabetes (`4`) form the positive class; a response of no (`3`) forms the negative class. Gestational-only diabetes and unknown/refused responses are excluded.

**This label does not distinguish type 1 from type 2 diabetes. It also does not confirm undiagnosed disease or measure future diabetes onset.** A score reflects the model's patterns for this self-reported combined outcome. It should not be presented as a validated probability of future type 2 diabetes.

### ADA comparison

[Bang et al. (2009)](https://pubmed.ncbi.nlm.nih.gov/19949143/) reported approximately 10% PPV for a diabetes risk score measuring **undiagnosed diabetes**, using laboratory-defined outcomes in people without known diabetes. The app links to a [2026 MDCalc review](https://mdcalc.scholasticahq.com/article/159088-updated-review-of-the-american-diabetes-association-ada-risk-calculator) that summarizes those findings.

Glucorisk's recorded 30.3% PPV is numerically about three times 10%, but the populations, prevalence, and outcomes differ. **This is not a head-to-head comparison and does not establish threefold superiority.** An appropriate comparison would evaluate both tools against the same outcome in the same independent population at clearly specified thresholds.

### Limitations

- Self-reported diagnoses are not laboratory-confirmed; undiagnosed people can be labeled negative.
- Known diabetes and prediabetes are included in the positive class, unlike an undiagnosed-disease screening cohort.
- The notebook uses balanced class weights, not BRFSS population survey weights; calibration is specific to the retained survey sample.
- The current cleaning checks do not exclude the BRFSS age unknown/refused category (`_AGEG5YR = 14`). Removing it requires retraining and replacing the model, calibration, and reported metrics together.
- Borderline high blood pressure (`BPHIGH6 = 4`) is combined with diagnosed high blood pressure during training; the questionnaire explicitly includes both.
- There is no external clinical validation or subgroup performance evaluation in this repository.
- Calibration improves agreement in the validation sample; it does not guarantee accurate probabilities for every user or population.

This is an educational screening prototype, not a diagnostic medical device. A low score does not rule out diabetes or override clinician-recommended screening.

## Run the mobile app

Prerequisites: a supported Node.js release for the pinned Expo SDK, npm, and the Android or iOS native toolchain. iOS builds require macOS with Xcode; Android builds require Android Studio/SDK and a device or emulator.

```sh
npm ci
npm run android
# On macOS with Xcode:
npm run ios
```

`onnxruntime-react-native` requires a custom native build; **Expo Go is not sufficient**. Once installed, the model can run offline. A development build may still need Metro for its JavaScript bundle; demonstrate offline behavior using an installed build with its bundle included.

The `web` script is inherited from the Expo project, but browser inference is not implemented: this app uses the native ONNX runtime.

For development after building the native app:

```sh
npm start
```

Run the input/encoding regression checks:

```sh
npm test
```

## Reproduce the training workflow

Open `model-training/diabetes_risk_prediction_notebook.ipynb` in Google Colab, download and extract `LLCP2023.XPT` from CDC, and update `xpt_path` to its location in your Google Drive. Run the notebook in order. The raw survey dataset is not included in the repository.

The notebook exports the scaler and model as an ONNX pipeline and checks its predictions against scikit-learn on five rows. If retraining, update the ONNX asset, JavaScript calibration constants, threshold, and recorded metrics together. The Python training dependencies are not version-pinned, so a new environment may produce different results.

## Code map

| File | Role |
| --- | --- |
| `App.js` | Navigation between seven app screens |
| `src/screens/WelcomeScreen.js` | Introduction and start button |
| `src/screens/QuestionnaireScreen.js` | Question flow, input validation, and units |
| `src/constants.js` | Questions, encoding, calibration, threshold, and recommendation rules |
| `src/lib/runModel.js` | Load the bundled model and run inference |
| `src/screens/ResultsScreen.js` | Score, next steps, and voluntary sharing |
| `src/screens/PersonalizedScreen.js` | Recommendations selected from answers |
| `src/screens/ResourcesScreen.js` | Educational information and external resources |
| `src/screens/AboutScreen.js` | Model overview, privacy, and limitations |
| `src/screens/MetricComparisonScreen.js` | Recorded results and contextual ADA comparison |
| `model-training/diabetes_risk_prediction_notebook.ipynb` | Python data preparation, model selection, evaluation, SHAP, and export |
| `metro.config.js` | Registers `.onnx` as a bundled asset |

## Submission demonstration

Show the questionnaire, result, recommendations, and resources. Explain that the app uses JavaScript, React Native, Expo, and ONNX Runtime, while Python/scikit-learn were used for model training. Demonstrate offline inference in an installed native build. Refer to PPV as internal test-set performance and identify the ADA figures as results from separate studies.
