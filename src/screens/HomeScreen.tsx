import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { getTenant } from '../tenants';
import CallConfirmModal from '../components/CallConfirmModal';

type ModalState = {
  visible: boolean;
  label: string;
  number: string;
};

const MODAL_CLOSED: ModalState = { visible: false, label: '', number: '' };

export default function HomeScreen() {
  const tenant = getTenant();
  const [modal, setModal] = useState<ModalState>(MODAL_CLOSED);

  const openModal = (label: string, number: string) => {
    setModal({ visible: true, label, number });
  };

  const closeModal = () => setModal(MODAL_CLOSED);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: tenant.secondaryColor }]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header / Branding */}
      <View style={styles.header}>
        <View
          style={[styles.logoCircle, { backgroundColor: tenant.primaryColor }]}
        >
          <Text style={styles.logoText}>{tenant.logoText}</Text>
        </View>
        <Text style={[styles.insurerName, { color: tenant.primaryColor }]}>
          {tenant.name}
        </Text>
        <Text style={styles.tagline}>{tenant.tagline}</Text>
      </View>

      {/* Call Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.callButton, { backgroundColor: tenant.primaryColor }]}
          onPress={() =>
            openModal(tenant.breakdown.label, tenant.breakdown.number)
          }
          activeOpacity={0.85}
          accessibilityLabel={`${tenant.breakdown.label}: ${tenant.breakdown.number}`}
          accessibilityRole="button"
        >
          <Text style={styles.callButtonIcon}>🔧</Text>
          <Text style={styles.callButtonLabel}>{tenant.breakdown.label}</Text>
          <Text style={styles.callButtonNumber}>{tenant.breakdown.number}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.callButton, { backgroundColor: tenant.primaryColor }]}
          onPress={() =>
            openModal(tenant.accident.label, tenant.accident.number)
          }
          activeOpacity={0.85}
          accessibilityLabel={`${tenant.accident.label}: ${tenant.accident.number}`}
          accessibilityRole="button"
        >
          <Text style={styles.callButtonIcon}>🚨</Text>
          <Text style={styles.callButtonLabel}>{tenant.accident.label}</Text>
          <Text style={styles.callButtonNumber}>{tenant.accident.number}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by RoadsideAssist</Text>
      </View>

      <CallConfirmModal
        visible={modal.visible}
        label={modal.label}
        number={modal.number}
        primaryColor={tenant.primaryColor}
        onClose={closeModal}
      />
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
  callButton: {
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  callButtonIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  callButtonLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  callButtonNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
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
