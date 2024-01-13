import React, { useRef, FormEvent, useState } from 'react';
import useWorkerStore from '../store/ServiceStore';
import MapComponent from './MapComponent';
import { Autocomplete } from '@react-google-maps/api';
import { toast } from 'react-hot-toast';
function AddLocation({ closeModal }: { closeModal: () => void }) {
  const areasServeRef = useRef<HTMLInputElement | null>(null);
  const arrivalTimeRef = useRef<HTMLInputElement | null>(null);
  const minOrderValueRef = useRef<HTMLInputElement | null>(null);
  const radiusRef = useRef<HTMLInputElement | null>(null);

  const { addServingArea, ServingArea } = useWorkerStore();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapref = useRef();
  const [locationaddress, setlocationaddress] = useState<serviceLocation>();
  const [locationsList, setlocationsList] =
    useState<ServicesList[]>(ServingArea);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Access input values using refs
    const areasServe = areasServeRef.current?.value || '';
    const arrivalTime = arrivalTimeRef.current?.value || '';
    const minOrderValue = minOrderValueRef.current?.value || '';

    // Handle the form data as needed
  };

  const updateRefs = (
    address: string,
    area: string,
    location: itemLocation,
    id: string,
  ) => {
    console.log('place_ud', id);
    setlocationaddress({ address, area, location, id });
  };
  console.log(locationsList);
  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6.5 space-y-6">
        <label className="mb-2.5 block text-black dark:text-white">
          Change Radius
        </label>
        <input
          ref={radiusRef}
          type="number"
          placeholder="Set Radius"
          className="w-full  top-0 z-99999 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
        <MapComponent
          updateRefs={updateRefs}
          Servicemode
          ref={mapref}
          radius={parseInt(radiusRef.current?.value!)}
        />

        <h1 className="mb-2.5 text-2xl block text-black dark:text-white">
          Locations
        </h1>
        {locationsList && (
          <section className="border-y-2 py-3 px-2">
            {locationsList?.map((l, index) => {
              if (!l) return null;
              const keys = Object.keys(l);
              const [name] = keys.filter((im, ind) =>
                Array.isArray(l[keys[ind]]),
              );
              console.log('l', l);
              return (
                <div key={Date.now().toLocaleString() + Math.random() * 100000}>
                  <h1 className="text-2xl">{name}</h1>
                  {l[name]?.map((loc) => (
                    <div
                      className="flex justify-between w-full items-center px-3 dark:text-white"
                      key={Date.now().toLocaleString() + Math.random() * 100000}
                    >
                      <h1>{loc?.address}</h1>
                      <svg
                        className="fill-current hover:bg-danger cursor-pointer"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => {
                          setlocationsList((prevItems) => {
                            const updatedItems = prevItems.map((service) => {
                              if (!service) return null;
                              const areaName = Object.keys(service)[0];
                              const updatedLocations = service[areaName].filter(
                                (location) => location.id !== loc.id,
                              );
                              console.log('iupdated ', updatedLocations);
                              if (updatedLocations?.length === 0) return null;
                              return {
                                [areaName]: updatedLocations,
                                duration: service.duration,
                                minamount: service.minamount,
                              };
                            });

                            console.log('Left after deletion', updatedItems);
                            return updatedItems as ServicesList[];
                          });
                        }}
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              );
            })}
          </section>
        )}
        <div className="mb-4.5">
          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Enter Estimated Arrival Time In Minutes
            </label>
            <input
              type="number"
              placeholder="Enter Est Arrival"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              ref={arrivalTimeRef}
            />
          </div>
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Enter Minimum Order Value
          </label>
          <input
            type="number"
            placeholder="Enter Order Value"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ref={minOrderValueRef}
            // defaultValue={l}
          />
        </div>
        <div className="flex flex-col space-y-3">
          <button
            className="flex w-full justify-center rounded bg-meta-5 p-3 font-medium text-gray"
            type="submit"
            onClick={() => {
              if (
                !locationsList ||
                !arrivalTimeRef.current?.value ||
                !minOrderValueRef.current?.value
              )
                return toast.error('Enter A Serving Area First');
              setlocationsList((p) => {
                const item = p?.find((el) => {
                  return el && Object.keys(el)[0] == locationaddress?.area;
                });
                console.log('dase', {
                  duration: arrivalTimeRef.current?.value || '',
                  minamount: minOrderValueRef.current?.value || 0,
                });
                if (item) {
                  const newItem = [
                    ...item[locationaddress?.area!],
                    locationaddress,
                  ];
                  const mynewItemsArray = p?.filter(
                    (e) => Object.keys(e)[0] !== locationaddress?.area,
                  );
                  console.log('item:exists', newItem);
                  const filteredItems = mynewItemsArray?.filter((item) => {
                    const key = Object.keys(item)[0];
                    return key && item[key] !== null;
                  });
                  return [
                    ...(filteredItems || []),
                    {
                      [locationaddress?.area!]: newItem,
                      duration: arrivalTimeRef.current?.value ?? '',
                      minamount: minOrderValueRef.current?.value ?? 0,
                    },
                  ] as ServicesList[];
                } else {
                  const newItem = {
                    [locationaddress?.area!]: [locationaddress!],
                  };
                  console.log('no item:exists', newItem);
                  const filteredItems = p?.filter((item) => {
                    if (!item) return false;
                    const key = Object.keys(item)[0];
                    return key && item[key] !== null;
                  });
                  return [
                    ...(filteredItems || []),
                    {
                      [locationaddress?.area!]: [locationaddress!],
                      duration: arrivalTimeRef.current?.value ?? '',
                      minamount: minOrderValueRef.current?.value ?? 0,
                    },
                  ] as ServicesList[];
                }
              });
            }}
          >
            Add Location
          </button>
          <button
            className="flex w-1/5 self-end justify-center rounded bg-primary p-3 font-medium text-gray"
            type="submit"
            onClick={() => {
              // if (
              //   !locationsList ||
              //   !arrivalTimeRef.current?.value ||
              //   !minOrderValueRef.current?.value
              // )
              //   return toast.error('Enter A Serving Area First');
              addServingArea(locationsList);
              closeModal();
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}

export default AddLocation;
