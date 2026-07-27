import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
import { colors, space } from "../theme";
import { QUESTIONS, buildFeatureVector, feetInchesToCm, lbsToKg } from "../constants";
import { predictRisk } from "../lib/runModel";

export default function QuestionnaireScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  // Unit state
  const [heightUnit, setHeightUnit] = useState("ft");
  const [weightUnit, setWeightUnit] = useState("lb");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [heightCmText, setHeightCmText] = useState("");
  const [weightText, setWeightText] = useState("");

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const answer = answers[question.id];
  const isNumeric = ["number", "height", "weight"].includes(question.type);
  const answered = isNumeric ? answer !== undefined && !isNaN(Number(answer)) : answer !== undefined;

  function setAnswer(value) {
    setAnswers({ ...answers, [question.id]: value });
  }

  async function next() {
    if (!answered) {
      Alert.alert("Answer to continue.");
      return;
    }
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    try {
      // Model prediction
      const probability = await predictRisk(buildFeatureVector(answers));
      navigation.replace("Results", { probability, answers });
    } catch (err) {
      Alert.alert("Something went wrong.", "Try again.");
    }
    setLoading(false);
  }

  function back() {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep(step - 1);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Text style={styles.progress}>{step + 1} / {QUESTIONS.length}</Text>
      <Text style={styles.prompt}>{question.prompt}</Text>

      {question.type === "yesno" && (
        <View style={styles.row}>
          <TouchableOpacity style={[styles.option, answer === true && styles.optionSelected]} onPress={() => setAnswer(true)}>
            <Text style={[styles.optionText, answer === true && styles.optionTextSelected]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.option, answer === false && styles.optionSelected]} onPress={() => setAnswer(false)}>
            <Text style={[styles.optionText, answer === false && styles.optionTextSelected]}>No</Text>
          </TouchableOpacity>
        </View>
      )}

      {question.type === "choice" && question.options.map((opt) => (
        <TouchableOpacity key={opt.value} style={[styles.choice, answer === opt.value && styles.optionSelected]} onPress={() => setAnswer(opt.value)}>
          <Text style={[styles.optionText, answer === opt.value && styles.optionTextSelected]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}

      {question.type === "number" && (
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder={question.placeholder}
          value={answer !== undefined ? String(answer) : ""}
          onChangeText={setAnswer}
        />
      )}

      {question.type === "height" && (
        <View>
          <View style={styles.unitRow}>
            <TouchableOpacity style={[styles.unitButton, heightUnit === "ft" && styles.unitButtonSelected]} onPress={() => setHeightUnit("ft")}>
              <Text style={[styles.unitText, heightUnit === "ft" && styles.unitTextSelected]}>ft / in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.unitButton, heightUnit === "cm" && styles.unitButtonSelected]} onPress={() => setHeightUnit("cm")}>
              <Text style={[styles.unitText, heightUnit === "cm" && styles.unitTextSelected]}>cm</Text>
            </TouchableOpacity>
          </View>

          {heightUnit === "ft" ? (
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                placeholder="Feet"
                value={feet}
                onChangeText={(text) => { setFeet(text); setAnswer(feetInchesToCm(text || 0, inches || 0)); }}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                placeholder="Inches"
                value={inches}
                onChangeText={(text) => { setInches(text); setAnswer(feetInchesToCm(feet || 0, text || 0)); }}
              />
            </View>
          ) : (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g. 170"
              value={heightCmText}
              onChangeText={(text) => { setHeightCmText(text); setAnswer(text); }}
            />
          )}
        </View>
      )}

      {question.type === "weight" && (
        <View>
          <View style={styles.unitRow}>
            <TouchableOpacity style={[styles.unitButton, weightUnit === "lb" && styles.unitButtonSelected]} onPress={() => setWeightUnit("lb")}>
              <Text style={[styles.unitText, weightUnit === "lb" && styles.unitTextSelected]}>lb</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.unitButton, weightUnit === "kg" && styles.unitButtonSelected]} onPress={() => setWeightUnit("kg")}>
              <Text style={[styles.unitText, weightUnit === "kg" && styles.unitTextSelected]}>kg</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder={weightUnit === "lb" ? "e.g. 160" : "e.g. 73"}
            value={weightText}
            onChangeText={(text) => {
              setWeightText(text);
              setAnswer(weightUnit === "lb" ? lbsToKg(text || 0) : text);
            }}
          />
        </View>
      )}

      <View style={styles.nav}>
        <TouchableOpacity onPress={back} disabled={loading}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={next} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isLast ? "See Results" : "Next"}</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background, padding: space.l, paddingTop: space.xl },
  progress: { color: colors.muted, marginBottom: space.m },
  prompt: { fontSize: 20, fontWeight: "600", color: colors.text, marginBottom: space.l },
  row: { flexDirection: "row", gap: space.m },
  option: { flex: 1, paddingVertical: space.l, borderRadius: 10, borderWidth: 1, borderColor: colors.line, alignItems: "center" },
  choice: { paddingVertical: space.m, paddingHorizontal: space.m, borderRadius: 10, borderWidth: 1, borderColor: colors.line, marginBottom: space.s },
  optionSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  optionText: { fontSize: 16, color: colors.text },
  optionTextSelected: { color: "#fff", fontWeight: "600" },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: space.m, fontSize: 16 },
  halfInput: { flex: 1 },
  unitRow: { flexDirection: "row", gap: space.s, marginBottom: space.m },
  unitButton: { paddingVertical: space.s, paddingHorizontal: space.m, borderRadius: 8, borderWidth: 1, borderColor: colors.line },
  unitButtonSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  unitText: { fontSize: 14, color: colors.text },
  unitTextSelected: { color: "#fff", fontWeight: "600" },
  nav: { flexDirection: "row", alignItems: "center", gap: space.m, marginTop: "auto", paddingTop: space.l },
  back: { color: colors.muted, fontSize: 16, paddingHorizontal: space.s },
  button: { flex: 1, backgroundColor: colors.accent, borderRadius: 10, paddingVertical: space.m, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
