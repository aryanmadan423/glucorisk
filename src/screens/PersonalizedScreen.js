import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { colors, space } from "../theme";
import { getPersonalizedAdvice, getBmiValue, getBmiCategory } from "../constants";

export default function PersonalizedScreen({ route }) {
  const { answers } = route.params;
  const advice = getPersonalizedAdvice(answers);
  const bmi = getBmiValue(answers);
  const bmiCategory = getBmiCategory(bmi);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.disclaimer}>
        Talk to your doctor before making any major lifestyle changes.
      </Text>

      {advice.length === 0 ? (
        <Text style={styles.body}>
          None of the factors this app looks at showed up in your answers.
        </Text>
      ) : (
        advice.map((item) => (
          <View key={item.feature} style={styles.adviceItem}>
            <Text style={styles.adviceTitle}>
              {item.feature === "_BMI5"
                ? `Your BMI is in the ${bmiCategory} range`
                : item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            </Text>
            {item.bullets.map((bullet, i) => (
              <Text key={i} style={styles.bullet}>• {bullet}</Text>
            ))}
            {item.source && (
              <>
                <Text style={styles.source}>Source: {item.source.label}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(item.source.url)}>
                  <Text style={styles.sourceLink}>{item.source.url}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.l, paddingTop: space.xl, flexGrow: 1, backgroundColor: colors.background },
  disclaimer: { fontSize: 14, color: colors.muted, marginBottom: space.l },
  body: { fontSize: 16, color: colors.text, lineHeight: 22 },
  adviceItem: { marginBottom: space.l },
  adviceTitle: { fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: space.xs },
  bullet: { fontSize: 15, color: colors.text, lineHeight: 21, marginLeft: space.xs },
  source: { fontSize: 12, color: colors.muted, marginTop: space.xs, fontStyle: "italic" },
  sourceLink: { fontSize: 12, color: colors.accent, marginTop: 2 },
});
