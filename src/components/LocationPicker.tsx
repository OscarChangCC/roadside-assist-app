import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';

type LocationValue = {
  lat?: string;
  lng?: string;
  text?: string;
};

type Props = {
  primaryColor: string;
  onLocationChange: (location: LocationValue) => void;
};

export default function LocationPicker({ primaryColor, onLocationChange }: Props) {
  const [mode, setMode] = useState<'gps' | 'manual'>('gps');
  const [gpsStatus, setGpsStatus] = useState<string>('Tap to get your location');
  const [loadingGps, setLoadingGps] = useState(false);
  const [manualText, setManualText] = useState('');

  const handleGps = async () => {
    setLoadingGps(true);
    setGpsStatus('Getting location…');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsStatus('Location permission denied');
        onLocationChange({});
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = pos.coords;
      const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = [geo.street, geo.city, geo.region, geo.country]
        .filter(Boolean)
        .join(', ');
      setGpsStatus(address || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      onLocationChange({ lat: String(latitude), lng: String(longitude), text: address });
    } catch {
      setGpsStatus('Could not get location');
      Alert.alert('Location Error', 'Unable to get GPS location. Please enter manually.');
      onLocationChange({});
    } finally {
      setLoadingGps(false);
    }
  };

  const handleManualChange = (text: string) => {
    setManualText(text);
    onLocationChange({ text });
  };

  const switchMode = (next: 'gps' | 'manual') => {
    setMode(next);
    if (next === 'gps') {
      setGpsStatus('Tap to get your location');
      onLocationChange({});
    } else {
      setManualText('');
      onLocationChange({});
    }
  };

  return (
    <View>
      {/* Toggle */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            styles.toggleLeft,
            mode === 'gps'
              ? { backgroundColor: primaryColor }
              : { backgroundColor: '#fff', borderColor: primaryColor },
          ]}
          onPress={() => switchMode('gps')}
        >
          <Text style={[styles.toggleText, { color: mode === 'gps' ? '#fff' : primaryColor }]}>
            Use My Location
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            styles.toggleRight,
            mode === 'manual'
              ? { backgroundColor: primaryColor }
              : { backgroundColor: '#fff', borderColor: primaryColor },
          ]}
          onPress={() => switchMode('manual')}
        >
          <Text style={[styles.toggleText, { color: mode === 'manual' ? '#fff' : primaryColor }]}>
            Enter Manually
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {mode === 'gps' ? (
        <TouchableOpacity
          style={[styles.gpsButton, { borderColor: primaryColor }]}
          onPress={handleGps}
          disabled={loadingGps}
        >
          {loadingGps ? (
            <ActivityIndicator color={primaryColor} />
          ) : (
            <Text style={[styles.gpsButtonText, { color: primaryColor }]}>📍 Get GPS Location</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter your location"
          value={manualText}
          onChangeText={handleManualChange}
          multiline
        />
      )}

      {mode === 'gps' && (
        <Text style={styles.gpsStatus}>{gpsStatus}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  toggleLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  toggleRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gpsButton: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  gpsButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  gpsStatus: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 56,
  },
});
