import { Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { colors, space } from "../theme";

export default function AboutScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>The model</Text>
      <Text style={styles.body}>
        The model uses 12 health factors like age, sex, and BMI to make predictions. It was trained using CDC survey data from more than 250,000 adults in the United States, looking for patterns in your answers that are linked to diabetes risk.
      </Text>
      <Text style={styles.heading}>Evaluation</Text>
      <Text style={styles.body}>
        On a held-out set of 32,479 CDC survey respondents, the model achieved an AUC of 0.796, a positive predictive value of 30.3%, and sensitivity of 85.1% for self-reported diabetes or prediabetes.
      </Text>
      <Text style={styles.body}>
        Published ADA risk-score studies report approximately 10% positive predictive value for undiagnosed diabetes. These studies use different populations and outcomes, so the numbers do not establish that Glucorisk outperforms the ADA tool.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate("MetricComparison")}>
        <Text style={styles.link}>Performance Comparison</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Limitations</Text>
      <Text style={styles.body}>
        This is an adult screening prototype. Its training label combines self-reported diabetes and prediabetes, does not distinguish type 1 from type 2, and does not measure future disease onset or confirm undiagnosed disease. It has not been clinically validated.
      </Text>

      <Text style={styles.heading}>Privacy</Text>
      <Text style={styles.body}>Risk calculations stay on your phone. No prediction server receives your answers. Sharing a result is optional and sends the text to an app you choose; resource links open external services.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.l, paddingTop: space.xl, flexGrow: 1, backgroundColor: colors.background },
  heading: { fontSize: 17, fontWeight: "600", color: colors.text, marginTop: space.l, marginBottom: space.s },
  body: { fontSize: 16, color: colors.text, lineHeight: 22 },
  link: { color: colors.accent, fontSize: 14, fontWeight: "600", marginTop: space.xs },
});