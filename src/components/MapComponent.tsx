import React, {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  Autocomplete,
  LoadScript,
  type Libraries,
} from '@react-google-maps/api';
import useProviderStore from '../store/useProviderStore';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const libraries: Libraries = ['places', 'marker'];
interface componentProps {
  updateRefs: (address: string, area: string, location: itemLocation) => void;
}
const MyComponent = ({ updateRefs }: componentProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCyEOR1xDs3hKK8L6X13IQyH99QfhXjcWk', // Replace with your actual API key
    libraries: libraries,
  });
  const {
    providerAddressInfo: { location },
  } = useProviderStore();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<itemLocation>(center);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  //   const AreaRef = useRef<HTMLInputElement | null>(null);
  //   const ArabicRef = useRef<HTMLInputElement | null>(null);
  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);
  const getAddressComponent = (
    place: google.maps.places.PlaceResult,
    type: string,
  ) => {
    const result = place.address_components?.find((component) =>
      component.types.includes(type),
    );
    return result?.long_name || '';
  };
  const onPlaceSelected = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();

    if (place && place.geometry?.location) {
      const location: itemLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedLocation(location);
      map?.panTo(location);
      const address = place.formatted_address || '';
      const area = getAddressComponent(place, 'locality') || '';
      updateRefs(address, area, location);
      console.log('Location', location);
      //   AreaRef.current!.value = area;
    }
  }, [map]);
  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    const newSelectedPlace = {
      lat: e.latLng!.lat(),
      lng: e.latLng!.lng(),
    };
    setSelectedLocation(newSelectedPlace);

    // Reverse geocode the marker's position to get address and area information
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newSelectedPlace }, (results, status) => {
      if (status === 'OK' && results![0]) {
        const address = results![0].formatted_address;
        const area = getAddressComponent(results![0], 'locality') || '';
        updateRefs(address, area, newSelectedPlace);
        console.log('New Selected Place', newSelectedPlace);
        console.log('Address:', address);
        console.log('Area:', area);
        // Use the address and area as needed
      }
    });
  };
  React.useEffect(() => {
    // Handle initial centering of the map based on providerLocation or defaultCenter
    if (map && location) {
      map.panTo(location);
      setSelectedLocation(location);
    } else {
      map?.panTo(selectedLocation);
      setSelectedLocation(selectedLocation);
    }
  }, [map, location]);
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);
  return isLoaded ? (
    <div className="w-92 h-96">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location ? location : selectedLocation}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <MarkerF
          position={location ? location : selectedLocation}
          visible
          zIndex={20}
          draggable
          onDragEnd={handleMarkerDragEnd}
        />

        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={onPlaceSelected}
        >
          <input
            type="text"
            placeholder="Search for a location"
            style={{
              boxSizing: 'border-box',
              border: '1px solid black',
              width: '240px',
              height: '32px',
              padding: '0 12px',
              borderRadius: '3px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              outline: 'none',
              textOverflow: 'ellipsis',
              position: 'absolute', // Add this line to fix the input visibility issue
              zIndex: 2, // Add this line to fix the input visibility issue
              top: 10,
              left: 330,
              color: 'black',
            }}
          />
        </Autocomplete>
      </GoogleMap>
    </div>
  ) : null;
  // </LoadScript>
};

export default React.memo(MyComponent);
