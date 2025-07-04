import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
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
import { Fragment, useState, useEffect } from "react";
import {
  AddressDto,
  EmployeeFamilyDto,
  JobCatagory,
  useGetFamilyOfAnEmployeeQuery,
} from "../../../../app/api";
import { KeyValuePair } from "../../../../components/KeyValuePair";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Add from "@mui/icons-material/Add";
import { EmployeeFamilyDialog } from "./EmployeeFamilyDialog";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import { ContactDialogNew } from "../../../Contact/ContactDialogNew";
import { AddressDialog } from "../../../Address/AddressDialog";
import {
  enums,
  useGetAddressQueryByEntityTypeQuery,
  useGetContactsByEntityQuery,
} from "../../../../app/api";
import { AddressUpdateDialog } from "../../../Address/AddressUpdateDialog";
import { ContactUpdateDialogNew } from "../../../Contact/ContactUpdateDialogNew";
import { EmployeeFamilyActivateButton } from "./EmployeeFamilyActivateButton";
import { EmployeeFamilyDeActivateButton } from "./EmployeeFamilyDeActivateButton";
import {
  ContactType,
  ContactCategory,
  AddressType,
  FamilyType,
  Activation,
} from "../../../../app/api/enums";
import { EmployeeFamilyUpdateDialog } from "./EmployeeFamilyUpdateDialog";
import { Home, More, Phone } from "@mui/icons-material";
import { usePermission } from "../../../../hooks";

interface EmployeeChildProps {
  items?: EmployeeFamilyDto[];
  employeeId: number;
  hideWorkflowComment?: boolean;
  suppressActionColumn?: boolean;
}

