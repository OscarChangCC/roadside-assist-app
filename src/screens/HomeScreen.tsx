import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getTenant } from '../tenants';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const tenant = getTenant();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tenant.secondaryColor }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header / Branding */}
      <View style={styles.header}>
        {tenant.logoImage ? (
          <Image source={tenant.logoImage} style={styles.logoImage} resizeMode="contain" />
        ) : (
          <View style={[styles.logoCircle, { backgroundColor: tenant.primaryColor }]}>
            <Text style={styles.logoText}>{tenant.logoText}</Text>
          </View>
        )}
        <Text style={styles.tagline}>{tenant.tagline}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: tenant.primaryColor }]}
          onPress={() => Linking.openURL(`tel:${tenant.hotlineNumber}`)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Call Hotline"
        >
          <Text style={styles.primaryButtonText}>📞 Call Hotline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.outlineButton, { borderColor: tenant.primaryColor }]}
          onPress={() => navigation.navigate('BreakdownForm')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Breakdown Assistance"
        >
          <Text style={[styles.outlineButtonText, { color: tenant.primaryColor }]}>
            🔧 Breakdown Assistance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.outlineButton, { borderColor: tenant.primaryColor }]}
          onPress={() => navigation.navigate('AccidentForm')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Accident Hotline"
        >
          <Text style={[styles.outlineButtonText, { color: tenant.primaryColor }]}>
            🚨 Accident Hotline
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logoImage: {
    width: 160,
    height: 80,
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  insurerName: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  buttonsContainer: {
    flex: 2,
    paddingHorizontal: 24,
    gap: 16,
    justifyContent: 'center',
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  outlineButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    paddingBottom: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
});
