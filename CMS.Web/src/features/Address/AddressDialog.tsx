import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import {
  AddressDto,
  useCreateAddressMutation,
  useGetAddressByRequestIdQuery,
  useGetAllSubCityQuery,
  useUpdateAddressByRequestIdMutation,
} from "../../app/api/HCMSApi";
import { useRegion } from "./useRegion";
import { AddressType, Country } from "../../app/api/enums";
import { useAlert } from "../notification";
import * as Yup from "yup";
import { getEnumOptions } from "../../components/form-controls/get-enum-list";

const emptyAddressData = {
  addressType: AddressType.BusinessUnitAddress,
  country: 1,
  regionId: 0,
  subCityId: 0,
  woreda: "",
  city: "",
  kebele: "",
  houseNumber: "", // Added houseNumber to empty data
  requestId: 0,
} as AddressDto;

export const AddressDialog = ({
  onClose,
  title: propTitle,
  requestId,
  addressType,
}: {
  onClose: () => void;
  title: string;
  requestId?: number;
  addressType?: AddressType;
}) => {
  const [addressData, setAddress] = useState<AddressDto | undefined>();
  const [title, setTitle] = useState(propTitle);

  const { data: allSubCityList } = useGetAllSubCityQuery();
  const [addAddress, { error: CreateAddressErr }] = useCreateAddressMutation();
  const [updateAddress, { error: UpdateAdressErr }] =
    useUpdateAddressByRequestIdMutation();
  const { regionLookups } = useRegion();
   const { showSuccessAlert, showErrorAlert } = useAlert();


  const { data, refetch } = useGetAddressByRequestIdQuery(
    { requestId: requestId, addressType: addressType },
    {
      skip: !requestId || !addressType, // Skip if no requestId or addressType
    }
  );

  useEffect(() => {
    if (data?.id) {
      setTitle("Update Address");
    } else {
      setTitle("Add New Address");
    }
    setAddress({
      ...emptyAddressData,
      ...data,
    });
  }, [data, propTitle]);

  const validationSchema = Yup.object({
    addressType: Yup.number()
      .required("Address Type is required.")
      .min(1, "Address Type is required."),
    country: Yup.number()
      .required("Country is required.")
      .min(1, "Country is required."),
    regionId: Yup.number()
      .required("Region / City-Admin is required.")
      .min(1, "Region / City-Admin is required"),
    subCityId: Yup.number()
      .required("Sub City / Zone is required.")
      .min(1, "Sub City / Zone is required"),
    woreda: Yup.string()
      .required("Woreda is Required")
      .max(20, "Woreda exceeds 20 characters"),
    city: Yup.string()
      .required("City is Required")
      .max(50, "City exceeds 50 characters"),
    kebele: Yup.string()
      .required("Kebele is Required")
      .max(30, "Kebele exceeds 30 characters"),
    houseNumber: Yup.string().max(20, "House number  exceeds 20 characters"),
  });

  const handleSubmit = useCallback(
    (values: AddressDto) => {
      if (!requestId || !addressType) {
        console.error("Request ID or Address Type is missing.");
        return;
      }
      values.requestId = requestId;
      values.addressType = addressType;
      (data?.id
        ? updateAddress({
            updateAddressCommand: values,
          })
        : addAddress({
            createAddressCommand: values,
          })
      )
        .unwrap()
        .then(() => {
          data?.id ? showSuccessAlert("Address updated successfully!") : showSuccessAlert("Address created successfully!");
          refetch();
          onClose();
        })
        .catch((error) => {
          showErrorAlert(error?.data?.detail);
        });
    },
    [
      onClose,
      addAddress,
      updateAddress,
      refetch,
      requestId,
      addressType,
      showErrorAlert,
    ]
  );
  const errors = ((data?.id ? UpdateAdressErr : CreateAddressErr) as any)?.data
    ?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!addressData && (
        <Formik
          initialValues={addressData as any}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {({ values }) => {
            return (
              <Form>
                <DialogHeader title={title} onClose={onClose} />
                <DialogContent dividers={true}>
                  <Grid container spacing={2}>
                    {errors && (
                      <Grid item xs={12}>
                        <Errors errors={errors as any} />
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormSelectField
                          name="country"
                          label="Country"
                          options={getEnumOptions(Country)}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormSelectField
                          name="regionId"
                          label="Region / City-Admin"
                          type="number"
                          options={regionLookups}
                        />
                        {values.regionId ? (
                          <FormSelectField
                            name="subCityId"
                            label="Sub City / Zone"
                            type="number"
                            options={
                              allSubCityList?.approved
                                ?.filter(
                                  (subCity) =>
                                    subCity.regionId === values.regionId
                                )
                                ?.map((subCity) => ({
                                  value: subCity.id,
                                  label: subCity.name,
                                })) as SelectOption[]
                            }
                          />
                        ) : (
                          ""
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormTextField name="city" label="City" type="text" />
                        <FormTextField
                          name="woreda"
                          label="Woreda"
                          type="text"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormTextField
                          name="kebele"
                          label="Kebele"
                          type="text"
                        />
                        <FormTextField
                          name="houseNumber"
                          label="House Number"
                          type="text"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button color="primary" variant="outlined" type="submit">
                    Save
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      )}
    </Dialog>
  );
};
