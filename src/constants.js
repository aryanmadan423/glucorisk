// Calibration values fitted on the validation set.
export const CALIBRATION_A = -4.842513;
export const CALIBRATION_B = 3.995174;

export function calibrateProbability(rawProbability) {
  return 1 / (1 + Math.exp(CALIBRATION_A * rawProbability + CALIBRATION_B));
}

// Cutoff selected on the validation set for at least 30% PPV.
export const RECOMMENDED_THRESHOLD = 0.115;

export const FEATURE_LABELS = {
  GENHLTH: "your general health",
  _AGEG5YR: "your age",
  SEXVAR: "your sex",
  _BMI5: "your BMI",
  EXERANY2: "your physical activity",
  high_bp: "high blood pressure history",
  high_chol: "high cholesterol history",
  SMOKE100: "smoking history",
  diff_walk: "difficulty walking",
  stroke_history: "stroke history",
  angina_chd_history: "heart disease history",
  heart_attack_history: "heart attack history",
};

// Reject blank or invalid numbers before building the model input.
export function isValidNumericAnswer(id, value) {
  if (value === undefined || value === null || String(value).trim() === "") return false;
  const number = Number(value);
  if (!Number.isFinite(number)) return false;
  if (id === "AGE_YEARS") return Number.isInteger(number) && number >= 18 && number <= 99;
  return number > 0;
}

export function kgToLbs(kg) {
  return Math.round(Number(kg) / 0.453592 * 10) / 10;
}

export function cmToFeetInches(cm) {
  const totalTenths = Math.round(Number(cm) / 2.54 * 10);
  return { feet: Math.floor(totalTenths / 120), inches: (totalTenths % 120) / 10 };
}

// Use the same five-year age groups as BRFSS; the final group is 80+.
export function ageToAgeGroup(age) {
  const bounds = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
  for (let i = 0; i < bounds.length; i++) {
    if (age < bounds[i]) return i + 1;
  }
  return 13;
}

export function computeBmiTimes100(heightCm, weightKg) {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 100);
}

// Convert feet and inches to centimeters, rounded to one decimal place.
export function feetInchesToCm(feet, inches) {
  const totalInches = Number(feet) * 12 + Number(inches);
  return Math.round(totalInches * 2.54 * 10) / 10;
}

export function lbsToKg(lbs) {
  return Math.round(Number(lbs) * 0.453592 * 10) / 10;
}

export function getBmiValue(answers) {
  const heightM = Number(answers.HEIGHT_CM) / 100;
  return Number(answers.WEIGHT_KG) / (heightM * heightM);
}

// BMI ranges used to choose the weight-related recommendation.
export function getBmiCategory(bmi) {
  if (bmi >= 30) return "obese";
  if (bmi >= 25) return "overweight";
  return "healthy";
}

// Display questions in this order. Height and weight become one BMI input.
export const QUESTIONS = [
  {
    id: "GENHLTH",
    prompt: "How would you rate your general health?",
    type: "choice",
    options: [
      { label: "Excellent", value: 1 },
      { label: "Very good", value: 2 },
      { label: "Good", value: 3 },
      { label: "Fair", value: 4 },
      { label: "Poor", value: 5 },
    ],
  },
  { id: "AGE_YEARS", prompt: "What is your age?", type: "number", placeholder: "e.g. 45" },
  {
    id: "SEXVAR",
    prompt: "What is your sex?",
    type: "choice",
    options: [{ label: "Male", value: 1 }, { label: "Female", value: 2 }],
  },
  { id: "HEIGHT_CM", prompt: "What is your height?", type: "height" },
  { id: "WEIGHT_KG", prompt: "What is your weight?", type: "weight" },
  { id: "EXERANY2", prompt: "Have you been physically active in the past 30 days?", type: "yesno" },
  { id: "high_bp", prompt: "Have you ever been told you have high or borderline high blood pressure?", type: "yesno" },
  { id: "high_chol", prompt: "Have you ever been told your cholesterol is high?", type: "yesno" },
  { id: "SMOKE100", prompt: "Have you smoked at least 100 cigarettes in your life?", type: "yesno" },
  { id: "diff_walk", prompt: "Do you have serious difficulty walking or climbing stairs?", type: "yesno" },
  { id: "stroke_history", prompt: "Have you ever been told you had a stroke?", type: "yesno" },
  { id: "angina_chd_history", prompt: "Have you ever been told you have angina or coronary heart disease?", type: "yesno" },
  { id: "heart_attack_history", prompt: "Have you ever been told you had a heart attack?", type: "yesno" },
];

// Keep this order and coding identical to the training notebook.
export function buildFeatureVector(answers) {
  for (const id of ["AGE_YEARS", "HEIGHT_CM", "WEIGHT_KG"]) {
    if (!isValidNumericAnswer(id, answers[id])) throw new Error(`Invalid ${id}`);
  }
  return [
    answers.GENHLTH,
    ageToAgeGroup(Number(answers.AGE_YEARS)),
    answers.SEXVAR,
    computeBmiTimes100(Number(answers.HEIGHT_CM), Number(answers.WEIGHT_KG)),
    answers.EXERANY2 ? 1 : 2,
    answers.high_bp ? 1 : 0,
    answers.high_chol ? 1 : 0,
    answers.SMOKE100 ? 1 : 2,
    answers.diff_walk ? 1 : 0,
    answers.stroke_history ? 1 : 0,
    answers.angina_chd_history ? 1 : 0,
    answers.heart_attack_history ? 1 : 0,
  ];
}

