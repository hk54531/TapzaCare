
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '../theme/ThemeProvider';
import type { LayoutConfig, SectionConfig } from '../types/config';
import type { ConfigMode } from '../hooks/useConfig';

type HomeScreenProps = {
  config: LayoutConfig;
  mode: ConfigMode;
  loadingConfig: boolean;
  configError: string | null;
  onSwitchMode: (mode: ConfigMode) => Promise<void>;
  onRetryConfig: () => Promise<void>;
};

type ConfigItem = Record<string, unknown>;

function asItem(value: unknown): ConfigItem {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as ConfigItem;
  }
  return {};
}

function asText(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : fallback;
}

function asItems(section: SectionConfig): ConfigItem[] {
  return Array.isArray(section.items) ? section.items.map(asItem) : [];
}

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}
function getIcon(iconName: string): string {
  const icons: Record<string, string> = {
    stethoscope: '🩺',
    'flask-conical': '🧪',
    pill: '💊',
    syringe: '💉',
    users: '👨‍👩‍👧‍👦',
    'calendar-plus': '📅',
    'file-text': '📄',
    bell: '🔔',
  };

  return icons[iconName] ?? '✚';
}

export default function HomeScreen({
  config,
  mode,
  loadingConfig,
  configError,
  onSwitchMode,
  onRetryConfig,
}: HomeScreenProps) {
  const { theme } = useAppTheme();
  const [search, setSearch] = useState('');

  const sections = useMemo(
    () => (Array.isArray(config.sections) ? config.sections : []),
    [config.sections],
  );

  const festival = config.theme.festival;
  const greeting = festival?.greeting || 'Your health, made simple.';

  const visibleSections = sections.filter(section => {
    const items = asItems(section);

    if (
      section.type === 'service_grid' ||
      section.type === 'category_chips' ||
      section.type === 'quick_actions'
    ) {
      if (!search.trim()) {
        return true;
      }

      const query = search.trim().toLowerCase();
      const matches = items.some(item => {
        const searchableText = [
          item.name,
          item.title,
          item.label,
          item.subtitle,
          item.specialty,
        ]
          .map(value => asText(value))
          .join(' ')
          .toLowerCase();

        return searchableText.includes(query);
      });

      return matches;
    }

    return true;
  });

  const renderHero = (section: SectionConfig) => {
    const item = asItems(section)[0] ?? {};
    const title = asText(item.greeting, greeting);
    const subtitle = asText(
      item.subtitle,
      'Make your next health visit easier.',
    );
    const imageUrl = asText(
      item.imageUrl,
      festival?.bannerImageUrl ?? '',
    );
    const backgroundValue = section.background?.value ?? theme.primary;
    const heroColor =
      section.background?.kind === 'color'
        ? backgroundValue
        : theme.primary;

    const heroContent = (
      <View style={styles.heroContent}>
        <Text style={styles.heroEyebrow}>
          {festival?.name
            ? `${festival.name.toUpperCase()} SPECIAL`
            : 'YOUR HEALTH, OUR PRIORITY'}
        </Text>

        <Text style={styles.heroTitle}>{title}</Text>

        <Text style={styles.heroSubtitle}>{subtitle}</Text>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Explore health services"
          onPress={() => setSearch('')}
          style={[
            styles.heroButton,
            { backgroundColor: theme.surface },
          ]}>
          <Text style={[styles.heroButtonText, { color: theme.primary }]}>
            {asText(item.actionLabel, 'Explore services →')}
          </Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <View
        key={section.id}
        style={[
          styles.hero,
          { backgroundColor: heroColor },
        ]}>
        {section.background?.kind === 'image' && imageUrl ? (
          <ImageBackground
            source={{ uri: imageUrl }}
            resizeMode="cover"
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}>
            <View style={styles.heroOverlay}>{heroContent}</View>
          </ImageBackground>
        ) : (
          <View style={styles.heroInner}>
            {heroContent}
            <Text style={styles.heroEmoji}>
              {festival?.name ? '🪔' : '💚'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderCategories = (section: SectionConfig) => {
    const items = asItems(section);

    return (
      <View key={section.id} style={styles.section}>
        {renderSectionHeading(section)}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalItems}>
          {items.map((item, index) => {
            const label = asText(
              item.name,
              asText(item.label, asText(item.title, 'Service')),
            );

            return (
              <TouchableOpacity
                key={asText(item.id, `${section.id}-${index}`)}
                accessibilityRole="button"
                onPress={() => setSearch(label)}
                style={[
                  styles.categoryChip,
                  { backgroundColor: theme.secondary },
                ]}>
                <Text style={styles.categoryEmoji}>
                  {getIcon(asText(item.icon))}
                </Text>

                <Text
                  style={[styles.categoryLabel, { color: theme.primary }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderQuickActions = (section: SectionConfig) => {
    const items = asItems(section);

    return (
      <View key={section.id} style={styles.section}>
        {renderSectionHeading(section)}
        <View style={styles.quickGrid}>
          {items.map((item, index) => {
            const title = asText(
              item.name,
              asText(item.title, asText(item.label, 'Explore')),
            );

            return (
              <TouchableOpacity
                key={asText(item.id, `${section.id}-${index}`)}
                accessibilityRole="button"
                onPress={() => setSearch(title)}
                style={[
                  styles.quickAction,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.secondary,
                  },
                ]}>
                <View
                  style={[
                    styles.quickIconBox,
                    { backgroundColor: theme.secondary },
                  ]}>
                  <Text style={styles.quickIcon}>
                    {getIcon(asText(item.icon))}
                  </Text>
                </View>
                <Text
                  style={[styles.quickTitle, { color: theme.textPrimary }]}>
                  {title}
                </Text>
                {Boolean(item.subtitle) && (
                  <Text
                    style={[
                      styles.cardSubtitle,
                      { color: theme.textSecondary },
                    ]}>
                    {asText(item.subtitle)}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderServiceGrid = (section: SectionConfig) => {
    const items = asItems(section);

    return (
      <View key={section.id} style={styles.section}>
        {renderSectionHeading(section)}
        <View style={styles.serviceGrid}>
          {items.map((item, index) => {
            const title = asText(
              item.name,
              asText(item.title, 'Health service'),
            );
            const imageUrl = asText(
              item.imageUrl,
              asText(item.photoUrl),
            );
            const icon = asText(item.icon, '🩺');
            const price = asNumber(
              item.priceInr,
              asNumber(item.feeInr, 0),
            );
            const badge = asText(item.badge);

            return (
              <TouchableOpacity
                key={asText(item.id, `${section.id}-${index}`)}
                accessibilityRole="button"
                onPress={() => setSearch(title)}
                style={[
                  styles.serviceCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.secondary,
                  },
                ]}>
                {imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.serviceImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.serviceIconBox,
                      { backgroundColor: theme.secondary },
                    ]}>
                    <Text style={styles.serviceIcon}>{icon}</Text>
                  </View>
                )}

                {badge ? (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: theme.secondary },
                    ]}>
                    <Text style={{ color: theme.primary, fontSize: 10 }}>
                      {badge}
                    </Text>
                  </View>
                ) : null}

                <Text
                  style={[styles.serviceTitle, { color: theme.textPrimary }]}>
                  {title}
                </Text>

                {Boolean(item.subtitle) && (
                  <Text
                    style={[
                      styles.cardSubtitle,
                      { color: theme.textSecondary },
                    ]}>
                    {asText(item.subtitle)}
                  </Text>
                )}

                {price > 0 && (
                  <Text
                    style={[styles.price, { color: theme.primary }]}>
                    {formatRupees(price)}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderDoctors = (section: SectionConfig) => {
    const items = asItems(section);

    return (
      <View key={section.id} style={styles.section}>
        {renderSectionHeading(section)}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalItems}>
          {items.map((item, index) => {
            const name = asText(item.name, 'Doctor');
            const photoUrl = asText(
              item.photoUrl,
              asText(item.imageUrl),
            );

            return (
              <TouchableOpacity
                key={asText(item.id, `${section.id}-${index}`)}
                accessibilityRole="button"
                onPress={() => setSearch(name)}
                style={[
                  styles.doctorCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.secondary,
                  },
                ]}>
                {photoUrl ? (
                  <Image
                    source={{ uri: photoUrl }}
                    style={styles.doctorPhoto}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.doctorPlaceholder,
                      { backgroundColor: theme.secondary },
                    ]}>
                    <Text style={styles.doctorPlaceholderIcon}>👨‍⚕️</Text>
                  </View>
                )}

                <Text
                  numberOfLines={1}
                  style={[styles.doctorName, { color: theme.textPrimary }]}>
                  {name}
                </Text>

                <Text
                  numberOfLines={2}
                  style={[
                    styles.cardSubtitle,
                    { color: theme.textSecondary },
                  ]}>
                  {asText(item.specialty, 'General Physician')}
                </Text>

                <Text style={[styles.price, { color: theme.primary }]}>
                  {formatRupees(asNumber(item.feeInr, 0))}
                </Text>

                {Boolean(item.nextSlot) && (
                  <Text
                    style={[
                      styles.nextSlot,
                      { color: theme.textSecondary },
                    ]}>
                    Next: {asText(item.nextSlot)}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderOffer = (section: SectionConfig) => {
    const item = asItems(section)[0] ?? {};

    return (
      <View
        key={section.id}
        style={[
          styles.offerStrip,
          { backgroundColor: theme.accent },
        ]}>
        <Text style={styles.offerEmoji}>
          {asText(item.icon, '✨')}
        </Text>
        <View style={styles.offerTextContainer}>
          <Text style={[styles.offerTitle, { color: theme.textPrimary }]}>
            {asText(item.title, section.title || 'Special offer')}
          </Text>
          <Text style={[styles.offerSubtitle, { color: theme.textPrimary }]}>
            {asText(
              item.subtitle,
              'Take a step towards better health today.',
            )}
          </Text>
        </View>
      </View>
    );
  };

  function renderSectionHeading(section: SectionConfig) {
    if (!section.title) {
      return null;
    }

    return (
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          {section.title}
        </Text>
      </View>
    );
  }

  const renderSection = (section: SectionConfig) => {
    switch (section.type) {
      case 'hero_banner':
        return renderHero(section);

      case 'category_chips':
        return renderCategories(section);

      case 'quick_actions':
        return renderQuickActions(section);

      case 'service_grid':
        return renderServiceGrid(section);

      case 'doctor_carousel':
        return renderDoctors(section);

      case 'offer_strip':
        return renderOffer(section);

      default:
        // Unknown config section types must never crash the screen.
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar
        barStyle="dark-content"
      // backgroundColor={theme.background}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.brand, { color: theme.primary }]}>
              TapzaCare
            </Text>
            <Text style={[styles.greeting, { color: theme.textPrimary }]}>
              Hello there 👋
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {greeting}
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Switch between normal and festival themes"
            disabled={loadingConfig}
            onPress={() => {
              void onSwitchMode(
                mode === 'normal' ? 'festival' : 'normal',
              );
            }}
            style={[
              styles.themeSwitch,
              { backgroundColor: theme.secondary },
            ]}>
            {loadingConfig ? (
              <ActivityIndicator color={theme.primary} />
            ) : (
              <Text style={[styles.themeSwitchText, { color: theme.primary }]}>
                {mode === 'normal'
                  ? '🪔 Try festival'
                  : '🌿 Normal day'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {configError !== null && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Retry loading configuration"
            onPress={() => {
              void onRetryConfig();
            }}
            style={[
              styles.errorBanner,
              { backgroundColor: theme.secondary },
            ]}>
            <Text style={{ color: theme.textPrimary }}>
              {configError} Tap to retry.
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: theme.surface,
              borderColor: theme.secondary,
            },
          ]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search doctors, services..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.textPrimary }]}
            accessibilityLabel="Search health services"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {search.length > 0 && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => setSearch('')}
              style={styles.clearButton}>
              <Text style={{ color: theme.textSecondary }}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {visibleSections.map(section => renderSection(section))}

        <Text style={[styles.footer, { color: theme.textSecondary }]}>
          TapzaCare • Your health, made simple.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  brand: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  themeSwitch: {
    minHeight: 44,
    minWidth: 44,
    maxWidth: 132,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  themeSwitchText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorBanner: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 52,
    marginBottom: 24,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
  },
  clearButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  horizontalItems: {
    gap: 12,
    paddingRight: 4,
  },
  hero: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 28,
    minHeight: 200,
  },
  heroImage: {
    minHeight: 200,
  },
  heroImageStyle: {
    borderRadius: 22,
  },
  heroOverlay: {
    flex: 1,
    minHeight: 200,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.32)',
    padding: 20,
  },
  heroInner: {
    flex: 1,
    minHeight: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  heroContent: {
    flex: 1,
  },
  heroEyebrow: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 14,
  },
  heroButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  heroButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroEmoji: {
    fontSize: 42,
    marginLeft: 8,
  },
  categoryChip: {
    minHeight: 44,
    borderRadius: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 17,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    width: '47%',
    flexGrow: 1,
    flexBasis: '40%',
    minHeight: 120,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickIcon: {
    fontSize: 22,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '47%',
    flexGrow: 1,
    flexBasis: '40%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    minHeight: 150,
  },
  serviceImage: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    marginBottom: 12,
  },
  serviceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    fontSize: 23,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 7,
  },
  doctorCard: {
    width: 172,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  doctorPhoto: {
    width: '100%',
    height: 105,
    borderRadius: 12,
    marginBottom: 10,
  },
  doctorPlaceholder: {
    width: '100%',
    height: 105,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  doctorPlaceholderIcon: {
    fontSize: 36,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '700',
  },
  nextSlot: {
    fontSize: 11,
    marginTop: 6,
  },
  offerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    gap: 12,
  },
  offerEmoji: {
    fontSize: 25,
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  offerSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
    paddingBottom: 12,
  },
});
