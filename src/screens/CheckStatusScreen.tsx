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
import { getTenant } from '../tenants';

type TicketResult = {
  found: true;
  ticket_id: number | string;
  status: string;
  vehicle_reg_num: string;
  created_at: string;
  tow_from_address?: string;
  assigned_agent?: string;
};

type ApiResponse = TicketResult | { found: false };

function getStatusColor(status: string, primaryColor: string): string {
  if (status.includes('In Progress')) return primaryColor;
  if (status.includes('Open')) return '#F59E0B';
  if (status.includes('Completed') || status.includes('Closed')) return '#10B981';
  if (status.includes('Cancelled')) return '#94A3B8';
  return '#94A3B8';
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function CheckStatusScreen() {
  const tenant = getTenant();
  const [contactNumber, setContactNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const handleCheck = async () => {
    if (!contactNumber.trim()) {
      Alert.alert('Missing Field', 'Please enter your contact number.');
      return;
    }
    if (!vehicleNumber.trim()) {
      Alert.alert('Missing Field', 'Please enter your vehicle number.');
      return;
    }
    setChecking(true);
    setResult(null);
    try {
      const params = new URLSearchParams({
        contact_number: contactNumber.trim(),
        vehicle_reg_num: vehicleNumber.trim(),
      });
      const response = await fetch(
        `${tenant.apiBaseUrl}/api/get_ticket_status/?${params.toString()}`,
        {
          headers: { 'X-API-Key': tenant.apiKey },
        },
      );
      const data: ApiResponse = await response.json();
      setResult(data);
    } catch {
      Alert.alert('Error', 'Could not reach server. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const ticket = result && result.found ? (result as TicketResult) : null;
  const statusColor = ticket ? getStatusColor(ticket.status, tenant.primaryColor) : '#94A3B8';

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
          <Text style={[styles.label, { color: tenant.primaryColor }]}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. +60123456789"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />

          <Text style={[styles.label, { color: tenant.primaryColor }]}>Vehicle Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. WXY1234"
            value={vehicleNumber}
            onChangeText={(t) => setVehicleNumber(t.toUpperCase())}
            autoCapitalize="characters"
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: tenant.primaryColor },
              checking && styles.disabled,
            ]}
            onPress={handleCheck}
            disabled={checking}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>
              {checking ? 'Checking…' : 'Check Status'}
            </Text>
          </TouchableOpacity>

          {result !== null && !result.found && (
            <View style={styles.notFoundCard}>
              <Text style={styles.notFoundText}>
                No active ticket found for this vehicle and contact number.
              </Text>
            </View>
          )}

          {ticket && (
            <View style={styles.resultCard}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketId}>Ticket #{ticket.ticket_id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusBadgeText}>{ticket.status}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Vehicle</Text>
                <Text style={styles.rowValue}>{ticket.vehicle_reg_num}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Created</Text>
                <Text style={styles.rowValue}>{formatDate(ticket.created_at)}</Text>
              </View>

              {!!ticket.tow_from_address && (
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Tow From</Text>
                  <Text style={styles.rowValue}>{ticket.tow_from_address}</Text>
                </View>
              )}

              {!!ticket.assigned_agent && (
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Agent</Text>
                  <Text style={styles.rowValue}>{ticket.assigned_agent}</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  flex: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 48 },
  label: {
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
  submitButtonText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  disabled: { opacity: 0.6 },
  notFoundCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  notFoundText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ticketId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    width: 80,
  },
  rowValue: {
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
    textAlign: 'right',
  },
});