// Factors with a matching recommendation.
const PERSONALIZABLE_FEATURES = [
  "GENHLTH", "_AGEG5YR", "_BMI5", "EXERANY2",
  "high_bp", "high_chol", "SMOKE100", "diff_walk",
  "stroke_history", "angina_chd_history", "heart_attack_history",
];

// Match advice to answers rather than calculating SHAP on the phone.
export function getPersonalFactors(answers) {
  const bmi = getBmiValue(answers);

  const elevated = {
    GENHLTH: Number(answers.GENHLTH) >= 4,
    _AGEG5YR: Number(answers.AGE_YEARS) >= 35,
    _BMI5: bmi >= 25,
    EXERANY2: answers.EXERANY2 === false,
    high_bp: answers.high_bp === true,
    high_chol: answers.high_chol === true,
    SMOKE100: answers.SMOKE100 === true,
    diff_walk: answers.diff_walk === true,
    stroke_history: answers.stroke_history === true,
    angina_chd_history: answers.angina_chd_history === true,
    heart_attack_history: answers.heart_attack_history === true,
  };

  return PERSONALIZABLE_FEATURES.filter((feature) => elevated[feature]);
}

// Advice for a reported cardiovascular condition.
const SEE_YOUR_CARE_TEAM =
  "If you've already been diagnosed with this, keep following your doctor's advice and mention this result at your next visit.";

const ADVICE_CONTENT = {
  _BMI5: {
    bullets: [
      "Losing 5 to 7% of your body weight may lower your risk, based on CDC research.",
      "Try to get at least 150 minutes of moderate activity a week, like brisk walking.",
      "Gradual changes may be easier to maintain than a strict diet.",
    ],
    source: { label: "CDC National Diabetes Prevention Program", url: "https://www.cdc.gov/diabetes-prevention/programs/what-is-the-national-dpp.html" },
  },
  EXERANY2: {
    bullets: [
      "The CDC recommends at least 150 minutes of moderate activity a week, about 30 minutes on 5 days.",
      "Short walks can count toward that total. Activity doesn't need to happen all at once.",
    ],
    source: { label: "CDC Physical Activity Basics", url: "https://www.cdc.gov/physical-activity-basics/index.html" },
  },
  high_bp: {
    bullets: [
      "The DASH eating pattern, which includes more fruits, vegetables, and whole grains and less sodium, may help lower blood pressure.",
      "Aim to keep sodium under 2,300 mg a day.",
      "Regular activity and limiting alcohol may help too.",
    ],
    source: { label: "CDC, Preventing High Blood Pressure", url: "https://www.cdc.gov/high-blood-pressure/prevention/index.html" },
  },
  high_chol: {
    bullets: [
      "Cutting back on saturated and trans fats, like those in fried foods and fatty meats, may help lower cholesterol.",
      "Adding more fiber, like oats, beans, and fruit, can help lower LDL, the 'bad' cholesterol.",
      "Regular activity can help raise HDL, the 'good' cholesterol.",
    ],
    source: { label: "American Heart Association", url: "https://www.heart.org/en/health-topics/cholesterol/prevention-and-treatment-of-high-cholesterol-hyperlipidemia" },
  },
  SMOKE100: {
    bullets: [
      "If you currently smoke, Smokefree.gov has resources to help you quit.",
      "Free help quitting is available anytime.",
    ],
    source: { label: "Smokefree.gov", url: "https://smokefree.gov" },
  },
  diff_walk: {
    bullets: [
      "Being inactive is its own risk factor. Even light activity, like chair exercises or short walks, can help.",
      "Mobility needs vary. A doctor or physical therapist can suggest activities that are safe for you.",
    ],
    source: { label: "CDC, Physical Activity for People with Disabilities", url: "https://www.cdc.gov/disability-and-health/conditions/physical-activity.html" },
  },
  GENHLTH: {
    bullets: [
      "Mention your general health concerns at your next checkup.",
    ],
    source: null,
  },
  _AGEG5YR: {
    bullets: [
      "The USPSTF recommends screening adults aged 35 to 70 who have overweight or obesity. Ask your doctor whether you should be screened.",
    ],
    source: { label: "U.S. Preventive Services Task Force", url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-for-prediabetes-and-type-2-diabetes" },
  },
  stroke_history: { bullets: [SEE_YOUR_CARE_TEAM], source: null },
  angina_chd_history: { bullets: [SEE_YOUR_CARE_TEAM], source: null },
  heart_attack_history: { bullets: [SEE_YOUR_CARE_TEAM], source: null },
};

export function getPersonalizedAdvice(answers) {
  return getPersonalFactors(answers).map((feature) => ({
    feature,
    label: FEATURE_LABELS[feature],
    ...ADVICE_CONTENT[feature],
  }));
}
