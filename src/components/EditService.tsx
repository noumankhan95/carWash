import React, { useState, useRef, useCallback } from 'react';
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
  const formikObj = useFormik<Services>({
    validationSchema,
    initialValues: {
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
    },
    onSubmit(values, formikHelpers) {
      const { Modifiers, arabicDescription, description } = values;
      SaveServiceSettings({
        Modifiers,
        arabicDescription,
        description,
      });
    },
  });

  const { setServiceValue } = useWorkerStore();
  // console.log(PriceRefs);
  const SaveServiceSettings = useCallback((val: Services) => {
    setServiceValue(val);
  }, []);
  return (
    <FormikProvider value={formikObj}>
      <form onSubmit={formikObj.handleSubmit}>
        <div className="p-6.5 overflow-x-auto ">
          <h1 className="mb-2.5 block text-black font-bold text-2xl text-center dark:text-white">
            {serviceName}
          </h1>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Description
              </label>
              <Field
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

            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Arabic Description
              </label>
              <Field
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
