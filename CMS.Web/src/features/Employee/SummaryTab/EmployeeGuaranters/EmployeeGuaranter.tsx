import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import {
  AddressDto,
  AddressTypeEnum,
  ContactCategoryEnum,
  ContactTypeEnum,
  EmployeeFamilyDto,
  EmployeeExperienceDto,
  EmployeeGurantersDto,
  JobCatagory,
} from "../../../../app/api";
import { KeyValuePair } from "../../../../components/KeyValuePair";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Add from "@mui/icons-material/Add";
import { EmployeeFamilyDialog } from "../EmployeeFamily/EmployeeFamilyDialog";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import { ContactDialogNew } from "../../../Contact/ContactDialogNew";
import { AddressDialog } from "../../../Address/AddressDialog";
import {
  enums,
  useGetAddressQueryByEntityTypeQuery,
  useGetGuaranterWorkingFirmAddressQuery,
  useGetGuaranterAddressQuery,
  useGetContactOfGuaraterQuery,
  useGetContactOfGuaraterWorkingFirmQuery,
  useGetContactsByEntityQuery,
  useGetEmployeeGuaranterEmployeeQuery,
} from "../../../../app/api";
import { AddressUpdateDialog } from "../../../Address/AddressUpdateDialog";
import { ContactUpdateDialogNew } from "../../../Contact/ContactUpdateDialogNew";
import { EmployeeGuaranterDialog } from "./EmployeeGuaranterDialog";
import { Home, More, Phone } from "@mui/icons-material";

import {
  ContactType,
  Country,
  Status,
  AddressType,
  ContactCategory,
  Activation,
} from "../../../../app/api/enums";
import { EmployeeFamilyUpdateDialog } from "../EmployeeFamily/EmployeeFamilyUpdateDialog";
import { useParams } from "react-router-dom";
import { EmployeeGuarantersUpdateDialog } from "./EmployeeGuarantersUpdateDialog";
import { EmployeeGuaranteeActivateButton } from "./EmployeeGuaranteeActivateButton";
import { EmployeeGuaranteeDeActivateButton } from "./EmployeeGuaranteeDeActivateButton";
import { usePermission } from "../../../../hooks";
interface EmployeeGuaranterProps {
  items?: EmployeeGurantersDto[];
  hideWorkflowComment?: boolean;
  suppressActionColumn?: boolean;
}

