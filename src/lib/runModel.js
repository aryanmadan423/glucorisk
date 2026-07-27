import { InferenceSession, Tensor } from "onnxruntime-react-native";
import { Asset } from "expo-asset";
import { calibrateProbability } from "../constants";

// Model cache
let session = null;

async function loadModel() {
  if (session) return session;
  const asset = Asset.fromModule(require("../../assets/model/diabetes_risk_model.onnx"));
  await asset.downloadAsync();
  session = await InferenceSession.create(asset.localUri || asset.uri);
  return session;
}

export async function predictRisk(featureVector) {
  const model = await loadModel();
  const input = new Tensor("float32", Float32Array.from(featureVector), [1, featureVector.length]);
  const result = await model.run({ float_input: input });
  // At-risk index
  const rawProbability = result.probabilities.data[1];
  return calibrateProbability(rawProbability);
}
