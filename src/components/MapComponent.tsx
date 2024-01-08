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
  Marker,
  Autocomplete,
  LoadScript,
  type Libraries,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

interface Location {
  lat: number;
  lng: number;
}

let libraries = ['places', 'marker'];
interface componentProps {
  updateRefs: (address: string, area: string) => void;
}
const MyComponent = ({ updateRefs }: componentProps) => {
  //   const { isLoaded } = useJsApiLoader({
  //     id: 'google-map-script',
  //     googleMapsApiKey: 'AIzaSyCyEOR1xDs3hKK8L6X13IQyH99QfhXjcWk', // Replace with your actual API key
  //   });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [loaded, setLoaded] = useState<boolean>(false);
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
      const location: Location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedLocation(location);
      map?.panTo(location);
      const address = place.formatted_address || '';
      const area = getAddressComponent(place, 'locality') || '';

      updateRefs(address, area);
      //   AreaRef.current!.value = area;
    }
  }, [map]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCyEOR1xDs3hKK8L6X13IQyH99QfhXjcWk"
      libraries={libraries as Libraries}
      // Add this line to include the "places" library
      onLoad={() => setLoaded(true)}
      onUnmount={onUnmount}
    >
      {loaded && (
        <div className="w-92 h-90">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            {selectedLocation && (
              <Marker position={selectedLocation} visible zIndex={20} />
            )}

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
      )}
    </LoadScript>
  );
};

export default React.memo(MyComponent);
