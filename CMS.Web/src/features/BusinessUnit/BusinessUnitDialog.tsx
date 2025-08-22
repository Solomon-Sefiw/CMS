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
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
} from "@mui/material";
import {
  BusinessUnitDto,
  useCreateBusinessUnitMutation,
  useUpdateBusinessUnitMutation,
} from "../../app/api/HCMSApi";
import { useBusinessUnitType } from "./useBusinessUnitType";
import { removeEmptyFields } from "../../utils";
import {
  useGetAllBusinessUnitsQuery,
} from "../../app/api";
import { useAlert } from "../notification";
import * as Yup from "yup";

interface BusinessUnitDialogProps {
  onClose: () => void;
  title: string;
  businessUnit?: BusinessUnitDto;
}

const emptyBusinessUnitData: BusinessUnitDto = {
  name: "",
  parentId: 0,
  type: 0,
  staffStrength: 0,
};

export const BusinessUnitDialog: React.FC<BusinessUnitDialogProps> = ({
  onClose,
  title,
  businessUnit,
}) => {
  const [stengthValue, setStrengthValue] = useState<number>(0);
  const [businessUnitData, setBusinessUnitData] = useState<BusinessUnitDto>(
    emptyBusinessUnitData
  );
  const [updateBusinessUnit, { error: updateBusinessUnitError }] =
    useUpdateBusinessUnitMutation();
  const { data: businessUnitList } = useGetAllBusinessUnitsQuery();
  const [addBusinessUnit, { error: addBusinessUnitError }] =
    useCreateBusinessUnitMutation();
  const { businessUnitTypeLookups } = useBusinessUnitType();
  const { showErrorAlert } = useAlert();
  const [isBranch, setIsBranch] = useState(false);

  useEffect(() => {
    setBusinessUnitData({
      ...emptyBusinessUnitData,
      ...businessUnit,
    });
  }, [businessUnit]); // Dependency array should only include 'businessUnit'

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("BusinessUnit Name is required.")
      .matches(
        /^[a-zA-Z0-9 ]+$/,
        "BusinessUnit Name must be alphanumeric and can include spaces."
      )
      .max(100, "BusinessUnit Name must not exceed 100 characters.")
      .min(3, "BusinessUnit Name must be at least 3 characters long."),
    parentId: Yup.number()
      .required("Parent Business Unit Required")
      .min(1, "Parent Business Unit Required"),
    type: Yup.number() // Assuming your enum values are numbers in TypeScript
      .required(" Business Unit Type Required"),
    //   staffStrength: Yup.number()
    //     .nullable()
    //     .min(1, 'StaffStrength must Not equal to 0.'),
  });
  const handleSubmit = useCallback(
    async (values: BusinessUnitDto) => {
      let payload: BusinessUnitDto = { ...values };


      try {
        const finalPayload = removeEmptyFields(payload);

        await (businessUnit?.id
          ? updateBusinessUnit({ updateBusinessUnitCommand: finalPayload })
          : addBusinessUnit({ createBusinessUnitCommand: finalPayload })
        ).unwrap();

        onClose();
      } catch (error: any) {
        console.error("API Error:", error);
        if (error?.data?.detail) {
          showErrorAlert(error.data.detail);
        } else if (error?.error) {
          showErrorAlert(
            error.error.message || "Failed to save business unit."
          );
        } else {
          showErrorAlert("Failed to save business unit.");
        }
      }
    },
    [
      onClose,
      addBusinessUnit,
      updateBusinessUnit,
      showErrorAlert,
      businessUnit?.id,
      isBranch,
    ]
  );

  const combinedErrors = (
    businessUnit?.id ? updateBusinessUnitError : addBusinessUnitError
  ) as any;

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open>
      {businessUnitData && (
        <Formik
          initialValues={businessUnitData}
          enableReinitialize
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange
        >
          {({ values }) => (
            <Form>
              <DialogHeader title={title} onClose={onClose} />
              <DialogContent dividers>
                <Grid container spacing={2}>
                  {combinedErrors?.data?.errors && (
                    <Grid item xs={12}>
                      <Errors errors={combinedErrors.data.errors} />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <FormTextField
                        name="name"
                        label="Business Unit Name"
                        type="text"
                      />
                    </Box>
                  </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                            <FormSelectField
                                                name="type"
                                                label="Business Unit Type"
                                                options={businessUnitTypeLookups}
                                            />
                                            {values.type !== undefined && values.type > 0 && (
                                                <FormSelectField
                                                    name="parentId"
                                                    label="Parent Business Unit"
                                                    options={
                                                        businessUnitList?.approved
                                                            ?.filter(j => (values.type ?? 0) > 0 && ((isBranch || values.type !== 5)   ? (j.type === (values.type ?? 0) - 1) : (j.type === (values.type ?? 0) - 1)))
                                                            ?.map(j => ({ value: j.id, label: j.name })) as SelectOption[]
                                                    }
                                                />
                                            )}
                                        </Box>
                                    </Grid>

                
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormTextField
                          name="staffStrength"
                          label="Staff Strength"
                          type="number"
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
