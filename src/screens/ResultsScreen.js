import { Text, StyleSheet, TouchableOpacity, ScrollView, Share } from "react-native";
import { colors, space } from "../theme";
import { FEATURE_LABELS, RECOMMENDED_THRESHOLD, getPersonalFactors } from "../constants";

export default function ResultsScreen({ route, navigation }) {
  const { probability, answers } = route.params;
  const percentText = (probability * 100).toFixed(1);
  const multiplierText = (probability / RECOMMENDED_THRESHOLD).toFixed(2);
  const cutoffText = (RECOMMENDED_THRESHOLD * 100).toFixed(2);
  const isHigh = probability >= RECOMMENDED_THRESHOLD;
  const color = isHigh ? colors.high : colors.low;

  // Include up to three matching factors in the shared result.
  const personalFactors = getPersonalFactors(answers).slice(0, 3);

  async function shareResult() {
    const factorsList = personalFactors.map((f) => FEATURE_LABELS[f]).join(", ");
    const message = `Glucorisk result: ${isHigh ? "Diabetes testing recommended" : "Below screening cutoff"}. Calibrated risk score: ${percentText}%. ${multiplierText}x the screening cutoff (${cutoffText}%).` +
      (factorsList ? ` Factors: ${factorsList}.` : "") +
      ` This is a screening estimate, not a diagnosis.`;
    try {
      await Share.share({ message });
    } catch (err) {
      console.error("Share failed:", err);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={[styles.heading, { color }]}>
        {isHigh ? "Diabetes testing recommended" : "Below screening cutoff"}
      </Text>
      <Text style={styles.body}>
        {isHigh
          ? "Talk to a healthcare professional about diabetes testing."
          : "A lower score does not rule out diabetes. Ask a healthcare professional about testing if you have concerns."}
      </Text>

      <Text style={styles.label}>Calibrated risk score</Text>
      <Text style={styles.percent}>{percentText}%</Text>
      <Text style={styles.comparison}>
        {multiplierText}× the screening cutoff ({cutoffText}%)
      </Text>
      <Text style={styles.body}>
        Even a low score can lead to a testing recommendation. The cutoff is kept low to help miss fewer possible cases.
      </Text>
      <Text style={styles.note}>
        The multiplier compares your score with the cutoff. It is not a comparison with another person's risk.
      </Text>
      <Text style={styles.body}>This is a screening estimate, not a diagnosis.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Resources", { answers })}>
        <Text style={styles.buttonText}>Resources</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Personalized", { answers })}>
        <Text style={styles.buttonText}>View Recommendations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={shareResult}>
        <Text style={styles.secondaryButtonText}>Share Result</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.popToTop()}>
        <Text style={styles.link}>Start Over</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.l, paddingTop: space.xl, flexGrow: 1, backgroundColor: colors.background },
  label: { color: colors.muted, fontSize: 15 },
  heading: { fontSize: 24, fontWeight: "700", marginBottom: space.m },
  percent: { fontSize: 28, fontWeight: "600", color: colors.text, marginVertical: space.s },
  comparison: { fontSize: 15, color: colors.muted, marginBottom: space.m },
  note: { fontSize: 13, color: colors.muted, lineHeight: 18, marginBottom: space.m },
  body: { fontSize: 16, color: colors.text, lineHeight: 22, marginBottom: space.l },
  button: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: space.m, alignItems: "center", marginTop: space.l },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  secondaryButton: { borderRadius: 10, paddingVertical: space.m, alignItems: "center", marginTop: space.s, borderWidth: 1, borderColor: colors.accent },
  secondaryButtonText: { color: colors.accent, fontSize: 16, fontWeight: "600" },
  link: { color: colors.accent, textAlign: "center", marginTop: space.m, fontSize: 15 },
});
