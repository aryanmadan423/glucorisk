import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import QuestionnaireScreen from "./src/screens/QuestionnaireScreen";
import ResultsScreen from "./src/screens/ResultsScreen";
import ResourcesScreen from "./src/screens/ResourcesScreen";
import PersonalizedScreen from "./src/screens/PersonalizedScreen";
import AboutScreen from "./src/screens/AboutScreen";
import MetricComparisonScreen from "./src/screens/MetricComparisonScreen";
import { colors } from "./src/theme";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTintColor: colors.text, headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} options={{ title: "Risk Check" }} />
        <Stack.Screen name="Results" component={ResultsScreen} options={{ title: "Result", headerBackVisible: false }} />
        <Stack.Screen name="Resources" component={ResourcesScreen} options={{ title: "Resources" }} />
        <Stack.Screen name="Personalized" component={PersonalizedScreen} options={{ title: "Recommendations" }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: "About" }} />
        <Stack.Screen name="MetricComparison" component={MetricComparisonScreen} options={{ title: "Performance Comparison" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
