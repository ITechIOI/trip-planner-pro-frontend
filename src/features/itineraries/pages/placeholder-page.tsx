import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppLayout } from "@/shared/components/app-layout";
import packingIcon from "@/assets/images/packing.png";
import budgetsIcon from "@/assets/images/budgets.png";

export type PlaceholderPageProps = {
  tripId: number;
  title: string;
  description: string;
};

export const PlaceholderPage = ({
  tripId,
  title,
  description,
}: PlaceholderPageProps) => (
  <AppLayout tripId={tripId}>
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        {title === "Packing" ? (
          <Box
            component="img"
            src={packingIcon}
            alt="Packing"
            sx={{ width: 36, height: 36 }}
          />
        ) : null}
        {title === "Budget" ? (
          <Box
            component="img"
            src={budgetsIcon}
            alt="Budget"
            sx={{ width: 36, height: 36 }}
          />
        ) : null}
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
  </AppLayout>
);

export default PlaceholderPage;
