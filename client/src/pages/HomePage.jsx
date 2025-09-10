import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Products App
      </Typography>
      <Typography variant="body1" gutterBottom>
        This is the home page. Use the dashboard to manage units and products.
      </Typography>

      <Box mt={3}>
        <Button
          variant="contained"
          component={Link}
          to="/dashboard"
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