export const EmployeeGuaranter = ({
  items = [],
}: EmployeeGuaranterProps) => {
  const [OpenEmployeeGuaranterDialog, setOpenEmployeeGuaranterDialog] =
    useState<boolean>(false);

  const [selectedContact, setSelectedContact] = useState<number>();
  const [selectedAddress, setSelectedAddres] = useState<number>();
  const [contactType, setContactType] = useState<ContactType>();
  const [OpenContactDialog, setOpenContactDialog] = useState<boolean>(false);
  const [OpenAddressDialog, setOpenAddressDialog] = useState<boolean>(false);
  //
  const [Guaranter, setGuaranter] = useState<number | undefined>();
  //
  const [OpenUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [AddressShow, setAddressShow] = useState<boolean>(false);
  const [contactShow, setContactShow] = useState<boolean>(false);
  const [selectedIdForAddress, setSelectedIdForAddress] = useState<
    number | undefined
  >(undefined);
  const [selectedIdForContact, setSelectedIdForContact] = useState<
    number | undefined
  >(undefined);
  const [expandedRow, setExpandedRow] = useState<number | undefined>(undefined); // Track the row that is expanded
  const [AddressUpdateDialogOpend, setAddressUpdateDialogOpend] =
    useState<boolean>(false);
  const [updatedAddress, setupdatedAddress] = useState<number | undefined>();
  const [updatedcontact, setUpdatedContact] = useState<number | undefined>();
  const [OpenUpdateContactDialog, setOpenUpdateContactDialog] =
    useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<{
    [key: number]: HTMLElement | null;
  }>({}); // Map to store anchorEl for each row

  const [AddressType, setAddressType] = useState<AddressTypeEnum>();
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;
  //
  const { data: EmployeeGuaranter, refetch } =
    useGetEmployeeGuaranterEmployeeQuery({ employeeId: employeeId });

  const [EmployeeGuarante, setEmployeeGuarante] = useState<
    AddressType | undefined
  >();
  const AddAddress = (
    id: number | undefined,
    AddressType: AddressType | undefined
  ) => {
    setSelectedAddres(id);
    setEmployeeGuarante(AddressType);
    console.log(EmployeeGuarante + "addresstype");
    setOpenAddressDialog(true);
  };
  const [EmployeeContactCategory, setEmployeeContactCategory] =
    useState<ContactCategory>();

  const AddContact = (
    id: number | undefined,
    ContactCategory: ContactCategory
  ) => {
    setSelectedContact(id);
    setOpenContactDialog(true);
    setEmployeeContactCategory(ContactCategory);
  };
const permissions = usePermission();
  //
  const UpdateDialog = (id: number | undefined) => {
    setGuaranter(id);
    setOpenUpdateDialog(true);
  };
  const UpdateDialogClose = () => {
    refetch();
    setGuaranter(undefined);
    setOpenUpdateDialog(false);
  };
  const {
    data: EmployeeFamilyGuaranterAddress,
    refetch: refetchGuarnterAddress,
  } = useGetGuaranterAddressQuery(
    { employeeId: selectedIdForAddress },
    { skip: selectedIdForAddress === undefined }
  );
  const {
    data: EmployeeGuaranterWorkingFirmAddress,
    refetch: GuaranterWorkingFirmAddress,
  } = useGetGuaranterWorkingFirmAddressQuery(
    { employeeId: selectedIdForAddress },
    { skip: selectedIdForAddress === undefined }
  );
  const { data: EmployeeGuaranterContact, refetch: ContactOfGuarater } =
    useGetContactOfGuaraterQuery(
      { contactId: selectedIdForContact },
      { skip: selectedIdForContact === undefined }
    );
  //useGetGuaranterWorkingFirmAddressQuery
  const {
    data: EmployeeGuranterWorkingContact,
    refetch: ContactOfGuaraterWorkingFirm,
  } = useGetContactOfGuaraterWorkingFirmQuery(
    { contactId: selectedIdForContact },
    { skip: selectedIdForContact === undefined }
  );
  const showAddress = (id: number | undefined) => {
    setSelectedIdForAddress(id);
    setSelectedIdForContact(id);
    setExpandedRow(expandedRow === id ? undefined : id); // Update the selected ID to trigger the query
  };
  //
  const OpenAddressDialogClose = () => {
    setSelectedAddres(undefined);
    setupdatedAddress(undefined);
    setOpenAddressDialog(false);
    setAddressUpdateDialogOpend(false);
    if (selectedIdForAddress !== undefined) {
      GuaranterWorkingFirmAddress();
      refetchGuarnterAddress();
    }
    if (selectedIdForContact !== undefined) {
      ContactOfGuarater();
      ContactOfGuaraterWorkingFirm();
    }
  };
  const OpenContactDialogClose = () => {
    setSelectedContact(undefined);
    setOpenContactDialog(false);
    setOpenUpdateContactDialog(false);
    if (selectedIdForAddress !== undefined) {
      GuaranterWorkingFirmAddress();
      refetchGuarnterAddress();
    }
    if (selectedIdForContact !== undefined) {
      ContactOfGuarater();
      ContactOfGuaraterWorkingFirm();
    }
  };
  //
  const handleClick = (event: any, rowId: number | any) => {
    setAnchorEl((prev) => ({
      ...prev,
      [rowId]: event.currentTarget, // Store the anchorEl for each row
    }));
  };

  const handleClose = (rowId: number | any) => {
    setAnchorEl((prev) => ({
      ...prev,
      [rowId]: null, // Close the menu for the specific row
    }));
    if (selectedIdForAddress !== undefined) {
      GuaranterWorkingFirmAddress();
      refetchGuarnterAddress();
    }
    if (selectedIdForContact !== undefined) {
      ContactOfGuarater();
      ContactOfGuaraterWorkingFirm();
    }
  };
  //
  const UpdateAddress = (id: number | undefined) => {
    setupdatedAddress(id);
    setAddressUpdateDialogOpend(true);
  };
  const [Category, setCategory] = useState<ContactCategory | undefined>();
  const UpdateContact = (
    id: number | undefined,
    Category: ContactCategory | undefined
  ) => {
    setUpdatedContact(id);
    setCategory(Category);
    setOpenUpdateContactDialog(true);
  };
  //
  const closeDialogGuaranter = () => {
    setOpenEmployeeGuaranterDialog(false);
    refetch();
  };
  //
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", // Align button to the right
          width: "100%", // Full width of the modal
        }}
      >
        <Button
          onClick={() =>
            !OpenEmployeeGuaranterDialog && setOpenEmployeeGuaranterDialog(true)
          }
          variant="contained"
          startIcon={<Add />}
          size="small"
          color="primary"
          disabled={!permissions.CanCreateOrUpdateEmployeeInfo}
        >
          Add Guaranter
        </Button>
      </Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Employee Guaranters </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {items && (
              <Paper>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          First Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Father Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Grand Father Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Working Firm
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          OutWard
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          InWard
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold" }}
                          colSpan={4}
                          align="center"
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(EmployeeGuaranter || []).map(
                        (EmployeeGuaranter: EmployeeGurantersDto) => (
                          <Fragment key={EmployeeGuaranter.id}>
                            <TableRow>
                              <TableCell>{EmployeeGuaranter.name}</TableCell>
                              <TableCell>
                                {EmployeeGuaranter.fathersName}
                              </TableCell>
                              <TableCell>
                                {EmployeeGuaranter.grandfathersName}
                              </TableCell>
                              <TableCell>
                                {EmployeeGuaranter.workingFirm}
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={
                                    EmployeeGuaranter.guaranteeType ==
                                    enums.Guarantee.OutWard
                                  }
                                  disabled
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={
                                    EmployeeGuaranter.guaranteeType ==
                                    enums.Guarantee.InWard
                                  }
                                  disabled // Makes it read-only (view-only)
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  color="primary"
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    UpdateDialog(EmployeeGuaranter.id)
                                  }
                                >
                                  Edit
                                </Button>
                              </TableCell>
                              <TableCell>
                                {EmployeeGuaranter.active ===
                                Activation.Active ? (
                                  <EmployeeGuaranteeDeActivateButton
                                    id={EmployeeGuaranter.id ?? 0}
                                    employeeId={
                                      EmployeeGuaranter.employeeId ?? 0
                                    }
                                    disabled={false}
                                  />
                                ) : (
                                  <EmployeeGuaranteeActivateButton
                                    id={EmployeeGuaranter.id ?? 0}
                                    employeeId={
                                      EmployeeGuaranter.employeeId ?? 0
                                    }
                                    disabled={false}
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    showAddress(EmployeeGuaranter.id)
                                  }
                                  sx={{
                                    transition: "transform 0.2s ease",
                                    "&:hover": { transform: "scale(1.1)" },
                                  }}
                                >
                                  <More />
                                </IconButton>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", width: "100%" }}>
                                  <Box sx={{ marginLeft: "auto" }}>
                                    <IconButton
                                      onClick={(event) =>
                                        handleClick(event, EmployeeGuaranter.id)
                                      }
                                    >
                                      <MoreHoriz />
                                    </IconButton>
                                  </Box>
                                  <Menu
                                    anchorEl={
                                      EmployeeGuaranter.id !== undefined
                                        ? anchorEl[EmployeeGuaranter.id]
                                        : null
                                    }
                                    open={Boolean(
                                      EmployeeGuaranter.id !== undefined &&
                                        anchorEl[EmployeeGuaranter.id]
                                    )}
                                    onClose={() =>
                                      handleClose(EmployeeGuaranter.id)
                                    }
                                  >
                                    <MenuItem
                                      onClick={() =>
                                        AddContact(
                                          EmployeeGuaranter.id,
                                          enums.ContactCategory
                                            .EmployeeGuaranter
                                        )
                                      }
                                    >
                                      Add Guaranter Contact{" "}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() =>
                                        AddAddress(
                                          EmployeeGuaranter.id,
                                          enums.AddressType
                                            .EmployeeGuaranterAddress
                                        )
                                      }
                                    >
                                      Add Guaranter Address
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() =>
                                        AddContact(
                                          EmployeeGuaranter.id,
                                          enums.ContactCategory
                                            .GuaranterWorkingFirmContact
                                        )
                                      }
                                    >
                                      Add Working Firm Contact
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() =>
                                        AddAddress(
                                          EmployeeGuaranter.id,
                                          enums.AddressType
                                            .GuaranterWorkingFirmAddress
                                        )
                                      }
                                    >
                                      Add Working Firm Address
                                    </MenuItem>
                                  </Menu>
                                </Box>
                              </TableCell>
                            </TableRow>

                            {/* Expand Address or Contact based on the expandedRow and section type expanded={selectedIdForAddress === EmployeeGuaranter.id}*/}
                            {expandedRow === EmployeeGuaranter.id && (
                              <TableRow>
                                <TableCell colSpan={4} sx={{ padding: 0 }}>
                                  <Accordion
                                    sx={{ marginTop: "0.5rem", paddingLeft: 2 }}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                    >
                                      <Icon
                                        component={Home}
                                        sx={{
                                          marginRight: 1,
                                          color: "primary.dark",
                                        }}
                                      />
                                      <Typography variant="body2">
                                        Show Address Details
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails
                                      sx={{
                                        padding: "0.5rem 1rem",
                                        backgroundColor: "#f4f6f8",
                                        borderRadius: "4px",
                                        marginRight: "10px",
                                      }}
                                    >
                                      {EmployeeFamilyGuaranterAddress?.map(
                                        (address: AddressDto) => (
                                          <Fragment key={address.id}>
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>Region</TableCell>
                                                <TableCell>Sub City</TableCell>
                                                <TableCell>Woreda</TableCell>
                                                <TableCell>City</TableCell>
                                                <TableCell>Kebele</TableCell>
                                                <TableCell>
                                                  House Number
                                                </TableCell>
                                                <TableCell>
                                                  Address Type
                                                </TableCell>
                                                <TableCell>Actions</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableRow>
                                              <TableCell>
                                                {address.regionName}
                                              </TableCell>
                                              <TableCell>
                                                {address.subCityName}
                                              </TableCell>
                                              <TableCell>
                                                {address.woreda}
                                              </TableCell>
                                              <TableCell>
                                                {address.city}
                                              </TableCell>
                                              <TableCell>
                                                {address.kebele}
                                              </TableCell>
                                              <TableCell>
                                                {address.houseNumber}
                                              </TableCell>
                                              <TableCell>
                                                <Typography>
                                                  {" "}
                                                  Guaranter Address{" "}
                                                </Typography>
                                              </TableCell>

                                              <TableCell>
                                                <Button
                                                  variant="outlined"
                                                  size="small"
                                                  color="secondary"
                                                  onClick={() =>
                                                    UpdateAddress(address.id)
                                                  }
                                                >
                                                  Edit
                                                </Button>
                                              </TableCell>
                                            </TableRow>
                                          </Fragment>
                                        )
                                      )}
                                    </AccordionDetails>
                                    {/* Show Contact Details */}

                                    <AccordionDetails
                                      sx={{
                                        padding: "0.5rem 1rem",
                                        backgroundColor: "#f4f6f8",
                                        borderRadius: "4px",
                                        marginRight: "10px",
                                      }}
                                    >
                                      {EmployeeGuaranterWorkingFirmAddress?.map(
                                        (address: AddressDto) => (
                                          <Fragment key={address.id}>
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>Region</TableCell>
                                                <TableCell>Sub City</TableCell>
                                                <TableCell>Woreda</TableCell>
                                                <TableCell>City</TableCell>
                                                <TableCell>Kebele</TableCell>
                                                <TableCell>
                                                  House Number
                                                </TableCell>
                                                <TableCell>
                                                  Address Type
                                                </TableCell>
                                                <TableCell>Actions</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableRow>
                                              <TableCell>
                                                {address.regionName}
                                              </TableCell>
                                              <TableCell>
                                                {address.subCityName}
                                              </TableCell>
                                              <TableCell>
                                                {address.woreda}
                                              </TableCell>
                                              <TableCell>
                                                {address.city}
                                              </TableCell>
                                              <TableCell>
                                                {address.kebele}
                                              </TableCell>
                                              <TableCell>
                                                {address.houseNumber}
                                              </TableCell>
                                              <TableCell>
                                                <Typography>
                                                  {" "}
                                                  Guaranter Working firm{" "}
                                                </Typography>
                                              </TableCell>

                                              <TableCell>
                                                <Button
                                                  variant="outlined"
                                                  size="small"
                                                  color="secondary"
                                                  onClick={() =>
                                                    UpdateAddress(address.id)
                                                  }
                                                >
                                                  Edit
                                                </Button>
                                              </TableCell>
                                            </TableRow>
                                          </Fragment>
                                        )
                                      )}
                                    </AccordionDetails>
                                    {/* Show Contact Details */}
                                  </Accordion>

                                  {/* Show Contact Details */}
                                  <Accordion
                                    sx={{ marginTop: "0.5rem", paddingLeft: 2 }}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                    >
                                      <Icon
                                        component={Phone}
                                        sx={{
                                          marginRight: 1,
                                          color: "primary.dark",
                                        }}
                                      />
                                      <Typography variant="body2">
                                        Show Contact Details
                                      </Typography>
                                    </AccordionSummary>

                                    <AccordionDetails
                                      sx={{
                                        padding: "0.5rem 1rem",
                                        backgroundColor: "#f4f6f8",
                                        borderRadius: "4px",
                                        marginRight: "10px",
                                      }}
                                    >
                                      {EmployeeGuaranterContact?.map(
                                        (contact: any) => (
                                          <Fragment key={contact.id}>
                                            <TableRow>
                                              {contact.type ===
                                                enums.ContactType.CellPhone && (
                                                <TableCell>CellPhone</TableCell>
                                              )}
                                              {contact.type ===
                                                enums.ContactType.Email && (
                                                <TableCell>Email</TableCell>
                                              )}
                                              {contact.type ===
                                                enums.ContactType.Fax && (
                                                <TableCell>Fax</TableCell>
                                              )}
                                              {contact.type ===
                                                enums.ContactType.WorkPhone && (
                                                <TableCell>WorkPhone</TableCell>
                                              )}
                                              {contact.type ===
                                                enums.ContactType.PoBox && (
                                                <TableCell>PoBox</TableCell>
                                              )}
                                              {contact.type ===
                                                enums.ContactType.HomePhone && (
                                                <TableCell>HomePhone</TableCell>
                                              )}
                                              <TableCell>
                                                {contact.value}
                                              </TableCell>
                                              <TableCell>
                                                <Typography>
                                                  Guaranter contact
                                                </Typography>
                                              </TableCell>

                                              <TableCell>
                                                <Button
                                                  variant="outlined"
                                                  size="small"
                                                  color="secondary"
                                                  onClick={() =>
                                                    UpdateContact(
                                                      contact.id,
                                                      contact.contactCategory
                                                    )
                                                  }
                                                >
                                                  Edit
                                                </Button>
                                              </TableCell>
                                            </TableRow>
                                          </Fragment>
                                        )
                                      )}
                                      {/* **/}
                                      {EmployeeGuranterWorkingContact?.map(
                                        (contact: any) => (
                                          <Fragment key={contact.id}>
                                            <TableRow>
                                              {contact.type ===
                                                enums.ContactType.CellPhone && (
                                                <TableCell>CellPhone</TableCell>
                                              )}
                                              {contact.type ===
                                                enums.ContactType.Email && (
                                                <TableCell>Email</TableCell>
                                              )}
                                              {contact.type ===
                                                enums.ContactType.Fax && (
                                                <TableCell>Fax</TableCell>
                                              )}
                                              {contact.type ===
                                                enums.ContactType.WorkPhone && (
                                                <TableCell>WorkPhone</TableCell>
                                              )}
                                              {contact.type ===
                                                enums.ContactType.PoBox && (
                                                <TableCell>PoBox</TableCell>
                                              )}
                                              {contact.type ===
                                                enums.ContactType.HomePhone && (
                                                <TableCell>HomePhone</TableCell>
                                              )}
                                              <TableCell>
                                                {contact.value}
                                              </TableCell>
                                              <TableCell>
                                                <Typography>
                                                  Working Firm contact
                                                </Typography>
                                              </TableCell>

                                              <TableCell>
                                                <Button
                                                  variant="outlined"
                                                  size="small"
                                                  color="secondary"
                                                  onClick={() =>
                                                    UpdateContact(
                                                      contact.id,
                                                      contact.contactCategory
                                                    )
                                                  }
                                                >
                                                  Edit
                                                </Button>
                                              </TableCell>
                                            </TableRow>
                                          </Fragment>
                                        )
                                      )}
                                    </AccordionDetails>
                                  </Accordion>
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {!items && (
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <Typography> No Data Available</Typography>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      {OpenEmployeeGuaranterDialog && (
        <EmployeeGuaranterDialog
          onClose={() => {
            closeDialogGuaranter();
          }}
        />
      )}
      {OpenAddressDialog && selectedAddress && (
        <AddressDialog
          onClose={() => OpenAddressDialogClose()}
          title="Add Address"
          requestId={selectedAddress}
          addressType={EmployeeGuarante}
        />
      )}
      {OpenContactDialog && (
        <ContactDialogNew
          requestId={selectedContact}
          onClose={() => {
            OpenContactDialogClose();
          }}
          title="Adding Guaranter Contact"
          contactCategory={EmployeeContactCategory as any}
        />
      )}
      {OpenUpdateContactDialog && (
        <ContactUpdateDialogNew
          requestId={updatedcontact}
          onClose={() => {
            OpenContactDialogClose();
          }}
          title="Update Guaranter Contact"
          contactCategory={Category}
        />
      )}
      {OpenUpdateDialog && Guaranter !== null && (
        <EmployeeGuarantersUpdateDialog
          Id={Guaranter}
          onClose={UpdateDialogClose}
        />
      )}
      {AddressUpdateDialogOpend && (
        <AddressUpdateDialog
          requestId={updatedAddress}
          onClose={() => {
            OpenAddressDialogClose();
          }}
          title="Update Address"
        />
      )}
    </Box>
  );
};
