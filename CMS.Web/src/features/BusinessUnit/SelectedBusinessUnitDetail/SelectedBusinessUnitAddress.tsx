import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { AddressType, Country } from "../../../app/api/enums";
import {
  BusinessUnitDto,
  useGetAddressByRequestIdQuery,
} from "../../../app/store";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeIcon from "@mui/icons-material/Home";
import PinDropIcon from "@mui/icons-material/PinDrop";
import ExploreIcon from "@mui/icons-material/Explore";

const getCountryName = (countryCode?: Country): string => {
  return countryCode ? Country[countryCode] : "-- Not Selected --";
};

interface SelectedBusinessUnitAddressProps {
  businessUnit: BusinessUnitDto;
}

export const SelectedBusinessUnitAddress: React.FC<
  SelectedBusinessUnitAddressProps
> = ({ businessUnit }) => {
  const { data: businessUnitAddress } = useGetAddressByRequestIdQuery(
    {
      requestId: businessUnit.id,
      addressType: AddressType.BusinessUnitAddress,
    },
    { skip: !businessUnit.id }
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <PublicIcon color="action" />
              <Typography variant="body2" color="textSecondary" noWrap>
                Country:
              </Typography>

              <Typography
                variant="body1"
                fontWeight="bold"
                noWrap
                sx={{ wordBreak: "break-all" }}
              >
                {getCountryName(businessUnitAddress?.country)}
              </Typography>
            </Box>{" "}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationCityIcon color="action" />
              <Typography variant="body2" color="textSecondary" noWrap>
                Region / City Admin:
              </Typography>

              <Typography
                variant="body1"
                fontWeight="bold"
                noWrap
                sx={{ wordBreak: "break-all" }}
              >
                {businessUnitAddress?.regionName || "-- Not Specified --"}
              </Typography>
            </Box>{" "}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <ExploreIcon color="action" />
              <Typography variant="body2" color="textSecondary" noWrap>
                Sub City / Zone:
              </Typography>

              <Typography
                variant="body1"
                fontWeight="bold"
                noWrap
                sx={{ wordBreak: "break-all" }}
              >
                {businessUnitAddress?.subCityName || "-- Not Specified --"}
              </Typography>
            </Box>{" "}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationCityIcon color="action" />
              <Typography variant="body2" color="textSecondary" noWrap>
                City:
              </Typography>

              <Typography
                variant="body1"
                fontWeight="bold"
                noWrap
                sx={{ wordBreak: "break-all" }}
              >
                {businessUnitAddress?.city || "-- Not Specified --"}
              </Typography>
            </Box>{" "}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <PinDropIcon color="action" />
              <Typography variant="body2" color="textSecondary" noWrap>
                Woreda:
              </Typography>

              <Typography
                variant="body1"
                fontWeight="bold"
                noWrap
                sx={{ wordBreak: "break-all" }}
              >
                {businessUnitAddress?.woreda || "-- Not Specified --"}
              </Typography>
            </Box>{" "}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <PinDropIcon color="action" />
              <Typography variant="body2" color="textSecondary" noWrap>
                Kebele:
              </Typography>

              <Typography
                variant="body1"
                fontWeight="bold"
                noWrap
                sx={{ wordBreak: "break-all" }}
              >
                {businessUnitAddress?.kebele || "-- Not Specified --"}
              </Typography>
            </Box>{" "}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <HomeIcon color="action" />
              <Typography variant="body2" color="textSecondary" noWrap>
                House No. / Plot No.:
              </Typography>

              <Typography
                variant="body1"
                fontWeight="bold"
                noWrap
                sx={{ wordBreak: "break-all" }}
              >
                {businessUnitAddress?.houseNumber || "-- Not Specified --"}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Add more address-related fields here if available in your BusinessUnitAddressDto */}
      </Grid>
    </Box>
  );
};
