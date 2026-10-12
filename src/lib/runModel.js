import { InferenceSession, Tensor } from "onnxruntime-react-native";
import { Asset } from "expo-asset";
import { calibrateProbability } from "../constants";

// Reuse the loaded model for later checks.
let session = null;

async function loadModel() {
  if (session) return session;
  const asset = Asset.fromModule(require("../../assets/model/diabetes_risk_model.onnx"));
  await asset.downloadAsync();
  session = await InferenceSession.create(asset.localUri || asset.uri);
  return session;
}

export async function predictRisk(featureVector) {
  if (featureVector.length !== 12 || !featureVector.every(Number.isFinite)) {
    throw new Error("The model requires 12 finite health factors.");
  }
  const model = await loadModel();
  const input = new Tensor("float32", Float32Array.from(featureVector), [1, featureVector.length]);
  const result = await model.run({ float_input: input });
  // Column 1 contains the positive-class probability.
  const rawProbability = result.probabilities.data[1];
  if (!Number.isFinite(rawProbability) || rawProbability < 0 || rawProbability > 1) {
    throw new Error("The model returned an invalid probability.");
  }
  return calibrateProbability(rawProbability);
}
