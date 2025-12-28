import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Card للوحدات */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Units</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              component={Link}
              to="/units"
            >
              Manage Units
            </Button>
          </Paper>
        </Grid>

        {/* Card للمنتجات (مستقبلًا) */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Products</Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              disabled
            >
              Coming Soon 55
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
