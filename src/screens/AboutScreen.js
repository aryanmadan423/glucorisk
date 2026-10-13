import { Text, StyleSheet, ScrollView } from "react-native";
import { colors, space } from "../theme";

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>About Glucorisk</Text>
      <Text style={styles.body}>
        Glucorisk helps people check their diabetes and prediabetes risk factors and find prevention resources.
      </Text>
      <Text style={styles.heading}>How it works</Text>
      <Text style={styles.body}>
        Answer 13 simple questions about your health and medical history. The app uses a machine learning model trained on 259,829 responses from CDC survey data. It estimates your diabetes and prediabetes risk. Personalized recommendations are also provided.
      </Text>
      <Text style={styles.body}>
        When tested on 32,479 individuals whose data it had never seen before, the Glucorisk model flagged about 96% of individuals with diabetes or prediabetes as at risk.
      </Text>
      <Text style={styles.heading}>About the score</Text>
      <Text style={styles.body}>
        The model was trained on adults aged 18 and older using self-reported diabetes and prediabetes. It does not separate diabetes types or predict future diagnoses. Use the result as a starting point for a conversation with your doctor.
      </Text>
      <Text style={styles.heading}>Privacy</Text>
      <Text style={styles.body}>
        The model runs offline on your phone. Your answers remain private and are not uploaded to a server or saved as a history. There is an option to share your result, and resource links open external websites.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.l, paddingTop: space.xl, flexGrow: 1, backgroundColor: colors.background },
  heading: { fontSize: 17, fontWeight: "600", color: colors.text, marginTop: space.l, marginBottom: space.s },
  body: { fontSize: 16, color: colors.text, lineHeight: 22 },
});
