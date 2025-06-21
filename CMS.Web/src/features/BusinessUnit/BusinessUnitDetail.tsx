import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  enums,
  useGetAddressByRequestIdQuery,
  useGetContactByRequestIdQuery,
  useSearchAllBusinessUnitsQuery,
} from "../../app/api";
import {
  Box,
  Button,
  Container,
  createTheme,
  Divider,
  Grid,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { AddressDialog } from "../Address/AddressDialog";
import {
  AddressType,
  ContactCategory,
  ContactType,
  Country,
  Status,
} from "../../app/api/enums";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { ContactDialog } from "../Contact/ContactDialog";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import DialpadIcon from "@mui/icons-material/Dialpad";
import TtyIcon from "@mui/icons-material/Tty";
const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: "body2",
          },
          style: {
            fontSize: 13,
          },
        },
      ],
    },
  },
});

const BusinessUnitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: businessUnits } = useSearchAllBusinessUnitsQuery();
  const [selectedAddress, setSelectedAddress] = useState<number>();
  const [selectedContact, setSelectedContact] = useState<number>();
  const [contactType, setContactType] = useState<enums.ContactType>();

  // Find the business unit by ID
  const businessUnit = businessUnits?.find((unit) => unit.id === parseInt(id!));

  const { data: address, refetch } = useGetAddressByRequestIdQuery(
    {
      requestId: businessUnit?.id,
      addressType: AddressType.BusinessUnitAddress,
    },
    {
      skip: !businessUnit?.id,
      // pollingInterval: 400, // Skip the query if no business unit is selected
    }
  );
  const { data: email } = useGetContactByRequestIdQuery(
    {
      requestId: businessUnit?.id,
      contactCategory: ContactCategory.BusinessUnitContact,
      type: ContactType.Email,
    },
    {
      skip: !businessUnit?.id, // Skip the query if no business unit is selected
    }
  );
  const { data: cellPhone } = useGetContactByRequestIdQuery(
    {
      requestId: businessUnit?.id,
      contactCategory: ContactCategory.BusinessUnitContact,
      type: ContactType.CellPhone,
    },
    {
      skip: !businessUnit?.id, // Skip the query if no business unit is selected
    }
  );
  const { data: homePhone } = useGetContactByRequestIdQuery(
    {
      requestId: businessUnit?.id,
      contactCategory: ContactCategory.BusinessUnitContact,
      type: ContactType.HomePhone,
    },
    {
      skip: !businessUnit?.id, // Skip the query if no business unit is selected
    }
  );
  const { data: workPhone } = useGetContactByRequestIdQuery(
    {
      requestId: businessUnit?.id,
      contactCategory: ContactCategory.BusinessUnitContact,
      type: ContactType.WorkPhone,
    },
    {
      skip: !businessUnit?.id, // Skip the query if no business unit is selected
    }
  );
  const { data: fax } = useGetContactByRequestIdQuery(
    {
      requestId: businessUnit?.id,
      contactCategory: ContactCategory.BusinessUnitContact,
      type: ContactType.Fax,
    },
    {
      skip: !businessUnit?.id, // Skip the query if no business unit is selected
    }
  );
  const { data: poBox } = useGetContactByRequestIdQuery(
    {
      requestId: businessUnit?.id,
      contactCategory: ContactCategory.BusinessUnitContact,
      type: ContactType.PoBox,
    },
    {
      skip: !businessUnit?.id, // Skip the query if no business unit is selected
    }
  );

  if (!businessUnit) {
    return <Box>Business Unit not found!</Box>;
  }

  return (
    <Container sx={{ marginY: 4 }}>
      <ThemeProvider theme={theme}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper elevation={4}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  marginTop: 1,
                  color: "#21329e",
                  padding: 1,
                }}
                variant="h5"
              >
                {" "}
                {businessUnit.name}{" "}
              </Typography>

              <Divider />
              <Box px={1} sx={{ padding: 1 }}>
                <Typography sx={{}} variant="body1">
                  {" "}
                  Business Unit Name : {businessUnit.name}{" "}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body1">
                  {" "}
                  Business Unit Id : {businessUnit.businessUnitID}{" "}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body1">
                  {" "}
                  Business Unit Type : {businessUnit.businessUnitTypeName}{" "}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body1">
                  {" "}
                  Parent Business Unit : {
                    businessUnit.parentBusinessUnitName
                  }{" "}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={4}>
              <Box px={1} sx={{}}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    marginTop: 1,
                    color: "#21329e",
                    padding: 1,
                  }}
                >
                  {" "}
                  Business Unit Address
                  {businessUnit.status === Status.Active && (
                    <Button
                      size="small"
                      onClick={() => setSelectedAddress(businessUnit.id)}
                      sx={{
                        position: "relative",
                        top: "1px",
                        float: "right",
                      }}
                    >
                      <AddLocationAltIcon />
                    </Button>
                  )}
                </Typography>
              </Box>
              <hr />
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body1">
                  {" "}
                  Country : {address?.country
                    ? Country[address.country]
                    : ""}{" "}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body1">
                  {" "}
                  Region/City Admin : {address?.regionName}{" "}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body1">
                  {" "}
                  SubCity/Zone : {address?.subCityName}{" "}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body1"> City: {address?.city} </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body1">
                  {" "}
                  Woreda : {address?.woreda}{" "}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body1">
                  {" "}
                  Kebele : {address?.kebele}{" "}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body1">
                  {" "}
                  House Number : {address?.houseNumber}{" "}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Paper elevation={4}>
              <Box px={1} sx={{}}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    marginTop: 1,
                    color: "#21329e",
                    padding: 1,
                  }}
                >
                  {" "}
                  Business Unit Contact
                </Typography>
              </Box>
              <hr />
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body2">
                  {businessUnit.status === Status.Active && (
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedContact(businessUnit.id);
                        setContactType(enums.ContactType.Email);
                      }}
                    >
                      <ContactMailIcon />
                    </Button>
                  )}
                  Emial : {email?.value}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body2">
                  {businessUnit.status === Status.Active && (
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedContact(businessUnit.id);
                        setContactType(enums.ContactType.CellPhone);
                      }}
                    >
                      <DialpadIcon />
                    </Button>
                  )}
                  Manager Phone : {cellPhone?.value}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body2">
                  {businessUnit.status === Status.Active && (
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedContact(businessUnit.id);
                        setContactType(enums.ContactType.HomePhone);
                      }}
                    >
                      <TtyIcon />
                    </Button>
                  )}
                  Work Phone 1 : {homePhone?.value}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body2">
                  {businessUnit.status === Status.Active && (
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedContact(businessUnit.id);
                        setContactType(enums.ContactType.WorkPhone);
                      }}
                    >
                      <TtyIcon />
                    </Button>
                  )}
                  Work Phone 2 : {workPhone?.value}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body2">
                  {businessUnit.status === Status.Active && (
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedContact(businessUnit.id);
                        setContactType(enums.ContactType.Fax);
                      }}
                    >
                      <EditNoteIcon />
                    </Button>
                  )}
                  Fax : {fax?.value}
                </Typography>
              </Box>
              <Box px={1} sx={{ padding: 1 }}>
                <Typography variant="body2">
                  {businessUnit.status === Status.Active && (
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedContact(businessUnit.id);
                        setContactType(enums.ContactType.PoBox);
                      }}
                    >
                      <SubtitlesIcon />
                    </Button>
                  )}
                  PoBox : {poBox?.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </ThemeProvider>
      {selectedAddress && (
        <AddressDialog
          requestId={selectedAddress}
          onClose={() => {
            setSelectedAddress(undefined);
          }}
          title="Edit Address"
          addressType={AddressType.BirthPlaceAddress}
        />
      )}
      {selectedContact && (
        <ContactDialog
          requestId={selectedContact}
          contactCategory={ContactCategory.BusinessUnitContact}
          onClose={() => {
            setSelectedContact(undefined);
          }}
          title=""
          contactType={contactType}
        />
      )}
    </Container>
  );
};

export default BusinessUnitDetail;
