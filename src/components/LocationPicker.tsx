import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type LocationValue = {
  lat?: string;
  lng?: string;
  text?: string;
};

type SelectedLocation = {
  lat: string;
  lng: string;
  label: string;
};

type Props = {
  primaryColor: string;
  googleMapsApiKey: string;
  onLocationChange: (location: LocationValue) => void;
};

export default function LocationPicker({ primaryColor, googleMapsApiKey, onLocationChange }: Props) {
  const [mode, setMode] = useState<'gps' | 'autocomplete'>('gps');
  const [gpsStatus, setGpsStatus] = useState<string>('Tap to get your location');
  const [loadingGps, setLoadingGps] = useState(false);
  const [selected, setSelected] = useState<SelectedLocation | null>(null);

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
      const label = address || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      setGpsStatus(label);
      setSelected({ lat: String(latitude), lng: String(longitude), label });
      onLocationChange({ lat: String(latitude), lng: String(longitude), text: address });
    } catch {
      setGpsStatus('Could not get location');
      Alert.alert('Location Error', 'Unable to get GPS location. Please search manually.');
      onLocationChange({});
    } finally {
      setLoadingGps(false);
    }
  };

  const switchMode = (next: 'gps' | 'autocomplete') => {
    setMode(next);
    setSelected(null);
    if (next === 'gps') {
      setGpsStatus('Tap to get your location');
    }
    onLocationChange({});
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
            mode === 'autocomplete'
              ? { backgroundColor: primaryColor }
              : { backgroundColor: '#fff', borderColor: primaryColor },
          ]}
          onPress={() => switchMode('autocomplete')}
        >
          <Text style={[styles.toggleText, { color: mode === 'autocomplete' ? '#fff' : primaryColor }]}>
            Search Address
          </Text>
        </TouchableOpacity>
      </View>

      {/* GPS mode */}
      {mode === 'gps' && (
        <>
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
          <Text style={styles.gpsStatus}>{gpsStatus}</Text>
        </>
      )}

      {/* Autocomplete mode */}
      {mode === 'autocomplete' && (
        <GooglePlacesAutocomplete
          placeholder="Search address..."
          query={{ key: googleMapsApiKey, language: 'en', components: 'country:my' }}
          fetchDetails={true}
          onPress={(data, details) => {
            if (!details?.geometry?.location) return;
            const { lat, lng } = details.geometry.location;
            const loc: SelectedLocation = {
              lat: String(lat),
              lng: String(lng),
              label: data.description,
            };
            setSelected(loc);
            onLocationChange({ lat: String(lat), lng: String(lng), text: data.description });
          }}
          styles={{
            textInput: {
              borderWidth: 1,
              borderColor: '#CBD5E1',
              borderRadius: 10,
              fontSize: 16,
              backgroundColor: '#fff',
              paddingHorizontal: 12,
            },
            container: { flex: 0 },
          }}
          enablePoweredByContainer={false}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* Map after selection */}
      {selected !== null && (
        <>
          <MapView
            style={styles.map}
            region={{
              latitude: parseFloat(selected.lat),
              longitude: parseFloat(selected.lng),
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(selected.lat),
                longitude: parseFloat(selected.lng),
              }}
              title="Incident Location"
              description={selected.label}
            />
          </MapView>
          <Text style={styles.addressLabel}>{selected.label}</Text>
        </>
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
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
  addressLabel: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 6,
  },
});
