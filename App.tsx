import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ThemeProvider,
  useAppTheme,
} from './src/theme/ThemeProvider';

function AppContent() {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
      />

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: theme.primary,
              fontSize: theme.typography.heading,
            },
          ]}
        >
          Tapza Care
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: theme.textSecondary,
              fontSize: theme.typography.body,
            },
          ]}
        >
          Your health, made simple.
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider config={null}>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    padding: 24,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
  },
});
