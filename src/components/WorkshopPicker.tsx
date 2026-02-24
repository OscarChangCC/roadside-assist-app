import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { getWorkshops, Workshop } from '../services/workshopService';

type WorkshopPickerProps = {
  primaryColor: string;
  selectedWorkshop: string;
  onSelect: (name: string) => void;
};

export default function WorkshopPicker({
  primaryColor,
  selectedWorkshop,
  onSelect,
}: WorkshopPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getWorkshops();
      if (data.length === 0) {
        setError(true);
      } else {
        setWorkshops(data);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (modalVisible && workshops.length === 0 && !loading) {
      load();
    }
  }, [modalVisible, workshops.length, loading, load]);

  const filtered = query.trim()
    ? workshops.filter((w) => {
        const haystack =
          `${w.name} ${w.state} ${w.address}`.toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
      })
    : workshops;

  const handleSelect = (name: string) => {
    onSelect(name);
    setModalVisible(false);
    setQuery('');
  };

  const handleClose = () => {
    setModalVisible(false);
    setQuery('');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.75}
      >
        <Text style={[styles.triggerText, !selectedWorkshop && styles.placeholder]}>
          {selectedWorkshop || 'Select a Workshop'}
        </Text>
        <Text style={[styles.chevron, { color: primaryColor }]}>›</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <SafeAreaView style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Workshop</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or state..."
              value={query}
              onChangeText={setQuery}
              autoFocus
              clearButtonMode="while-editing"
              returnKeyType="search"
            />
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={primaryColor} />
            </View>
          ) : error ? (
            <TouchableOpacity style={styles.center} onPress={load}>
              <Text style={styles.errorText}>
                Could not load workshops. Tap to retry.
              </Text>
            </TouchableOpacity>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item.name)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSub}>
                    {item.state}
                    {item.address ? ` · ${item.address}` : ''}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.center}>
                  <Text style={styles.emptyText}>No workshops found.</Text>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triggerText: {
    fontSize: 16,
    color: '#0F172A',
    flex: 1,
  },
  placeholder: {
    color: '#94A3B8',
  },
  chevron: {
    fontSize: 22,
    lineHeight: 24,
    marginLeft: 8,
  },
  modal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#64748B',
  },
  searchWrapper: {
    margin: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: '#EF4444',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#94A3B8',
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  itemSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
});
