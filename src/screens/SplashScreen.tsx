import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppTheme} from '../theme/ThemeProvider';

type SplashScreenProps = {
  onFinish?: () => void;
};

export default function SplashScreen({onFinish}: SplashScreenProps) {
  const {theme} = useAppTheme();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
    ]);

    const loading = Animated.timing(progress, {
      toValue: 1,
      duration: 1900,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });

    entrance.start();
    loading.start();

    const timeout = setTimeout(() => {
      onFinish?.();
    }, 2400);

    return () => {
      clearTimeout(timeout);
      entrance.stop();
      loading.stop();
    };
  }, [onFinish, opacity, progress, scale]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {backgroundColor: theme.background},
      ]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <View style={styles.center}>
          <Animated.View
            style={[
              styles.logo,
              {
                backgroundColor: theme.primary,
                opacity,
                transform: [{scale}],
              },
            ]}>
            <View
              style={[
                styles.crossVertical,
                {backgroundColor: theme.surface},
              ]}
            />
            <View
              style={[
                styles.crossHorizontal,
                {backgroundColor: theme.surface},
              ]}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.brandBlock,
              {opacity},
            ]}>
            <Text
              style={[
                styles.brand,
                {color: theme.textPrimary},
              ]}>
              Tapza<Text style={{color: theme.primary}}>Care</Text>
            </Text>

            <Text
              style={[
                styles.tagline,
                {color: theme.textSecondary},
              ]}>
              Healthcare, made simpler.
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.trustRow,
              {opacity},
            ]}>
            <View
              style={[
                styles.trustLine,
                {backgroundColor: theme.secondary},
              ]}
            />
            <Text
              style={[
                styles.trustText,
                {color: theme.textSecondary},
              ]}>
              YOUR HEALTH, OUR PRIORITY
            </Text>
            <View
              style={[
                styles.trustLine,
                {backgroundColor: theme.secondary},
              ]}
            />
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.bottom,
            {opacity},
          ]}>
          <View
            style={[
              styles.progressTrack,
              {backgroundColor: theme.secondary},
            ]}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>

          <Text
            style={[
              styles.loadingText,
              {color: theme.textSecondary},
            ]}>
            Preparing your care experience...
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 92,
    height: 92,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#19352C',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 5},
  },
  crossVertical: {
    position: 'absolute',
    width: 16,
    height: 50,
    borderRadius: 4,
  },
  crossHorizontal: {
    position: 'absolute',
    width: 50,
    height: 16,
    borderRadius: 4,
  },
  brandBlock: {
    alignItems: 'center',
    marginTop: 26,
  },
  brand: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  tagline: {
    fontSize: 15,
    marginTop: 9,
    letterSpacing: 0.1,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 32,
  },
  trustLine: {
    width: 22,
    height: 1,
  },
  trustText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  loadingText: {
    fontSize: 12,
    marginTop: 13,
  },
});