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
  CircleF,
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
  updateRefs: (
    address: string,
    area: string,
    location: itemLocation,
    id: string,
  ) => void;
  Servicemode?: boolean;
  radius?: number;
}
const MyComponent = forwardRef(
  ({ updateRefs, Servicemode, radius = 100 }: componentProps, ref) => {
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: 'AIzaSyCyEOR1xDs3hKK8L6X13IQyH99QfhXjcWk', // Replace with your actual API key
      libraries: libraries,
    });
    const {
      providerAddressInfo: { location },
    } = useProviderStore();
    const [selectedCircle, setSelectedCircle] =
      useState<google.maps.Circle | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedLocation, setSelectedLocation] =
      useState<itemLocation>(center);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(
      null,
    );
    //   const AreaRef = useRef<HTMLInputElement | null>(null);
    //   const ArabicRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => {
      {
        onPlaceSelected;
      }
    });
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
        const id = place?.place_id;

        const location: itemLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setSelectedLocation(location);
        map?.panTo(location);
        if (selectedCircle) {
          selectedCircle.setMap(null);
        }

        // Create a new circle around the selected location
        const circle = new window.google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: location,
          radius, // Specify the radius in meters
        });

        setSelectedCircle(circle);
        const address = place.formatted_address || '';
        const area = getAddressComponent(place, 'locality') || '';
        updateRefs(address, area, location, id as string);
        console.log('Location', location);
        //   AreaRef.current!.value = area;
      }
    }, [map, location, radius]);
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
          updateRefs(
            address,
            area,
            newSelectedPlace,
            location.lat.toString() + location.lng.toString(),
          );
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
              className="w-full absolute top-0 z-99999 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </Autocomplete>
        </GoogleMap>
      </div>
    ) : null;
    // </LoadScript>
  },
);

export default MyComponent;