export const EmployeeFamily = ({
  items = [],
  hideWorkflowComment,
  suppressActionColumn,
  employeeId,
}: EmployeeChildProps) => {
  const [OpenEmployeeFamilyDialog, setOpenemployeeFamilyDialoge] =
    useState<boolean>(false);
  const permissions = usePermission();
  const [selectedContact, setSelectedContact] = useState<number>();
  const [selectedAddress, setSelectedAddres] = useState<number>();
  const [contactType, setContactType] = useState<ContactType>();
  const [OpenContactDialog, setOpenContactDialog] = useState<boolean>(false);
  const [OpenAddressDialog, setOpenAddressDialog] = useState<boolean>(false);
  const [selectedFamily, setSelectedFamily] = useState<number | undefined>();
  const [OpenUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<{
    [key: number]: HTMLElement | null;
  }>({}); // Map to store anchorEl for each row
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

  const [EmployeeFamilytype, setEmployeeFamilyType] = useState<
    FamilyType | undefined
  >();
  //
  const {
    data: EmployeeFamilyData,
    isLoading: isFamilyLoading,
    refetch,
  } = useGetFamilyOfAnEmployeeQuery({ employeeId: employeeId });

  // Add a state to store the family count
  const [familyCount, setFamilyCount] = useState<number>(0);

  // Update familyCount whenever EmployeeFamilyData changes
  useEffect(() => {
    if (EmployeeFamilyData) {
      setFamilyCount(EmployeeFamilyData.length);
    }
  }, [EmployeeFamilyData]);

  //
  const [FamilyContactCategory, setFamilyContactCategory] = useState<
    enums.ContactCategory | undefined
  >();
  const AddContact = (
    id: number | undefined,
    familyType: FamilyType | undefined
  ) => {
    setSelectedContact(id);
    if (familyType === enums.FamilyType.EmployeeParent) {
      setFamilyContactCategory(enums.ContactCategory.EmployeeParentContact);
    } else if (familyType === enums.FamilyType.EmployeeSpouse) {
      setFamilyContactCategory(enums.ContactCategory.EmployeeSpouseContact);
    }
    setOpenContactDialog(true);
  };
  const [addressType, SetaddressType] = useState<AddressType | undefined>();

  const AddAddress = (
    id: number | undefined,
    FamilyType: FamilyType | undefined
  ) => {
    setSelectedAddres(id);
    if (FamilyType === enums.FamilyType.EmployeeParent) {
      SetaddressType(enums.AddressType.ParentAddress);
    } else if (FamilyType === enums.FamilyType.EmployeeSpouse) {
      SetaddressType(enums.AddressType.SpouseAddress);
    }
    setOpenAddressDialog(true);
  };

  const OpenContactDialogClose = () => {
    setSelectedContact(undefined);
    setOpenContactDialog(false);
    setOpenUpdateContactDialog(false);
    if (selectedIdForAddress !== undefined) {
      AddressQueryByEntityType();
    }
    if (selectedIdForContact !== undefined) {
      ContactsByEntity();
    }
    // Refetch family data after contact is added/updated
    refetch();
  };

  const OpenAddressDialogClose = () => {
    setSelectedAddres(undefined);
    setupdatedAddress(undefined);
    setOpenAddressDialog(false);
    setAddressUpdateDialogOpend(false);
    if (selectedIdForAddress !== undefined) {
      AddressQueryByEntityType();
    }
    if (selectedIdForContact !== undefined) {
      ContactsByEntity();
    }
    // Refetch family data after address is added/updated
    refetch();
  };

  //

  const UpdateDialog = (id: number | undefined) => {
    setSelectedFamily(id);
    setOpenUpdateDialog(true);
  };
  const UpdateDialogClose = () => {
    refetch();
    setSelectedFamily(undefined);
    setOpenUpdateDialog(false);
  };
  const FamilyDialogDialogClose = () => {
    refetch(); // This is already calling refetch, which is good
    setOpenemployeeFamilyDialoge(false);
  };
  const { data: EmployeeFamilyAddress, refetch: AddressQueryByEntityType } =
    useGetAddressQueryByEntityTypeQuery(
      { entityId: selectedIdForAddress },
      { skip: selectedIdForAddress === undefined }
    );
  const { data: EmployeeFamilyContact, refetch: ContactsByEntity } =
    useGetContactsByEntityQuery(
      { employeeId: selectedIdForContact },
      { skip: selectedIdForContact === undefined }
    );

  const showAddress = (id: number | undefined) => {
    setSelectedIdForAddress(id);
    setSelectedIdForContact(id);
    setExpandedRow(expandedRow === id ? undefined : id); // Update the selected ID to trigger the query
  };
  const showContact = (id: number | undefined) => {
    setSelectedIdForContact(id);
    setExpandedRow(expandedRow === id ? undefined : id);
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
    console.log(Category + "Category");
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
      [rowId]: null,
    }));
    if (selectedIdForAddress !== undefined) {
      AddressQueryByEntityType();
    }
    if (selectedIdForContact !== undefined) {
      ContactsByEntity();
    }
    // Refetch family data in case activate/deactivate affects the overall list (though unlikely for just a header count)
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
            !OpenEmployeeFamilyDialog && setOpenemployeeFamilyDialoge(true)
          }
          variant="contained"
          startIcon={<Add />}
          size="small"
          color="primary"
          disabled={!permissions.CanCreateOrUpdateEmployeeInfo}
        >
          Add Employee Family
        </Button>
      </Box>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#3f51b5" }} />}
          sx={{ color: "#3f51b5" }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Employee Family Information ({familyCount} Members) {/* Updated line */}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {EmployeeFamilyData && (
              <Paper elevation={3}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", width: "80px" }}>
                          Family
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", width: "100%" }}>
                          Full Name
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
                      {(EmployeeFamilyData || []).map(
                        (item: EmployeeFamilyDto) => (
                          <Fragment key={item.id}>
                            <TableRow>
                              {item.familyType ===
                                enums.FamilyType.EmployeeChild && (
                                <TableCell>Child</TableCell>
                              )}
                              {item.familyType ===
                                enums.FamilyType.EmployeeParent && (
                                <TableCell>Parent</TableCell>
                              )}
                              {item.familyType ===
                                enums.FamilyType.EmployeeSpouse && (
                                <TableCell>Spouse</TableCell>
                              )}
                              <TableCell>{item.fullName}</TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="primary"
                                  disabled={
                                    !permissions.CanCreateOrUpdateEmployeeInfo
                                  }
                                  onClick={() => UpdateDialog(item.id)}
                                >
                                  Edit
                                </Button>
                              </TableCell>
                              <TableCell>
                                {item.isActive === Activation.Active ? (
                                  <EmployeeFamilyDeActivateButton
                                    id={item.id ?? 0}
                                    disabled={
                                      !permissions.CanDeactivateEmployeePersonalInfo
                                    }
                                  />
                                ) : (
                                  <EmployeeFamilyActivateButton
                                    id={item.id ?? 0}
                                    disabled={
                                      !permissions.CanActivateEmployeePersonalInfo
                                    }
                                  />
                                )}
                              </TableCell>
                              {item.familyType !==
                                enums.FamilyType.EmployeeChild && (
                                <TableCell>
                                  <IconButton
                                    color="primary"
                                    onClick={() => showAddress(item.id)}
                                    sx={{
                                      transition: "transform 0.2s ease",
                                      "&:hover": { transform: "scale(1.1)" },
                                    }}
                                  >
                                    <More />
                                  </IconButton>
                                </TableCell>
                              )}
                              {item.familyType !==
                                enums.FamilyType.EmployeeChild && (
                                <TableCell>
                                  <Box sx={{ display: "flex" }}>
                                    <Box sx={{ marginLeft: "auto" }}>
                                      <IconButton
                                        disabled={
                                          !permissions.CanCreateOrUpdateEmployeeInfo
                                        }
                                        onClick={(event) =>
                                          handleClick(event, item.id)
                                        }
                                        sx={{
                                          transition: "transform 0.2s ease",
                                          "&:hover": {
                                            transform: "scale(1.1)",
                                          },
                                        }}
                                      >
                                        <MoreHoriz />
                                      </IconButton>
                                    </Box>
                                    <Menu
                                      anchorEl={
                                        item.id !== undefined
                                          ? anchorEl[item.id]
                                          : null
                                      }
                                      open={Boolean(
                                        item.id !== undefined &&
                                          anchorEl[item.id]
                                      )}
                                      onClose={() => handleClose(item.id)}
                                    >
                                      <MenuItem
                                        disabled={!permissions.CanCreateUpdateAddressAndContact}
                                        onClick={() =>
                                          AddContact(item.id, item.familyType)
                                        }
                                      >
                                        Add Contact
                                      </MenuItem>
                                      <MenuItem
                                        disabled={!permissions.CanCreateUpdateAddressAndContact}
                                        onClick={() =>
                                          AddAddress(item.id, item.familyType)
                                        }

                                      >
                                        Add Address
                                      </MenuItem>
                                    </Menu>
                                  </Box>
                                </TableCell>
                              )}
                            </TableRow>
                            {expandedRow === item.id && (
                              <TableRow>
                                <TableCell colSpan={4} sx={{ padding: 0 }}>
                                  {/* Show Address Details Accordion */}
                                  <Accordion
                                    sx={{ marginTop: "0.5rem", paddingLeft: 2 }}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      sx={{ fontSize: "0.875rem" }}
                                    >
                                      <Icon
                                        component={Home}
                                        sx={{
                                          marginRight: 1,
                                          color: "primary.dark",
                                        }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{ paddingTop: 0.5 }}
                                      >
                                        Show Address Details
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails
                                      sx={{
                                        padding: "0.5rem 1rem",
                                        backgroundColor: "#f4f6f8",
                                      }}
                                    >
                                      {EmployeeFamilyAddress?.map(
                                        (address: AddressDto) => (
                                          <Fragment key={address.id}>
                                            <TableHead>
                                              <TableRow
                                                sx={{ fontWeight: "bold" }}
                                              >
                                                <TableCell
                                                  sx={{ fontWeight: "bold" }}
                                                >
                                                  Region
                                                </TableCell>
                                                <TableCell
                                                  sx={{ fontWeight: "bold" }}
                                                >
                                                  SubCity
                                                </TableCell>
                                                <TableCell
                                                  sx={{ fontWeight: "bold" }}
                                                >
                                                  City
                                                </TableCell>
                                                <TableCell
                                                  sx={{ fontWeight: "bold" }}
                                                >
                                                  Woreda
                                                </TableCell>
                                                <TableCell
                                                  sx={{ fontWeight: "bold" }}
                                                >
                                                  Kebele
                                                </TableCell>
                                                <TableCell
                                                  sx={{ fontWeight: "bold" }}
                                                >
                                                  HouseNo
                                                </TableCell>
                                                <TableCell
                                                  sx={{ fontWeight: "bold" }}
                                                >
                                                  Actions
                                                </TableCell>
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
                                                {address.city}
                                              </TableCell>
                                              <TableCell>
                                                {address.woreda}
                                              </TableCell>
                                              <TableCell>
                                                {address.kebele}
                                              </TableCell>
                                              <TableCell>
                                                {address.houseNumber}
                                              </TableCell>
                                              <TableCell>
                                                <Button
                                                  variant="outlined"
                                                  size="small"
                                                  color="secondary"
                                                  disabled={!permissions.CanCreateUpdateAddressAndContact}
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
                                  </Accordion>

                                  {/* Show Contact Details Accordion */}
                                  <Accordion
                                    sx={{ marginTop: "0.5rem", paddingLeft: 2 }}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      sx={{
                                        fontSize: "0.875rem",
                                        paddingRight: "10px",
                                      }}
                                    >
                                      <Icon
                                        component={Phone}
                                        sx={{
                                          marginRight: 1,
                                          color: "primary.dark",
                                        }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{ paddingTop: 0.5 }}
                                      >
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
                                      {EmployeeFamilyContact?.map(
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
                                                <Button
                                                  variant="outlined"
                                                  size="small"
                                                  color="secondary"
                                                  disabled={!permissions.CanCreateUpdateAddressAndContact}
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
          </Box>
        </AccordionDetails>
      </Accordion>

      {OpenEmployeeFamilyDialog && (
        <EmployeeFamilyDialog onClose={() => FamilyDialogDialogClose()} />
      )}
      {OpenAddressDialog && selectedAddress && (
        <AddressDialog
          requestId={selectedAddress}
          onClose={() => OpenAddressDialogClose()} // Changed to call the unified close handler
          title="Add Employee Family Address"
          addressType={addressType}
        />
      )}
      {OpenContactDialog && (
        <ContactDialogNew
          requestId={selectedContact}
          onClose={() => OpenContactDialogClose()} // Changed to call the unified close handler
          title="Adding Employee Family Contact"
          contactCategory={FamilyContactCategory as any}
        />
      )}

      {OpenUpdateContactDialog && (
        <ContactUpdateDialogNew
          requestId={updatedcontact}
          onClose={() => {
            OpenContactDialogClose();
          }}
          title="Update Employee family Contact"
          contactCategory={Category}
        />
      )}
      {OpenUpdateDialog && selectedFamily !== null && (
        <EmployeeFamilyUpdateDialog
          Id={selectedFamily}
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