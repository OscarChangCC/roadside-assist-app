import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getTenant } from '../tenants';
import LocationPicker from '../components/LocationPicker';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'BreakdownForm'>;

type LocationState = { lat?: string; lng?: string; text?: string };

export default function BreakdownFormScreen({ navigation }: Props) {
  const tenant = getTenant();
  const [vehicleReg, setVehicleReg] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState<LocationState>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!vehicleReg.trim()) {
      Alert.alert('Missing Field', 'Please enter your vehicle number.');
      return;
    }
    if (!contactNumber.trim()) {
      Alert.alert('Missing Field', 'Please enter your contact number.');
      return;
    }

    setSubmitting(true);
    try {
      const params: Record<string, string> = {
        contact_number: contactNumber.trim(),
        insurer: tenant.insurerCode,
        vehicle_reg_num: vehicleReg.trim(),
        ticket_type: 'Breakdown',
      };
      if (location.lat) params.lat = location.lat;
      if (location.lng) params.lng = location.lng;

      const response = await fetch(`${tenant.apiBaseUrl}/api/create_new_ticket/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(params).toString(),
      });
      const data = await response.json();
      if (data.results === true) {
        Alert.alert(
          'Request Submitted!',
          `Ticket #${data.ticket_id} created. Help is on the way.`,
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }],
        );
      } else {
        throw new Error('API returned failure');
      }
    } catch {
      Alert.alert('Submission Failed', 'Please call the hotline instead.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.sectionLabel, { color: tenant.primaryColor }]}>Vehicle Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. WXY1234"
            value={vehicleReg}
            onChangeText={(t) => setVehicleReg(t.toUpperCase())}
            autoCapitalize="characters"
          />

          <Text style={[styles.sectionLabel, { color: tenant.primaryColor }]}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. +60123456789"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />

          <Text style={[styles.sectionLabel, { color: tenant.primaryColor }]}>Location</Text>
          <LocationPicker primaryColor={tenant.primaryColor} onLocationChange={setLocation} />

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: tenant.primaryColor },
              submitting && styles.disabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting…' : 'Submit Breakdown Request'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 20,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  disabled: {
    opacity: 0.6,
  },
});
