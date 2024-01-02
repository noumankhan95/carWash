import React, { useState, useRef, useCallback } from 'react';
import useWorkerStore from '../store/ServiceStore';
type RefArray<T> = Array<T | null>;
type PriceRefsType = RefArray<HTMLInputElement>;
type DurationRefsType = RefArray<HTMLSelectElement>;
function EditService({
  serviceName,
  closeModal,
}: {
  serviceName: ServiceName;
  closeModal: () => void;
}) {
  const [modifier, setmodifier] = useState<modifier[]>();
  const descriptionRef = useRef<HTMLInputElement | null>(null);

  const ArabicdescriptionRef = useRef<HTMLInputElement | null>(null);
  const ModifierRef = useRef<HTMLSelectElement | null>(null);

  // Use the declared types for refs
  const PriceRefs = useRef<PriceRefsType>([]);
  const DurationRefs = useRef<DurationRefsType>([]);
  useRef<HTMLInputElement | null>(null);
  const { setServiceValue } = useWorkerStore();
  console.log(
    modifier?.map((m, index) => {
      return {
        description: descriptionRef.current?.value!,
        arabicDescription: ArabicdescriptionRef.current?.value!,
        modifiername: m.modifiername,
        price: PriceRefs.current[index]?.value!,
        duration: m.duration,
      };
    }),
  );
  const SaveServiceSettings = useCallback(() => {
    setServiceValue({
      [serviceName as ServiceName]: modifier?.map((m, index) => {
        return {
          description: descriptionRef.current?.value!,
          arabicDescription: ArabicdescriptionRef.current?.value!,
          modifiername: m.modifiername,
          price: PriceRefs.current[index]?.value!,
          duration: m.duration,
        };
      }),
    } as Services);
  }, [modifier]);
  return (
    <form action="#">
      <div className="p-6.5">
        <h1 className="mb-2.5 block text-black font-bold text-2xl text-center dark:text-white">
          {serviceName}
        </h1>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Description
            </label>
            <input
              type="text"
              placeholder="Decription"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              ref={descriptionRef}
            />
          </div>

          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Arabic Description
            </label>
            <input
              type="text"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              ref={ArabicdescriptionRef}
            />
          </div>
        </div>

        <div className="mb-4.5">
          <h1>Modifiers</h1>
          <select
            className="relative z-0 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            onChange={(e) => {
              setmodifier((p) => [
                ...(p || []),
                {
                  modifiername: e.target.value!,
                  price: '',
                  duration: '',
                  arabicDescription: '',
                  description: '',
                },
              ]);
            }}
            ref={ModifierRef}
          >
            <optgroup label="Cars">
              <option value="sedan">Sedan</option>
              <option value="van">Van</option>
              <option value="SUV">SUV</option>
            </optgroup>
            <optgroup label="Scooter">
              <option value="2Wheeler">2 Wheeler</option>
              <option value="oneWheel">One Wheel</option>
              <option value="Atv">atv</option>

              <option value="oneWheel">One Wheel</option>
              <option value="offRoad">Off-Road</option>
            </optgroup>
          </select>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-1 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Modifier
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Price
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {modifier &&
                  modifier.map((m, index) => (
                    <tr key={m.price + Date.now().toString()}>
                      <td className="border-b border-[#eee] py-5 px-1  dark:border-strokedark xl:pl-1">
                        <h5 className="font-medium text-black dark:text-white">
                          {m.modifiername}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-1 dark:border-strokedark">
                        <input
                          ref={(el) => (PriceRefs.current[index] = el)}
                          type="text"
                          placeholder="AED"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </td>
                      <td className="border-b border-[#eee] py-5 px-1 dark:border-strokedark">
                        <div className="mb-4.5">
                          <h1 className="text-sm">Time</h1>
                          <select
                            ref={(el) => (DurationRefs.current[index] = el)}
                            className="relative z-0 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                            onChange={(e) => {
                              setmodifier((p) =>
                                (p || []).map((item) =>
                                  item.modifiername === m.modifiername
                                    ? { ...item, duration: e.target.value }
                                    : item,
                                ),
                              );
                            }}
                          >
                            <option value="00:00">00:00</option>
                            <option value="00:15">00:15</option>
                            <option value="00:30">00:30</option>
                            <option value="00:45">00:45</option>
                            <option value="01:00">01:00</option>
                            <option value="01:15">01:15</option>
                            <option value="01:30">01:30</option>
                            <option value="01:45">01:45</option>
                            <option value="02:00">02:00</option>
                            <option value="02:15">02:15</option>
                            <option value="02:30">02:30</option>
                            <option value="02:45">02:45</option>
                            <option value="03:00">03:00</option>
                            <option value="03:15">03:15</option>
                            <option value="03:30">03:30</option>
                            <option value="03:45">03:45</option>
                            <option value="04:00">04:00</option>
                            <option value="04:15">04:15</option>
                            <option value="04:30">04:30</option>
                            <option value="04:45">04:45</option>
                            <option value="05:00">05:00</option>
                            <option value="05:15">05:15</option>
                            <option value="05:30">05:30</option>
                            <option value="05:45">05:45</option>
                            <option value="06:00">06:00</option>
                            <option value="06:15">06:15</option>
                            <option value="06:30">06:30</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
          onClick={() => {
            SaveServiceSettings();
            closeModal();
          }}
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default EditService;
