import { Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { colors, space } from "../theme";

export default function AboutScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>The model</Text>
      <Text style={styles.body}>
        The model uses 12 health factors like age, sex, and BMI to make predictions. It was trained using CDC survey data from more than 250,000 adults in the United States, looking for patterns in your answers that are linked to diabetes risk.
      </Text>
      <Text style={styles.heading}>Why</Text>
      <Text style={styles.body}>
        The CDC and the American Diabetes Association run an official online quiz which is the standard screening tool people are pointed to. When it flags someone as at risk, it's right about 1 in 10 times.
      </Text>
      <Text style={styles.body}>
        This model does just as well at telling higher-risk from lower-risk people apart, and catches a similar share of real cases. But when it flags someone as at risk, it's right about 1 in 3 times, roughly three times more often than the official quiz.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate("MetricComparison")}>
        <Text style={styles.link}>Performance Comparison</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Limitations</Text>
      <Text style={styles.body}>
        This app only screens for type 2 diabetes, not type 1. It gives a risk estimate, not a diagnosis.
      </Text>

      <Text style={styles.heading}>Privacy</Text>
      <Text style={styles.body}>Everything stays on your phone. No data is uploaded.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.l, paddingTop: space.xl, flexGrow: 1, backgroundColor: colors.background },
  heading: { fontSize: 17, fontWeight: "600", color: colors.text, marginTop: space.l, marginBottom: space.s },
  body: { fontSize: 16, color: colors.text, lineHeight: 22 },
  link: { color: colors.accent, fontSize: 14, fontWeight: "600", marginTop: space.xs },
});