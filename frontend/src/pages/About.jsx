import "../styles/CreateCards.css";
import "../styles/About.css";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

export default function About(theme) {
  return (
    <>
      {
        <ThemeProvider theme={theme}>
          <Box component="div" className="containerAbout">
            <Typography variant="h3">
              <div>Short tutorial</div>
            </Typography>
            <Typography variant="h1">SB database by Samin</Typography>
            <br />
            <Typography
              component="div"
              variant="body1"
              className="containerAboutText">
              <div>
              We are meeting targets in call centers requires organization, time management ability
                and ability to handle pressures. It is important to be active, to focus on goals
                the main ones and give quick solutions. Excellent communication skills are required, you understand
                the customer and ability to internalize effectively. It is important to be empathetic and professional as well
                in challenging times. to engage clients in order to achieve agreed business goals,
                while maintaining the quality of service and courteous treatment. You must also be flexible, stable
                And ready to learn and adapt yourself to the needs of customers.
              </div>
            </Typography>
            <br />
            <Typography variant="h4">
              So what can our system actually do
            </Typography>
            <br />
            <Typography
              component="div"
              variant="body1"
              className="containerAboutText">
              <div>
              The data application effectively organizes employee productivity metrics, providing insights
                detailed on an individual level by month and day. This segmentation allows a thorough analysis,
                and offers visibility from team leaders to center managers. By tracking performance
                Two days, leaders can track the progress of each employee,
                Identify areas for improvement and identify high performers immediately. It makes it easy
                Data-driven decision-making, fostering excellence in the workplace
                and optimization of efficiency. This professional tool is invaluable for
                Organizations that strive for productivity and success.
              </div>
            </Typography>
            <Typography variant="h2" style={{ direction: "ltr" }}>
              <div> And how to use it </div>
            </Typography>
            <br />
            <Box
              className="whoCan"
              style={{ textAlign: "justify", direction: "ltr", margin: "2px" }}>
              <List>
                <ListItem>
                  <ListItemText
                    component="div"
                    variant="body1"
                    primary="Agent/User :"
                    secondary="The role of the representative/agent involves daily data updates, striving for improvement. They track call volumes, hang-ups and sales daily, and analyze monthly accruals to assess performance against set targets"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    component="div"
                    variant="body1"
                    primary="Business/TeamLeader :"
                    secondary=" theteam leader's responsibilities include guiding, motivating and supervising team members, ensuring productivity and achieving goals. They track productivity data and analyze the results to understand what steps to take to improve performance"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    component="div"
                    variant="body1"
                    primary="Admin/CenterManger :"
                    secondary="The system administrator monitors system data and analyzes the information to understand what steps to take to improve performance. It can add and update users, set goals and define roles"
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
        </ThemeProvider>
      }
    </>
  );
}
