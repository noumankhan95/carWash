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
  PolygonF,
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
const MyComponent = ({
  updateRefs,
  Servicemode,
  radius = 100,
}: componentProps) => {
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
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  //   const AreaRef = useRef<HTMLInputElement | null>(null);
  //   const ArabicRef = useRef<HTMLInputElement | null>(null);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);
    },
    [center],
  );
  const getAddressComponent = (
    place: google.maps.places.PlaceResult,
    type: string,
  ) => {
    const result = place.address_components?.find((component) =>
      component.types.includes(type),
    );
    return result?.long_name || '';
  };
  function getCoordinatesFromBounds(bounds: google.maps.LatLngBounds) {
    const northeast = bounds.getNorthEast();
    const southwest = bounds.getSouthWest();
    return [
      { lat: northeast.lat(), lng: northeast.lng() },
      { lat: northeast.lat(), lng: southwest.lng() },
      { lat: southwest.lat(), lng: southwest.lng() },
      { lat: southwest.lat(), lng: northeast.lng() },
    ];
  }
  const generatePolygon = (address: any) => {
    const autocompleteService = new google.maps.places.AutocompleteService();
    const query = address; // Replace with the user's input or selected location
    autocompleteService.getPlacePredictions(
      { input: query },
      (predictions, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          predictions &&
          predictions.length > 0
        ) {
          // Get details for the first prediction (assuming user selects the first suggestion)
          const placeId = predictions[0].place_id;

          // Initialize the PlacesService to get details for the selected place
          const placesService = new google.maps.places.PlacesService(
            document.createElement('div'),
          );
          placesService.getDetails({ placeId }, (place, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              place &&
              place.geometry
            ) {
              const boundaries = place.geometry.viewport
                ? getCoordinatesFromBounds(place.geometry.viewport)
                : [];

              // Set up a Polygon using the retrieved boundaries
              const polygon = new google.maps.Polygon({
                paths: boundaries,
                fillColor: '#FF0000', // Fill color of the polygon
                fillOpacity: 0.2, // Opacity of the fill color
                strokeColor: '#0000FF', // Border color of the polygon
                strokeOpacity: 1, // Opacity of the border color
                strokeWeight: 2, // Width of the border
              });

              // Assuming you have a map instance already created
              polygon.setMap(map);

              // Optional: Fit the map to the polygon bounds
              if (boundaries.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                boundaries.forEach(({ lat, lng }: { lat: any; lng: any }) =>
                  bounds.extend(new google.maps.LatLng(lat, lng)),
                );
                map?.fitBounds(bounds);
              }
            } else {
              console.error('Failed to retrieve place details:', status);
            }
          });
        } else {
          console.error('Autocomplete request failed:', status);
        }
      },
    );
  };
  const onPlaceSelected = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();

    if (place && place.geometry?.location) {
      const id = place?.place_id;
      generatePolygon(place.formatted_address);
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
      // const circle = new window.google.maps.Circle({
      //   strokeColor: '#FF0000',
      //   strokeOpacity: 0.8,
      //   strokeWeight: 2,
      //   fillColor: '#FF0000',
      //   fillOpacity: 0.35,
      //   map: map,
      //   center: location,
      //   radius, // Specify the radius in meters
      // });

      // setSelectedCircle(circle);
      const address = place.formatted_address || '';
      const area = getAddressComponent(place, 'locality') || '';
      updateRefs(address, area, location, id!);
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
  console.log(selectedLocation);
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
          position={selectedLocation}
          visible
          zIndex={20}
          // draggable
          onDragEnd={handleMarkerDragEnd}
        />
        {/* {selectedLocation && (
          <PolygonF
            path={selectedLocation} // Replace with the coordinates of your polygon
            options={{
              fillColor: '#FF0000', // Fill color of the polygon
              fillOpacity: 0.1, // Opacity of the fill color
              strokeColor: '#0000FF', // Border color of the polygon
              strokeOpacity: 1, // Opacity of the border color
              strokeWeight: 1, // Width of the border
            }}
          />
        )} */}
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
};
export default MyComponent;
