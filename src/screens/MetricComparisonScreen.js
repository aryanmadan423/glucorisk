import { Text, StyleSheet, ScrollView, View, TouchableOpacity, Linking } from "react-native";
import { colors, space } from "../theme";

const SOURCE_URL = "https://mdcalc.scholasticahq.com/article/159088-updated-review-of-the-american-diabetes-association-ada-risk-calculator";

// Glucorisk test results and the ADA figures from the linked review.
const ROWS = [
    { metric: "AUC", glucorisk: "0.796", ada: "0.78-0.83" },
    { metric: "Precision (PPV)", glucorisk: "30.3%", ada: "~10%" },
    { metric: "Recall (Sensitivity)", glucorisk: "85.1%", ada: "72-79%" },
];

export default function MetricComparisonScreen() {
    return (
        <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.body}>
                Results from Glucorisk's test set and published ADA risk-score results.
            </Text>

            <View style={styles.table}>
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={[styles.cell, styles.headerCell, styles.metricCell]}>Metric</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Glucorisk</Text>
                    <Text style={[styles.cell, styles.headerCell]}>ADA test</Text>
                </View>
                {ROWS.map((row) => (
                    <View key={row.metric} style={styles.row}>
                        <Text style={[styles.cell, styles.metricCell]}>{row.metric}</Text>
                        <Text style={styles.cell}>{row.glucorisk}</Text>
                        <Text style={styles.cell}>{row.ada}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.heading}>AUC</Text>
            <Text style={styles.body}>
                Measures how well a model ranks positive cases above negative cases. An AUC of 0.5 is chance-level ranking; 1.0 is perfect ranking.
            </Text>

            <Text style={styles.heading}>Precision (PPV)</Text>
            <Text style={styles.body}>
                For Glucorisk, the percentage of flagged respondents who reported diabetes or prediabetes.
            </Text>

            <Text style={styles.heading}>Recall (Sensitivity)</Text>
            <Text style={styles.body}>
                The percentage of respondents reporting diabetes or prediabetes that Glucorisk flagged.
            </Text>

            <Text style={styles.body}>
                The ADA figures measure undiagnosed diabetes in different populations. Glucorisk uses self-reported diabetes or prediabetes. This comparison does not establish formal superiority over the ADA tool.
            </Text>
            <Text style={styles.source}>Glucorisk results: training notebook in the GitHub repository.</Text>
            <TouchableOpacity onPress={() => Linking.openURL(SOURCE_URL)}>
                <Text style={styles.sourceLink}>ADA figures: MDCalc review</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    page: { padding: space.l, paddingTop: space.xl, flexGrow: 1, backgroundColor: colors.background },
    body: { fontSize: 16, color: colors.text, lineHeight: 22, marginBottom: space.m },
    heading: { fontSize: 16, fontWeight: "600", color: colors.text, marginTop: space.m, marginBottom: space.xs },
    table: { borderWidth: 1, borderColor: colors.line, borderRadius: 10, marginBottom: space.l, overflow: "hidden" },
    row: { flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.line },
    headerRow: { borderTopWidth: 0, backgroundColor: colors.background },
    cell: { flex: 1, padding: space.s, fontSize: 14, color: colors.text },
    headerCell: { fontWeight: "600" },
    metricCell: { flex: 1.4 },
    source: { fontSize: 12, color: colors.muted, marginTop: space.xs, fontStyle: "italic" },
    sourceLink: { fontSize: 12, color: colors.accent, marginTop: 2 },
});