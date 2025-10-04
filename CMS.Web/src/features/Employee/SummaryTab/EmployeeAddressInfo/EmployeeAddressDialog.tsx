import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Alert,
} from "@mui/material";
import * as Yup from "yup";
import { AddressType, Country } from "../../../../app/api/enums";
import {
  AddressDto,
  useCreateAddressMutation,
  useGetAddressByRequestIdQuery,
  useGetAllSubCityQuery,
  useUpdateAddressByRequestIdMutation,
} from "../../../../app/api";
import { useEmployeeRegion } from "./useEmployeeRegion";
import { useEmployeeSubCity } from "./useEmployeeSubCity";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../../../components";
import { useAlert } from "../../../notification";

const emptyAddressData = {
  addressType: AddressType.BusinessUnitAddress,
  country: Country.Ethiopia,
  regionId: 0,
  subCityId: 0,
  woreda: "",
  city: "",
  kebele: "",
  houseNumber: "",
  requestId: 0,
} as AddressDto;

export const EmployeeAddressDialog = ({
  open,
  onClose,
  title,
  requestId,
  addressType,
  address,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  requestId?: number;
  addressType: AddressType;
  address?: AddressDto;
}) => {
  const [addressData, setAddress] = useState<AddressDto>(
    address || emptyAddressData
  );
  const [notification, setNotification] = useState<string>("");
  const [severity, setSeverity] = useState<"success" | "error" | "info">(
    "info"
  );

  const [addAddress, { error: createAddressError }] =
    useCreateAddressMutation();
  const [updateAddress, { error: updateAddressError }] =
    useUpdateAddressByRequestIdMutation();

  const { regionLookups } = useEmployeeRegion();
  const { subcityLookups } = useEmployeeSubCity();
  const { data: allSubCityList } = useGetAllSubCityQuery();
  const { data, refetch } = useGetAddressByRequestIdQuery(
    { requestId, addressType },
    { skip: !requestId }
  );
  const { showSuccessAlert, showErrorAlert } = useAlert();
  // Sync form state when fetched data or passed prop changes
  useEffect(() => {
    setAddress({ ...emptyAddressData, ...address, ...data });
  }, [address, data]);

  // Reset notification on dialog close
  useEffect(() => {
    if (!open) {
      setNotification("");
      setSeverity("info");
    }
  }, [open]);

  const validationSchema = Yup.object({
    addressType: Yup.number().required("Address Type is required.").min(1),
    country: Yup.number().required("Country is required.").min(1).max(50),
    regionId: Yup.number().required("Region is required").min(1),
    subCityId: Yup.number().required("SubCity is required").min(1),
    woreda: Yup.string().required("Woreda is Required").max(30),
    city: Yup.string().required("City is required").max(30),
    kebele: Yup.string().required("Kebele is Required").max(30),
    houseNumber: Yup.string().max(20),
  });

  const handleSubmit = useCallback(
    async (values: AddressDto) => {
      values.requestId = requestId!;
      values.addressType = addressType;
      (data?.id
        ? updateAddress({ updateAddressCommand: values })
        : addAddress({ createAddressCommand: values })
      )
        .unwrap()
        .then(() => {
          data?.id
            ? showSuccessAlert("Address updated successfully!")
            : showSuccessAlert("Address created successfully!");
          refetch();
          onClose();
        })
        .catch((error) => {
          showErrorAlert(error?.data?.detail);
        });
    },
    [addAddress, updateAddress, requestId, addressType, data, onClose, refetch]
  );

  // Extract API errors if any
  const errors = ((data?.id ? updateAddressError : createAddressError) as any)
    ?.data?.errors;

  return (
    <Dialog
      scroll="paper"
      disableEscapeKeyDown
      maxWidth="md"
      open={open}
      onClose={onClose}
    >
      {!!addressData && (
        <Formik
          initialValues={addressData}
          enableReinitialize
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange
        >
          {({ values }) => (
            <Form>
              <DialogHeader title={title} onClose={onClose} />

              {notification && (
                <Box sx={{ p: 2 }}>
                  <Alert severity={severity}>{notification}</Alert>
                </Box>
              )}

              <DialogContent dividers>
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
                        options={[
                          { label: "Ethiopia", value: Country.Ethiopia },
                        ]}
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
                      <FormTextField name="city" label="city" type="text" />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
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
