import { Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import { colors, space } from "../theme";

const FIND_PROGRAM_URL = "https://diabetespath2prevention.cdc.gov/findaprogram";
const NEARBY_CARE_URL = "https://www.google.com/maps/search/?api=1&query=diabetes+prevention+program+near+me";

export default function ResourcesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>General ways to lower your risk</Text>
      <Text style={styles.body}>
        Prevention programs offer support with eating habits, physical activity, and weight management.
      </Text>

      <Text style={[styles.heading, { marginTop: space.l }]}>Find a prevention program</Text>
      <Text style={styles.body}>
        Search by ZIP code for a CDC-recognized program near you. Some programs also meet online.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(FIND_PROGRAM_URL)}>
        <Text style={styles.buttonText}>Find a Program</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Opens in your browser. Requires an internet connection.</Text>

      <Text style={[styles.heading, { marginTop: space.l }]}>Find care near you</Text>
      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(NEARBY_CARE_URL)}>
        <Text style={styles.buttonText}>Open in Maps</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Opens a map search. Requires an internet connection.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.l, paddingTop: space.xl, flexGrow: 1, backgroundColor: colors.background },
  heading: { fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: space.s },
  body: { fontSize: 16, color: colors.text, lineHeight: 22, marginBottom: space.m },
  note: { fontSize: 12, color: colors.muted, marginTop: space.xs, marginBottom: space.m },
  link: { color: colors.accent, fontSize: 14, fontWeight: "600", marginTop: space.xs },
  button: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: space.s, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
