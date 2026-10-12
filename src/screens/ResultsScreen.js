import { Text, StyleSheet, TouchableOpacity, ScrollView, Share } from "react-native";
import { colors, space } from "../theme";
import { FEATURE_LABELS, RECOMMENDED_THRESHOLD, getPersonalFactors } from "../constants";

export default function ResultsScreen({ route, navigation }) {
  const { probability, answers } = route.params;
  const percent = Math.round(probability * 100);
  const isHigh = probability >= RECOMMENDED_THRESHOLD;
  const color = isHigh ? colors.high : colors.low;

  // Include up to three matching factors in the shared result.
  const personalFactors = getPersonalFactors(answers).slice(0, 3);

  async function shareResult() {
    const factorsList = personalFactors.map((f) => FEATURE_LABELS[f]).join(", ");
    const message = `Glucorisk result: ${percent}% diabetes/prediabetes screening estimate.` +
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
      <Text style={styles.label}>Your risk score</Text>
      <Text style={[styles.percent, { color }]}>{percent}%</Text>
      <Text style={styles.body}>
        {isHigh
          ? "Your score is elevated. Talk to your doctor about diabetes testing."
          : "Your score is below the app's cutoff. A lower score does not rule out diabetes; ask your doctor about screening if you have concerns."}
      </Text>

      <Text style={styles.body}>
        This is a screening estimate, not a diagnosis.
      </Text>

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
  percent: { fontSize: 48, fontWeight: "800", marginVertical: space.s },
  body: { fontSize: 16, color: colors.text, lineHeight: 22, marginBottom: space.l },
  button: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: space.m, alignItems: "center", marginTop: space.l },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  secondaryButton: { borderRadius: 10, paddingVertical: space.m, alignItems: "center", marginTop: space.s, borderWidth: 1, borderColor: colors.accent },
  secondaryButtonText: { color: colors.accent, fontSize: 16, fontWeight: "600" },
  link: { color: colors.accent, textAlign: "center", marginTop: space.m, fontSize: 15 },
});
