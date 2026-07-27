import { Text, StyleSheet, ScrollView, View, TouchableOpacity, Linking } from "react-native";
import { colors, space } from "../theme";

const SOURCE_URL = "https://mdcalc.scholasticahq.com/article/159088-updated-review-of-the-american-diabetes-association-ada-risk-calculator";

// Comparison numbers
const ROWS = [
    { metric: "AUC", glucorisk: "0.80", ada: "0.78-0.83" },
    { metric: "Precision (PPV)", glucorisk: "0.30", ada: "0.10" },
    { metric: "Recall (Sensitivity)", glucorisk: "0.85", ada: "0.72-0.79" },
];

export default function MetricComparisonScreen() {
    return (
        <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.body}>
                A closer look at the classification metrics of both tools.
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
                Measures how well the model ranks people from lower to higher risk. 0.5 is a coin flip, 1.0 is perfect.
            </Text>

            <Text style={styles.heading}>Precision (PPV)</Text>
            <Text style={styles.body}>
                Of everyone flagged as at risk, the share who actually are.
            </Text>

            <Text style={styles.heading}>Recall (Sensitivity)</Text>
            <Text style={styles.body}>
                Of everyone who is actually at risk, the share the model catches.
            </Text>

            <Text style={styles.source}>ADA numbers from a review published in MDCalc's journal.</Text>
            <Text style={styles.source}>Source:</Text>
            <TouchableOpacity onPress={() => Linking.openURL(SOURCE_URL)}>
                <Text style={styles.sourceLink}>{SOURCE_URL}</Text>
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