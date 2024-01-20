import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import useWorkerStore from '../store/ServiceStore';
import * as Yup from 'yup';
import { useFormik, FormikProvider, Field, ErrorMessage } from 'formik';
// interface FormValues {
//   description: string;
//   arabicDescription: string;
//   Modifiers: {
//     [key in ServiceName]: Array<{
//       modifiername: string;
//       price: string;
//       duration: string;
//     }>;
//   };
// }
type RefArray<T> = Array<T | null>;
type PriceRefsType = RefArray<HTMLInputElement>;
type DurationRefsType = RefArray<HTMLSelectElement>;
const validationSchema = Yup.object().shape({
  description: Yup.string().required('Description Is Required').min(10),
  arabicDescription: Yup.string()
    .required('Arabic Description Is Required')
    .min(8),
  Modifiers: Yup.object().shape({
    [Yup.string() as unknown as ServiceName]: Yup.array()
      .min(1, 'Enter Atleast One')
      .of(
        Yup.object().shape({
          modifiername: Yup.number().required().min(3),
          price: Yup.string().required('price is Required').min(3),
          duration: Yup.string().required('Duration is Required').min(3),
        }),
      ),
  }),
});
function EditService({
  serviceName,
  closeModal,
}: {
  serviceName: ServiceName;
  closeModal: () => void;
}) {
  // const [modifier, setmodifier] = useState<modifier[]>();

  // const ModifierRef = useRef<HTMLSelectElement | null>(null);
  const {
    setServiceValue,
    Service: { services },
  } = useWorkerStore();
  const [selectedService, setselectedService] = useState<Services>({
    serviceName: '',
    description: '',
    arabicDescription: '',
    Modifiers: {
      'Car Detailing': [],
      'Gold Wash': [],
      'Platinum Wash': [],
      'Premium Wash': [],
      'Standard Wash': [],
      Ceramic: [],
      Washing: [],
    },
  });

  useEffect(() => {
    const i = services.find((e) => e.serviceName === serviceName);
    if (i) {
      console.log('called');
      setselectedService(i);
    }
  }, []);
  console.log(selectedService, 'sele');
  const formikObj = useFormik<Services>({
    enableReinitialize: true,
    validationSchema,
    initialValues: selectedService,
    onSubmit(values, formikHelpers) {
      const { Modifiers, arabicDescription, description } = values;
      SaveServiceSettings({
        serviceName,
        Modifiers,
        arabicDescription,
        description,
      });
    },
  });

  // console.log(PriceRefs);
  const SaveServiceSettings = useCallback((val: Services) => {
    setServiceValue(val);
  }, []);
  console.log('selected Value', selectedService);
  return (
    <FormikProvider value={formikObj}>
      <form onSubmit={formikObj.handleSubmit}>
        <div className="p-6.5 overflow-x-auto ">
          <h1 className="mb-2.5 block text-black font-bold text-2xl text-center dark:text-white">
            {serviceName}
          </h1>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-col">
            <div className="w-full xl:w-5/6">
              <label className="mb-2.5 block text-black dark:text-white">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                placeholder="Description"
                type="text"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="w-full xl:w-5/6">
              <label className="mb-2.5 block text-black dark:text-white">
                Arabic Description
              </label>
              <Field
                as="textarea"
                name="arabicDescription"
                placeholder="ArabicDescription"
                type="text"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="arabicDescription"
                component="div"
                className="text-danger"
              />
            </div>
          </div>

          <div className="mb-4.5">
            <h1>Modifiers</h1>
            <Field
              as="select"
              name={`Modifiers.${serviceName}`}
              className="relative z-0 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              onChange={(e: any) => {
                console.log(e.target.value);
                const serviceNameKey = serviceName as ServiceName;
                const existingObj = formikObj.values.Modifiers[serviceNameKey];

                const newobj = {
                  duration: '',
                  modifiername: e.target.value,
                  price: '',
                };
                if (
                  formikObj.values.Modifiers[serviceName].some(
                    (m) => m.modifiername === e.target.value,
                  )
                )
                  return;
                if (!existingObj) {
                  formikObj.setFieldValue('Modifiers', {
                    ...formikObj.values.Modifiers,
                    [serviceName]: [newobj],
                  });
                } else {
                  formikObj.setFieldValue('Modifiers', {
                    ...formikObj.values.Modifiers,
                    [serviceName]: [...existingObj, newobj],
                  });
                }
              }}
            >
              <option value="">Select</option>
              {/* <optgroup label="Cars">
                <option value="Convertible">Convertible</option>
                <option value="Convertible, Coupe">Convertible, Coupe</option>
                <option value="Convertible, Coupe, Hatchback">
                  Convertible, Coupe, Hatchback
                </option>
                <option value="Convertible, Coupe, Sedan">
                  Convertible, Coupe, Sedan
                </option>
                <option value="Convertible, Hatchback">
                  Convertible, Hatchback
                </option>
                <option value="Convertible, Sedan">Convertible, Sedan</option>
                <option value="Convertible, Sedan, Coupe">
                  Convertible, Sedan, Coupe
                </option>
                <option value="Convertible, Sedan, Coupe, Wagon">
                  Convertible, Sedan, Coupe, Wagon
                </option>
                <option value="Convertible, Sedan, Wagon">
                  Convertible, Sedan, Wagon
                </option>
                <option value="Convertible, Wagon, Coupe, Sedan">
                  Convertible, Wagon, Coupe, Sedan
                </option>
                <option value="Convertible, Wagon, Sedan">
                  Convertible, Wagon, Sedan
                </option>
                <option value="Convertible,Coupe">Convertible, Coupe</option>
                <option value="Convertible,Sedan,Coupe">
                  Convertible, Sedan, Coupe
                </option>
                <option value="Coupe">Coupe</option>
                <option value="Coupe, Convertible">Coupe, Convertible</option>
                <option value="Coupe, Convertible, Hatchback">
                  Coupe, Convertible, Hatchback
                </option>
                <option value="Coupe, Convertible, Sedan">
                  Coupe, Convertible, Sedan
                </option>
                <option value="Coupe, Convertible, Sedan, Wagon">
                  Coupe, Convertible, Sedan, Wagon
                </option>
                <option value="Coupe, Convertible, Wagon, Sedan">
                  Coupe, Convertible, Wagon, Sedan
                </option>
                <option value="Coupe, Hatchback">Coupe, Hatchback</option>
                <option value="Coupe, Hatchback, Convertible">
                  Coupe, Hatchback, Convertible
                </option>
                <option value="Coupe, Hatchback, Convertible, Sedan">
                  Coupe, Hatchback, Convertible, Sedan
                </option>
                <option value="Coupe, Hatchback, Sedan">
                  Coupe, Hatchback, Sedan
                </option>
                <option value="Coupe, Sedan">Coupe, Sedan</option>
                <option value="Coupe, Sedan, Convertible">
                  Coupe, Sedan, Convertible
                </option>
                <option value="Coupe, Sedan, Convertible, Wagon">
                  Coupe, Sedan, Convertible, Wagon
                </option>
                <option value="Coupe, Sedan, Hatchback">
                  Coupe, Sedan, Hatchback
                </option>
                <option value="Coupe, Sedan, Wagon">Coupe, Sedan, Wagon</option>
                <option value="Coupe, Sedan, Wagon, Convertible">
                  Coupe, Sedan, Wagon, Convertible
                </option>
                <option value="Coupe, Wagon, Sedan">Coupe, Wagon, Sedan</option>
                <option value="Coupe, Wagon, Sedan, Convertible">
                  Coupe, Wagon, Sedan, Convertible
                </option>
                <option value="Coupe,Convertible">Coupe,Convertible</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Hatchback, Convertible">
                  Hatchback, Convertible
                </option>
                <option value="Hatchback, Convertible, Coupe">
                  Hatchback, Convertible, Coupe
                </option>
                <option value="Hatchback, Coupe">Hatchback, Coupe</option>
                <option value="Hatchback, Coupe, Convertible">
                  Hatchback, Coupe, Convertible
                </option>
                <option value="Hatchback, Coupe, Sedan, Convertible">
                  Hatchback, Coupe, Sedan, Convertible
                </option>
                <option value="Hatchback, Sedan">Hatchback, Sedan</option>
                <option value="Hatchback, Sedan, Convertible">
                  Hatchback, Sedan, Convertible
                </option>
                <option value="Hatchback, Sedan, Coupe">
                  Hatchback, Sedan, Coupe
                </option>
                <option value="Hatchback, Sedan, Coupe, Convertible">
                  Hatchback, Sedan, Coupe, Convertible
                </option>
                <option value="Hatchback, Sedan, Wagon">
                  Hatchback, Sedan, Wagon
                </option>
                <option value="Hatchback, Wagon">Hatchback, Wagon</option>
                <option value="Hatchback,Sedan">Hatchback,Sedan</option>
                <option value="Pickup">Pickup</option>
                <option value="SUV">SUV</option>
                <option value="SUV, Pickup">SUV, Pickup</option>
                <option value="SUV, Wagon">SUV, Wagon</option>
                <option value="SUV1992">SUV1992</option>
                <option value="SUV2020">SUV2020</option>
                <option value="Sedan">Sedan</option>
                <option value="Sedan, Convertible">Sedan, Convertible</option>
                <option value="Sedan, Convertible, Coupe">
                  Sedan, Convertible, Coupe
                </option>
                <option value="Sedan, Convertible, Coupe, Wagon">
                  Sedan, Convertible, Coupe, Wagon
                </option>
                <option value="Sedan, Convertible, Wagon">
                  Sedan, Convertible, Wagon
                </option>
                <option value="Sedan, Coupe">Sedan, Coupe</option>
                <option value="Sedan, Coupe, Convertible">
                  Sedan, Coupe, Convertible
                </option>
                <option value="Sedan, Coupe, Convertible, Wagon">
                  Sedan, Coupe, Convertible, Wagon
                </option>
                <option value="Sedan, Coupe, Hatchback">
                  Sedan, Coupe, Hatchback
                </option>
                <option value="Sedan, Coupe, Wagon">Sedan, Coupe, Wagon</option>
                <option value="Sedan, Coupe, Wagon, Convertible">
                  Sedan, Coupe, Wagon, Convertible
                </option>
                <option value="Sedan, Hatchback">Sedan, Hatchback</option>
                <option value="Sedan, Hatchback, Convertible">
                  Sedan, Hatchback, Convertible
                </option>
                <option value="Sedan, Hatchback, Coupe">
                  Sedan, Hatchback, Coupe
                </option>
                <option value="Sedan, Hatchback, Wagon">
                  Sedan, Hatchback, Wagon
                </option>
                <option value="Sedan, Wagon">Sedan, Wagon</option>
                <option value="Sedan, Wagon, Convertible">
                  Sedan, Wagon, Convertible
                </option>
                <option value="Sedan, Wagon, Convertible, Coupe">
                  Sedan, Wagon, Convertible, Coupe
                </option>
                <option value="Sedan, Wagon, Coupe">Sedan, Wagon, Coupe</option>
                <option value="Sedan, Wagon, Coupe, Convertible">
                  Sedan, Wagon, Coupe, Convertible
                </option>
                <option value="Sedan, Wagon, Hatchback">
                  Sedan, Wagon, Hatchback
                </option>
                <option value="Van/Minivan">Van/Minivan</option>
                <option value="Wagon">Wagon</option>
                <option value="Wagon, Convertible">Wagon, Convertible</option>
                <option value="Wagon, Convertible, Sedan">
                  Wagon, Convertible, Sedan
                </option>
                <option value="Wagon, SUV">Wagon, SUV</option>
                <option value="Wagon, Sedan">Wagon, Sedan</option>
                <option value="Wagon, Sedan, Convertible">
                  Wagon, Sedan, Convertible
                </option>
                <option value="Wagon, Sedan, Coupe">Wagon, Sedan, Coupe</option>
                <option value="Wagon, Sedan, Hatchback">
                  Wagon, Sedan, Hatchback
                </option>
              </optgroup> */}
              {/* <optgroup label="SUV"> */}
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Luxury">Luxury</option>
              {/* </optgroup> */}
              {/* <optgroup label="Sedan">
                <option value="Hatchback">Hatchback</option>
                <option value="Convertible">Convertible</option>
                <option value="Coupe">Coupe</option>
              </optgroup> */}
              {/* <optgroup label="Luxury">
                <option value="Ferrari">Ferrari</option>
                <option value="Lamborghini">Lamborghini</option>
                <option value="BMW">BMW</option> */}
              {/* <option value="oneWheel">One Wheel</option>
                <option value="offRoad">Off-Road</option> */}
              {/* </optgroup> */}
            </Field>
            <ErrorMessage
              name={`Modifiers.${serviceName}`}
              component="div"
              className="text-danger"
            />
          </div>

          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-1 xl:pb-1 ">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Modifier
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Price
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Duration
                    </th>
                  </tr>
                </thead>
                {
                  <tbody>
                    {formikObj.values.Modifiers[serviceName] &&
                      formikObj.values.Modifiers[serviceName]?.map(
                        (m, index) => {
                          const modifierFieldName = `Modifiers.${serviceName}[${index}].price`;
                          const durationFieldName = `Modifiers.${serviceName}[${index}].duration`;

                          console.log(modifierFieldName);
                          return (
                            <tr key={m.modifiername + m.duration}>
                              <td className="border-b border-[#eee] py-5 px-1  dark:border-strokedark xl:pl-1">
                                <h5 className="font-medium text-black dark:text-white uppercase">
                                  {m.modifiername}
                                </h5>
                              </td>
                              <td className="border-b border-[#eee] py-5 px-1 dark:border-strokedark">
                                <Field
                                  name={modifierFieldName}
                                  type="number"
                                  placeholder="AED"
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                <ErrorMessage
                                  name={modifierFieldName}
                                  component="div"
                                  className="text-danger"
                                />
                              </td>
                              <td className="border-b border-[#eee] py-5 px-1 dark:border-strokedark">
                                <div className="mb-4.5">
                                  <h1 className="text-sm">Time</h1>
                                  <Field
                                    as="select"
                                    name={durationFieldName}
                                    className="relative z-0 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
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
                                  </Field>
                                  <ErrorMessage
                                    name={durationFieldName}
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        },
                      )}
                  </tbody>
                }
              </table>
            </div>
          </div>

          <button
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}

export default EditService;
