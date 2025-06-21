import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
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
  useUpdateAddressByRequestIdMutation,
  useGetEmployeeFamilyAddressByIdQuery,
  useGetAddressByRequestIdQuery,
} from "../../app/api/HCMSApi";
import { useRegion } from "./useRegion";
import { useSubCity } from "./useSubCity";
import { enums } from "../../app/api";
import { AddressType } from "../../app/api/enums";
import { useAlert } from "../notification";
import * as Yup from "yup";

const emptyAddressData = {
  addressType: AddressType.BusinessUnitAddress,
  country: 1,
  regionId: 0,
  subCityId: 0,
  woreda: "",
  kebele: "",
  houseNumber: "",
  businessUnitId: null,
  employeeId: null,
} as AddressDto;

export const AddressUpdateDialog = ({
  onClose,
  title,
  requestId,
}: {
  onClose: () => void;
  title: string;
  requestId?: number;
}) => {
  const [addressData, setAddress] = useState<AddressDto>(emptyAddressData);
  const [addAddress, { error: CreateAddressErr }] = useCreateAddressMutation();
  const [updateAddress, { error: UpdateAdressErr }] =
    useUpdateAddressByRequestIdMutation();
  const { regionLookups } = useRegion();
  const { subcityLookups } = useSubCity();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const {
    data: EmployeeFamilyAddress,
    isFetching,
    error,
    refetch,
  } = useGetEmployeeFamilyAddressByIdQuery(
    { addressId: requestId },
    {
      skip: requestId === undefined,
    }
  );

  // Effect to load address data into the form
  useEffect(() => {
    if (EmployeeFamilyAddress && typeof EmployeeFamilyAddress === "object") {
      const data = EmployeeFamilyAddress["0"]
        ? EmployeeFamilyAddress["0"]
        : EmployeeFamilyAddress;
      setAddress({
        ...emptyAddressData,
        ...data,
      });
    }
  }, [EmployeeFamilyAddress]);

  // Form validation schema
  const validationSchema = Yup.object({
    addressType: Yup.number()
      .required("Address Type is required.")
      .min(1, "Address Type is required."),
    country: Yup.number()
      .required("Country is required.")
      .min(1, "Country is required."),
    regionId: Yup.number()
      .required("Region is required.")
      .min(1, "Region is required"),
    subCityId: Yup.number()
      .required("SubCity is required.")
      .min(1, "SubCity is required"),
    woreda: Yup.string()
      .required("Woreda is Required")
      .max(20, "Woreda exceeds 20 characters"),
    kebele: Yup.string().max(30, "Kebele exceeds 30 characters"),
    houseNumber: Yup.string().max(20, "HouseNumber exceeds 20 characters"),
  });

  // Handle form submission and update address
  const handleSubmit = useCallback(
    (values: AddressDto) => {
      updateAddress({
        updateAddressCommand: values,
      })
        .unwrap()
        .then(() => {
          // After update, refetch and update local state to ensure UI reflects changes
          refetch().then((updatedData: any) => {
            // Ensure the updated data is passed to the form
            setAddress({
              ...emptyAddressData,
              ...(updatedData?.data[0] as any), // Assuming data is an array, adjust based on the API response
            });
          });
          showSuccessAlert("Address updated successfully");
          onClose();
        })
        .catch((error) => {
          showErrorAlert(error?.data?.detail);
        });
    },
    [
      onClose,
      updateAddress,
      requestId,
      showErrorAlert,
      refetch,
      showSuccessAlert,
    ]
  );

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!addressData && (
        <Formik
          initialValues={addressData}
          enableReinitialize={true} // Ensures the form reinitializes with the latest addressData
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {({ values }) => (
            <Form>
              <DialogHeader title={title} onClose={onClose} />
              <DialogContent dividers={true}>
                <Grid container spacing={2}>
                  {/* Form fields */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <FormSelectField
                        name="country"
                        label="Country"
                        options={[
                          { label: "Ethiopia", value: enums.Country.Ethiopia },
                        ]}
                      />
                      <FormSelectField
                        name="regionId"
                        label="Region"
                        type="number"
                        options={regionLookups}
                      />
                      <FormSelectField
                        name="subCityId"
                        label="Sub City"
                        type="number"
                        options={subcityLookups}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <FormTextField name="city" label="City" type="text" />
                      <FormTextField name="woreda" label="Woreda" type="text" />
                      <FormTextField name="kebele" label="Kebele" type="text" />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", gap: 2 }}>
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
          )}
        </Formik>
      )}
    </Dialog>
  );
};
