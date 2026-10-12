import { Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { colors, space } from "../theme";

export default function AboutScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>About Glucorisk</Text>
      <Text style={styles.body}>
        Glucorisk helps adults check their diabetes and prediabetes risk factors and find prevention resources.
      </Text>
      <Text style={styles.heading}>How it works</Text>
      <Text style={styles.body}>
        The app uses 12 health factors, including age, BMI, and medical history. Its gradient-boosting model was trained on 259,829 responses from the 2023 CDC health survey.
      </Text>
      <Text style={styles.body}>
        On the test set, the model had an AUC of 0.796, a PPV of 30.3%, and sensitivity of 85.1%.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate("MetricComparison")}>
        <Text style={styles.link}>Performance comparison</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>About the score</Text>
      <Text style={styles.body}>
        The model learned from self-reported diabetes and prediabetes. It does not separate diabetes types or predict future diagnoses. Use the result as a starting point for a conversation with your doctor.
      </Text>
      <Text style={styles.heading}>Privacy</Text>
      <Text style={styles.body}>
        The model runs on your phone, and your answers are not uploaded. Sharing a result is optional. Resource links open external websites.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.l, paddingTop: space.xl, flexGrow: 1, backgroundColor: colors.background },
  heading: { fontSize: 17, fontWeight: "600", color: colors.text, marginTop: space.l, marginBottom: space.s },
  body: { fontSize: 16, color: colors.text, lineHeight: 22 },
  link: { color: colors.accent, fontSize: 14, fontWeight: "600", marginTop: space.xs },
});