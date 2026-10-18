
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
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
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppTheme} from '../theme/ThemeProvider';
import type {LayoutConfig, SectionConfig} from '../types/config';
import type {ConfigMode} from '../hooks/useConfig';

type Props = {
  config: LayoutConfig;
  mode: ConfigMode;
  loadingConfig: boolean;
  configError: string | null;
  onSwitchMode: (mode: ConfigMode) => Promise<void>;
  onRetryConfig: () => Promise<void>;
};

type Item = Record<string, unknown>;

const text = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback;

const number = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const itemsOf = (section: SectionConfig): Item[] =>
  Array.isArray(section.items)
    ? section.items.filter(
        (item): item is Item =>
          !!item &&
          typeof item === 'object' &&
          !Array.isArray(item),
      )
    : [];

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const iconFor = (name: string) => {
  const icons: Record<string, string> = {
    stethoscope: '🩺',
    'flask-conical': '🧪',
    pill: '💊',
    syringe: '💉',
    users: '👨‍👩‍👧‍👦',
    'calendar-plus': '📅',
    'file-text': '📄',
    bell: '🔔',
    home: '⌂',
    calendar: '▦',
    user: '♙',
    heart: '♥',
  };

  return icons[name] ?? '✚';
};

export default function HomeScreen({
  config,
  mode,
  loadingConfig,
  configError,
  onSwitchMode,
  onRetryConfig,
}: Props) {
  const {theme} = useAppTheme();
  const [search, setSearch] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    entrance.setValue(0);

    Animated.spring(entrance, {
      toValue: 1,
      tension: 48,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [config.version, entrance]);

  const sections = useMemo(
    () => (Array.isArray(config.sections) ? config.sections : []),
    [config.sections],
  );

  const festival = config.theme.festival;
  const isFestival = mode === 'festival';

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.96],
    extrapolate: 'clamp',
  });

  const heroParallax = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [0, -22],
    extrapolate: 'clamp',
  });

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return sections;
    }

    return sections
      .map(section => {
        if (
          ![
            'category_chips',
            'quick_actions',
            'service_grid',
            'doctor_carousel',
          ].includes(section.type)
        ) {
          return section;
        }

        const filtered = itemsOf(section).filter(item => {
          const values = [
            item.name,
            item.label,
            item.title,
            item.specialty,
            item.subtitle,
          ];

          return values
            .map(value => text(value).toLowerCase())
            .join(' ')
            .includes(query);
        });

        return {...section, items: filtered};
      })
      .filter(section => {
        if (
          [
            'category_chips',
            'quick_actions',
            'service_grid',
            'doctor_carousel',
          ].includes(section.type)
        ) {
          return itemsOf(section).length > 0;
        }

        return false;
      });
  }, [search, sections]);

  const sectionHeading = (section: SectionConfig) =>
    section.title ? (
      <View style={styles.sectionHeading}>
        <View style={styles.headingAccent} />
        <Text
          style={[styles.sectionTitle, {color: theme.textPrimary}]}>
          {section.title}
        </Text>
      </View>
    ) : null;

  const renderHero = (section: SectionConfig) => {
    const item = itemsOf(section)[0] ?? {};
    const imageUrl = text(
      item.imageUrl,
      festival?.bannerImageUrl ?? '',
    );
    const hasImage =
      (section.background?.kind === 'image' ||
        Boolean(imageUrl)) &&
      Boolean(imageUrl);

    const content = (
      <View style={styles.heroContent}>
        <View style={styles.heroPill}>
          <Text style={styles.heroPillText}>
            {isFestival ? '✦ FESTIVE WELLNESS' : '✦ YOUR HEALTH, FIRST'}
          </Text>
        </View>

        <Text style={styles.heroTitle}>
          {text(item.greeting, section.title || 'Better health starts here')}
        </Text>

        <Text style={styles.heroSubtitle}>
          {text(
            item.subtitle,
            'Trusted care for you and your family, all in one place.',
          )}
        </Text>

        <TouchableOpacity
          activeOpacity={0.82}
          accessibilityRole="button"
          onPress={() => setSearch('')}
          style={styles.heroButton}>
          <Text style={[styles.heroButtonText, {color: theme.primary}]}>
            {text(item.actionLabel, 'Explore services')}  →
          </Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <Animated.View
        key={section.id}
        style={[
          styles.heroWrap,
          {
            opacity: entrance,
            transform: [
              {translateY: Animated.multiply(entrance, -10).interpolate({
                inputRange: [-10, 0],
                outputRange: [10, 0],
              })},
              {translateY: heroParallax},
            ],
          },
        ]}>
        {hasImage ? (
          <ImageBackground
            source={{uri: imageUrl}}
            resizeMode="cover"
            style={styles.hero}
            imageStyle={styles.heroImage}>
            <View style={styles.heroShade}>{content}</View>
          </ImageBackground>
        ) : (
          <View
            style={[
              styles.hero,
              {backgroundColor: theme.primary},
            ]}>
            <View
              style={[
                styles.heroOrb,
                {backgroundColor: theme.secondary},
              ]}
            />
            <View
              style={[
                styles.heroOrbSmall,
                {backgroundColor: theme.accent},
              ]}
            />
            {content}
            <Text style={styles.heroDecoration}>
              {isFestival ? '🪔' : '✚'}
            </Text>
          </View>
        )}
      </Animated.View>
    );
  };

  const renderCategories = (section: SectionConfig) => (
    <View key={section.id} style={styles.section}>
      {sectionHeading(section)}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContent}>
        {itemsOf(section).map((item, index) => {
          const label = text(item.label, text(item.name, 'Service'));

          return (
            <TouchableOpacity
              key={text(item.id, `${section.id}-${index}`)}
              activeOpacity={0.75}
              accessibilityRole="button"
              onPress={() => setSearch(label)}
              style={styles.categoryItem}>
              <View
                style={[
                  styles.categoryCircle,
                  {backgroundColor: theme.secondary},
                ]}>
                <Text style={styles.categoryIcon}>
                  {iconFor(text(item.icon))}
                </Text>
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.categoryLabel,
                  {color: theme.textPrimary},
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderQuickActions = (section: SectionConfig) => (
    <View key={section.id} style={styles.section}>
      {sectionHeading(section)}
      <View style={styles.quickGrid}>
        {itemsOf(section).map((item, index) => {
          const label = text(
            item.label,
            text(item.name, text(item.title, 'Explore')),
          );

          return (
            <TouchableOpacity
              key={text(item.id, `${section.id}-${index}`)}
              activeOpacity={0.78}
              accessibilityRole="button"
              onPress={() => setSearch(label)}
              style={[
                styles.quickCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.secondary,
                },
              ]}>
              <View
                style={[
                  styles.quickIconCircle,
                  {backgroundColor: theme.secondary},
                ]}>
                <Text style={styles.quickIcon}>
                  {iconFor(text(item.icon))}
                </Text>
              </View>
              <View style={styles.quickLabelRow}>
                <Text
                  style={[
                    styles.quickLabel,
                    {color: theme.textPrimary},
                  ]}>
                  {label}
                </Text>
                <Text style={[styles.cardArrow, {color: theme.primary}]}>
                  →
                </Text>
              </View>
              {Boolean(item.subtitle) && (
                <Text
                  style={[
                    styles.mutedText,
                    {color: theme.textSecondary},
                  ]}>
                  {text(item.subtitle)}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderServices = (section: SectionConfig) => (
    <View key={section.id} style={styles.section}>
      <View style={styles.headingRow}>
        {sectionHeading(section)}
        <Text style={[styles.viewAll, {color: theme.primary}]}>
          {search ? '' : 'Explore'}
        </Text>
      </View>

      <View style={styles.serviceGrid}>
        {itemsOf(section).map((item, index) => {
          const label = text(item.name, text(item.title, 'Health service'));
          const imageUrl = text(item.imageUrl, text(item.photoUrl));
          const price = number(item.priceInr, number(item.feeInr));
          const badge = text(item.badge);

          return (
            <TouchableOpacity
              key={text(item.id, `${section.id}-${index}`)}
              activeOpacity={0.82}
              accessibilityRole="button"
              onPress={() => setSearch(label)}
              style={[
                styles.serviceCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.secondary,
                },
              ]}>
              <View style={styles.serviceImageWrap}>
                {imageUrl ? (
                  <Image
                    source={{uri: imageUrl}}
                    resizeMode="cover"
                    style={styles.serviceImage}
                  />
                ) : (
                  <View
                    style={[
                      styles.serviceImageFallback,
                      {backgroundColor: theme.secondary},
                    ]}>
                    <Text style={styles.serviceFallbackIcon}>
                      {iconFor(text(item.icon, 'heart'))}
                    </Text>
                    <View
                      style={[
                        styles.imageSparkle,
                        {backgroundColor: theme.accent},
                      ]}
                    />
                  </View>
                )}

                {badge ? (
                  <View
                    style={[
                      styles.serviceBadge,
                      {backgroundColor: theme.accent},
                    ]}>
                    <Text
                      style={[
                        styles.serviceBadgeText,
                        {color: theme.textPrimary},
                      ]}>
                      {badge}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text
                numberOfLines={2}
                style={[
                  styles.serviceTitle,
                  {color: theme.textPrimary},
                ]}>
                {label}
              </Text>

              <View style={styles.priceRow}>
                <Text style={[styles.price, {color: theme.primary}]}>
                  {price > 0 ? money(price) : 'View details'}
                </Text>
                <View
                  style={[
                    styles.priceArrow,
                    {backgroundColor: theme.secondary},
                  ]}>
                  <Text style={{color: theme.primary}}>↗</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderDoctors = (section: SectionConfig) => (
    <View key={section.id} style={styles.section}>
      {sectionHeading(section)}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContent}>
        {itemsOf(section).map((item, index) => {
          const name = text(item.name, 'Doctor');
          const photo = text(item.photoUrl, text(item.imageUrl));

          return (
            <TouchableOpacity
              key={text(item.id, `${section.id}-${index}`)}
              activeOpacity={0.82}
              accessibilityRole="button"
              onPress={() => setSearch(name)}
              style={[
                styles.doctorCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.secondary,
                },
              ]}>
              <View
                style={[
                  styles.doctorPhotoWrap,
                  {backgroundColor: theme.secondary},
                ]}>
                {photo ? (
                  <Image
                    source={{uri: photo}}
                    style={styles.doctorPhoto}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.doctorEmoji}>👨‍⚕️</Text>
                )}
                <View style={styles.availableDot} />
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.doctorName,
                  {color: theme.textPrimary},
                ]}>
                {name}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.doctorSpecialty,
                  {color: theme.textSecondary},
                ]}>
                {text(item.specialty, 'General Physician')}
              </Text>

              <View
                style={[
                  styles.slotPill,
                  {backgroundColor: theme.secondary},
                ]}>
                <Text style={[styles.slotText, {color: theme.primary}]}>
                  ◷ {text(item.nextSlot, 'Slots available')}
                </Text>
              </View>

              <Text style={[styles.doctorFee, {color: theme.primary}]}>
                {money(number(item.feeInr))}
                <Text style={[styles.feeSuffix, {color: theme.textSecondary}]}>
                  {' '} / visit
                </Text>
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderOffer = (section: SectionConfig) => {
    const item = itemsOf(section)[0] ?? {};

    return (
      <View
        key={section.id}
        style={[
          styles.offerCard,
          {backgroundColor: theme.secondary},
        ]}>
        <View style={styles.offerIconCircle}>
          <Text style={styles.offerIcon}>
            {text(item.icon, isFestival ? '🪔' : '💚')}
          </Text>
        </View>
        <View style={styles.offerCopy}>
          <Text style={[styles.offerTitle, {color: theme.textPrimary}]}>
            {text(item.title, section.title || 'A little care goes a long way')}
          </Text>
          <Text style={[styles.offerSubtitle, {color: theme.textSecondary}]}>
            {text(
              item.message,
              text(item.subtitle, 'Make time for your health this week.'),
            )}
          </Text>
        </View>
        <Text style={[styles.offerArrow, {color: theme.primary}]}>→</Text>
      </View>
    );
  };

  const renderSection = (section: SectionConfig) => {
    switch (section.type) {
      case 'hero_banner':
        return renderHero(section);
      case 'category_chips':
        return renderCategories(section);
      case 'quick_actions':
        return renderQuickActions(section);
      case 'service_grid':
        return renderServices(section);
      case 'doctor_carousel':
        return renderDoctors(section);
      case 'offer_strip':
        return renderOffer(section);
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right', 'bottom']}
      style={[styles.screen, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={isFestival ? 'dark-content' : 'dark-content'}
        // backgroundColor={theme.background}
      />

      <Animated.View
        style={[
          styles.topBar,
          {
            backgroundColor: theme.background,
            transform: [{scale: headerScale}],
          },
        ]}>
        <View style={styles.brandMark}>
          <View
            style={[styles.brandMarkInner, {backgroundColor: theme.primary}]}>
            <Text style={styles.brandMarkText}>+</Text>
          </View>
          <View>
            <Text style={[styles.brandName, {color: theme.textPrimary}]}>
              Tapza<Text style={{color: theme.primary}}>Care</Text>
            </Text>
            <Text style={[styles.brandCaption, {color: theme.textSecondary}]}>
              YOUR HEALTH COMPANION
            </Text>
          </View>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Switch app theme"
          disabled={loadingConfig}
          onPress={() =>
            void onSwitchMode(isFestival ? 'normal' : 'festival')
          }
          activeOpacity={0.75}
          style={[
            styles.themeButton,
            {backgroundColor: theme.secondary},
          ]}>
          {loadingConfig ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <Text style={[styles.themeButtonText, {color: theme.primary}]}>
              {isFestival ? '🌿 Normal' : '🪔 Festival'}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <View style={styles.greetingBlock}>
          <View style={{flex: 1}}>
            <Text style={[styles.eyebrow, {color: theme.primary}]}>
              {isFestival ? 'CELEBRATE WELLNESS ✨' : 'A HEALTHIER YOU STARTS HERE'}
            </Text>
            <Text style={[styles.greeting, {color: theme.textPrimary}]}>
              {isFestival ? 'Care that feels like home.' : 'Hello there 👋'}
            </Text>
            <Text style={[styles.greetingSubtitle, {color: theme.textSecondary}]}>
              {text(festival?.greeting, 'Good health, without the hassle.')}
            </Text>
          </View>
          <View
            style={[
              styles.greetingAvatar,
              {backgroundColor: theme.secondary},
            ]}>
            <Text style={styles.greetingAvatarText}>
              {isFestival ? '🪔' : '💚'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.surface,
              borderColor: theme.secondary,
            },
          ]}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Doctors, tests, medicines..."
            placeholderTextColor={theme.textSecondary}
            accessibilityLabel="Search doctors, tests and medicines"
            returnKeyType="search"
            style={[styles.searchInput, {color: theme.textPrimary}]}
          />
          {search.length > 0 ? (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setSearch('')}
              style={styles.clearButton}>
              <Text style={{color: theme.primary}}>✕</Text>
            </TouchableOpacity>
          ) : (
            <View
              style={[styles.searchAction, {backgroundColor: theme.primary}]}>
              <Text style={styles.searchActionText}>⌕</Text>
            </View>
          )}
        </View>

        {configError ? (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => void onRetryConfig()}
            style={[
              styles.errorCard,
              {backgroundColor: theme.secondary},
            ]}>
            <Text style={{color: theme.textPrimary}}>
              {configError}  ·  Tap to retry
            </Text>
          </TouchableOpacity>
        ) : null}

        {filteredSections.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔎</Text>
            <Text style={[styles.emptyTitle, {color: theme.textPrimary}]}>
              No matching services
            </Text>
            <Text style={[styles.emptySubtitle, {color: theme.textSecondary}]}>
              Try another search term.
            </Text>
            <TouchableOpacity
              onPress={() => setSearch('')}
              style={[styles.resetButton, {backgroundColor: theme.primary}]}>
              <Text style={styles.resetButtonText}>Clear search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredSections.map((section, index) => (
            <Animated.View
              key={section.id}
              style={{
                opacity: entrance,
                transform: [
                  {
                    translateY: entrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [18 + index * 3, 0],
                    }),
                  },
                ],
              }}>
              {renderSection(section)}
            </Animated.View>
          ))
        )}

        <View style={styles.footer}>
          <Text style={styles.footerHeart}>♥</Text>
          <Text style={[styles.footerText, {color: theme.textSecondary}]}>
            Made for your family's wellbeing
          </Text>
          <Text style={[styles.footerCaption, {color: theme.textSecondary}]}>
            TAPZACARE  ·  CARE MADE SIMPLE
          </Text>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  topBar: {
    minHeight: 66,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  brandMark: {flexDirection: 'row', alignItems: 'center', gap: 10},
  brandMarkInner: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {color: '#FFFFFF', fontSize: 29, fontWeight: '700', lineHeight: 34},
  brandName: {fontSize: 19, fontWeight: '900', letterSpacing: -0.6},
  brandCaption: {fontSize: 8, fontWeight: '800', letterSpacing: 1.1, marginTop: 2},
  themeButton: {
    minHeight: 44,
    minWidth: 82,
    borderRadius: 15,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButtonText: {fontSize: 12, fontWeight: '800'},
  content: {paddingHorizontal: 18, paddingTop: 10, paddingBottom: 36},
  greetingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
    gap: 12,
  },
  eyebrow: {fontSize: 10, fontWeight: '900', letterSpacing: 1.15, marginBottom: 8},
  greeting: {fontSize: 27, fontWeight: '900', letterSpacing: -0.8},
  greetingSubtitle: {fontSize: 13, lineHeight: 19, marginTop: 5},
  greetingAvatar: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingAvatarText: {fontSize: 29},
  searchBar: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    paddingLeft: 15,
    paddingRight: 7,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.045,
    shadowRadius: 9,
  },
  searchIcon: {fontSize: 27, marginRight: 9},
  searchInput: {flex: 1, fontSize: 14, paddingVertical: 10},
  searchAction: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchActionText: {color: '#FFFFFF', fontSize: 24},
  clearButton: {width: 42, height: 44, alignItems: 'center', justifyContent: 'center'},
  errorCard: {padding: 14, borderRadius: 14, marginBottom: 20},
  heroWrap: {marginBottom: 28},
  hero: {
    minHeight: 220,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    padding: 22,
  },
  heroImage: {borderRadius: 25},
  heroShade: {
    flex: 1,
    minHeight: 220,
    justifyContent: 'center',
    padding: 22,
    backgroundColor: 'rgba(0,0,0,0.36)',
  },
  heroContent: {zIndex: 2, maxWidth: '88%'},
  heroPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: 13,
  },
  heroPillText: {color: '#FFFFFF', fontSize: 9, fontWeight: '900', letterSpacing: 1},
  heroTitle: {color: '#FFFFFF', fontSize: 27, lineHeight: 33, fontWeight: '900', letterSpacing: -0.5},
  heroSubtitle: {color: '#FFFFFF', fontSize: 13, lineHeight: 19, marginTop: 9, marginBottom: 17},
  heroButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    borderRadius: 13,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  heroButtonText: {fontSize: 12, fontWeight: '900'},
  heroOrb: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -60,
    top: -55,
    opacity: 0.17,
  },
  heroOrbSmall: {
    position: 'absolute',
    width: 95,
    height: 95,
    borderRadius: 48,
    right: 25,
    bottom: -50,
    opacity: 0.25,
  },
  heroDecoration: {position: 'absolute', right: 22, bottom: 20, fontSize: 45, opacity: 0.9},
  section: {marginBottom: 29},
  sectionHeading: {flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 9},
  headingAccent: {width: 4, height: 22, borderRadius: 4, backgroundColor: '#2F9D78'},
  sectionTitle: {fontSize: 19, fontWeight: '900', letterSpacing: -0.4, flexShrink: 1},
  headingRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  viewAll: {fontSize: 12, fontWeight: '800'},
  horizontalContent: {gap: 14, paddingRight: 5},
  categoryItem: {width: 76, alignItems: 'center'},
  categoryCircle: {
    width: 65,
    height: 65,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  categoryIcon: {fontSize: 27},
  categoryLabel: {fontSize: 11, fontWeight: '800', textAlign: 'center'},
  quickGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  quickCard: {
    width: '47%',
    flexGrow: 1,
    flexBasis: '40%',
    minHeight: 122,
    padding: 14,
    borderRadius: 19,
    borderWidth: 1,
  },
  quickIconCircle: {width: 43, height: 43, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 12},
  quickIcon: {fontSize: 22},
  quickLabelRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4},
  quickLabel: {fontSize: 13, fontWeight: '800', flexShrink: 1},
  cardArrow: {fontSize: 17, fontWeight: '800'},
  mutedText: {fontSize: 11, lineHeight: 16, marginTop: 5},
  serviceGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  serviceCard: {
    width: '47%',
    flexGrow: 1,
    flexBasis: '40%',
    padding: 10,
    borderRadius: 19,
    borderWidth: 1,
    minHeight: 200,
  },
  serviceImageWrap: {position: 'relative', marginBottom: 11},
  serviceImage: {width: '100%', height: 105, borderRadius: 13},
  serviceImageFallback: {height: 105, borderRadius: 13, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  serviceFallbackIcon: {fontSize: 36},
  imageSparkle: {position: 'absolute', width: 20, height: 20, borderRadius: 10, top: 10, right: 10, opacity: 0.85},
  serviceBadge: {position: 'absolute', top: 7, left: 7, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8},
  serviceBadgeText: {fontSize: 9, fontWeight: '900'},
  serviceTitle: {fontSize: 13, lineHeight: 18, fontWeight: '800', minHeight: 36},
  priceRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8},
  price: {fontSize: 15, fontWeight: '900'},
  priceArrow: {width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
  doctorCard: {width: 205, borderRadius: 20, padding: 12, borderWidth: 1},
  doctorPhotoWrap: {height: 125, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden'},
  doctorPhoto: {width: '100%', height: '100%'},
  doctorEmoji: {fontSize: 48},
  availableDot: {position: 'absolute', right: 9, top: 9, width: 11, height: 11, borderRadius: 6, backgroundColor: '#35B779', borderWidth: 2, borderColor: '#FFFFFF'},
  doctorName: {fontSize: 14, fontWeight: '900'},
  doctorSpecialty: {fontSize: 11, marginTop: 4},
  slotPill: {alignSelf: 'flex-start', borderRadius: 9, paddingHorizontal: 8, paddingVertical: 7, marginTop: 10},
  slotText: {fontSize: 10, fontWeight: '800'},
  doctorFee: {fontSize: 15, fontWeight: '900', marginTop: 10},
  feeSuffix: {fontSize: 10, fontWeight: '500'},
  offerCard: {flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, gap: 12, marginBottom: 27},
  offerIconCircle: {width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.65)', alignItems: 'center', justifyContent: 'center'},
  offerIcon: {fontSize: 24},
  offerCopy: {flex: 1},
  offerTitle: {fontSize: 14, fontWeight: '900'},
  offerSubtitle: {fontSize: 11, lineHeight: 16, marginTop: 4},
  offerArrow: {fontSize: 22, fontWeight: '800'},
  emptyState: {alignItems: 'center', paddingVertical: 45},
  emptyIcon: {fontSize: 40, marginBottom: 12},
  emptyTitle: {fontSize: 18, fontWeight: '900'},
  emptySubtitle: {fontSize: 13, marginTop: 6},
  resetButton: {marginTop: 16, minHeight: 44, paddingHorizontal: 20, borderRadius: 13, justifyContent: 'center'},
  resetButtonText: {color: '#FFFFFF', fontWeight: '800'},
  footer: {alignItems: 'center', paddingTop: 9, paddingBottom: 14},
  footerHeart: {fontSize: 18, color: '#2F9D78', marginBottom: 5},
  footerText: {fontSize: 12, fontWeight: '700'},
  footerCaption: {fontSize: 9, fontWeight: '800', letterSpacing: 1.3, marginTop: 8},
});
