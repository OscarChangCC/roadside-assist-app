import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';

type Props = {
  visible: boolean;
  label: string;
  number: string;
  primaryColor: string;
  onClose: () => void;
};

export default function CallConfirmModal({
  visible,
  label,
  number,
  primaryColor,
  onClose,
}: Props) {
  const handleCall = () => {
    onClose();
    Linking.openURL(`tel:${number}`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <Text style={styles.title}>Confirm Call</Text>
        <Text style={styles.body}>
          Calling{' '}
          <Text style={[styles.bold, { color: primaryColor }]}>{label}</Text>
          {'\n'}at{' '}
          <Text style={styles.bold}>{number}</Text>
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            accessibilityLabel="Cancel call"
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.callButton, { backgroundColor: primaryColor }]}
            onPress={handleCall}
            accessibilityLabel={`Call ${label} now`}
          >
            <Text style={styles.callText}>Call Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 28,
  },
  bold: {
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  callButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  callText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
