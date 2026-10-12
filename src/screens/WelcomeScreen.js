import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { colors, space } from "../theme";

export default function WelcomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>Glucorisk</Text>
      <Text style={styles.subtitle}>
        Answer a few questions to get a diabetes and prediabetes screening estimate.
      </Text>

      <Text style={styles.body}>
        For adults. The estimate uses only your answers and runs on your phone. It does not diagnose diabetes or replace medical testing.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Questionnaire")}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("About")}>
        <Text style={styles.link}>How this works</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.l, paddingTop: space.xl * 2, flexGrow: 1, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: "700", color: colors.text, marginBottom: space.s },
  subtitle: { fontSize: 16, color: colors.muted, marginBottom: space.l },
  body: { fontSize: 16, color: colors.text, lineHeight: 22, marginBottom: space.m },
  button: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: space.m, alignItems: "center", marginTop: space.m },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  link: { color: colors.accent, textAlign: "center", marginTop: space.l, fontSize: 15 },
});
