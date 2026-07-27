import { Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import { colors, space } from "../theme";

const FIND_PROGRAM_URL = "https://diabetespath2prevention.cdc.gov/findaprogram";
const VCDPE_URL = "https://med.virginia.edu/vcdpe/";
const NEARBY_CARE_URL = "https://www.google.com/maps/search/?api=1&query=diabetes+prevention+program+near+me";

export default function ResourcesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>General ways to lower your risk</Text>
      <Text style={styles.body}>
        Research from the CDC's Diabetes Prevention Program found that losing 5-7% of your body weight and getting at least 150 minutes of activity a week cut the risk of developing type 2 diabetes by 58%.
      </Text>

      <Text style={[styles.heading, { marginTop: space.l }]}>Find a free program</Text>
      <Text style={styles.body}>
        The National Diabetes Prevention Program runs free or low-cost lifestyle programs across the country, in person or online. Search by ZIP code to find one near you.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(FIND_PROGRAM_URL)}>
        <Text style={styles.buttonText}>Find a Program</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Opens in your browser. Requires an internet connection.</Text>

      <Text style={[styles.heading, { marginTop: space.l }]}>Find care near you</Text>
      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(NEARBY_CARE_URL)}>
        <Text style={styles.buttonText}>Open in Maps</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Opens your Maps app. Requires an internet connection.</Text>
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
