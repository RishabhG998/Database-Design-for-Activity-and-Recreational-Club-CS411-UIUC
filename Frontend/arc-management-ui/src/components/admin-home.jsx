import { PureComponent } from "react";
import { withRouter } from './common/withRouter';
import { connect } from 'react-redux'
import React from "react";
import Button from '@mui/material/Button';
import stats_img from './images/stats.png';
import supervisor_img from './images/supervisor.png';
import equipment_img from './images/equipment.png';
import facilities_img from './images/facilities.png';
import equipment_rent_img from './images/equipment_rent.png';
import facilities_booking_img from './images/facilities_booking.png';
import event_img from './images/event.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Card, CardActions, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
// import FaceIcon from '@mui/icons-material/Face';
import SendIcon from '@mui/icons-material/Send';

const theme = createTheme();

export class AdminHome extends PureComponent{

    constructor(props){
      super(props);
    }

    onClick = e => {
        console.log(e.target.name);
        // debugger;
    };


    render() {
        return (
            <div>
                {/* <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6, }}>

                </Box> */}
                <Container sx={{ py: 8 }} maxWidth="md">
                    <Grid container spacing={4}>
                        <Grid item={1} xs={12} sm={6} md={4} sx={{  display: 'flex', flexDirection: 'column'}} >
                            <Card
                            sx={{  display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", boxShadow: 12}} 
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                    // 16:9
                                        pt: '10%',
                                        width: '44%',
                                    }}
                                    image={stats_img}
                                    alt="random"
                                    name="Stats"
                                />
                                <CardContent sx={{ flexGrow: 1 }}> 
                                    <Typography gutterBottom variant="h5" component="h2">
                                    See Stats
                                    </Typography>
                                    {/* <Typography>
                                    Click here to see ARC statistics
                                    </Typography> */}
                                </CardContent>
                                {/* <FaceIcon/> */}
                                <CardActions sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
                                    <Button sx={{alignItems: "center", justifyContent: "center", marginBottom: "21%"}} name="see_stats_card" size="small" onClick={this.onClick} variant="outlined">View</Button>
                                    {/* <Button size="small">Edit</Button> */}
                                </CardActions>
                            </Card> 
                        </Grid>
                        <Grid item={1} xs={12} sm={6} md={4} sx={{  display: 'flex', flexDirection: 'column'}} >
                            <Card
                            sx={{  display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", boxShadow: 12}} 
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                    // 16:9
                                        pt: '10%',
                                        width: '44%',
                                    }}
                                    image={supervisor_img}
                                    alt="random"
                                    name="Stats"
                                />
                                <CardContent sx={{ flexGrow: 1 }}> 
                                    <Typography gutterBottom variant="h5" component="h2">
                                    Supervisors
                                    </Typography>
                                    {/* <Typography>
                                    Click here manage Supervisors
                                    </Typography> */}
                                </CardContent>
                            <CardActions sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
                                <Button sx={{alignItems: "center", justifyContent: "center", marginBottom: "21%"}} name="supervisors_card" size="small" onClick={this.onClick} variant="outlined">View</Button>
                                {/* <Button size="small">Edit</Button> */}
                            </CardActions>
                            </Card> 
                        </Grid>
                        <Grid item={1} xs={12} sm={6} md={4} sx={{  display: 'flex', flexDirection: 'column'}} >
                            <Card
                            sx={{  display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", boxShadow: 12}} 
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                    // 16:9
                                        pt: '10%',
                                        width: '44%',
                                    }}
                                    image={equipment_img}
                                    alt="random"
                                    name="Stats"
                                />
                                <CardContent sx={{ flexGrow: 1 }}> 
                                    <Typography gutterBottom variant="h5" component="h2">
                                    Equipments
                                    </Typography>
                                    {/* <Typography>
                                    Click here to manage Equipments
                                    </Typography> */}
                                </CardContent>
                            <CardActions sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
                                <Button sx={{alignItems: "center", justifyContent: "center", marginBottom: "21%"}} name="equipments_card" size="small" onClick={this.onClick} variant="outlined">View</Button>
                                {/* <Button size="small">Edit</Button> */}
                            </CardActions>
                            </Card> 
                        </Grid>
                        <Grid item={1} xs={12} sm={6} md={4} sx={{  display: 'flex', flexDirection: 'column'}} >
                            <Card
                            sx={{  display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", boxShadow: 12}} 
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                    // 16:9
                                        pt: '10%',
                                        width: '44%',
                                    }}
                                    image={facilities_img}
                                    alt="random"
                                    name="Stats"
                                />
                                <CardContent sx={{ flexGrow: 1 }}> 
                                    <Typography gutterBottom variant="h5" component="h2">
                                    Facilities
                                    </Typography>
                                    {/* <Typography>
                                    Click here to manage Facilities
                                    </Typography> */}
                                </CardContent>
                            <CardActions sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
                                <Button sx={{alignItems: "center", justifyContent: "center", marginBottom: "21%"}} name="facilities_card" size="small" onClick={this.onClick} variant="outlined">View</Button>
                                {/* <Button size="small">Edit</Button> */}
                            </CardActions>
                            </Card> 
                        </Grid>
                        <Grid item={1} xs={12} sm={6} md={4} sx={{  display: 'flex', flexDirection: 'column'}} >
                            <Card
                            sx={{  display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", boxShadow: 12}} 
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                    // 16:9
                                        pt: '10%',
                                        width: '44%',
                                    }}
                                    image={equipment_rent_img}
                                    alt="random"
                                    name="Stats"
                                />
                                <CardContent sx={{ flexGrow: 1 }}> 
                                    <Typography gutterBottom variant="h5" component="h2">
                                    Equipment Renting
                                    </Typography>
                                    {/* <Typography>
                                    Click here to check Equipment Renting information
                                    </Typography> */}
                                </CardContent>
                            <CardActions sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
                                <Button sx={{alignItems: "center", justifyContent: "center", marginBottom: "21%"}} name="equipment_renting_card" size="small" onClick={this.onClick} variant="outlined">View</Button>
                                {/* <Button size="small">Edit</Button> */}
                            </CardActions>
                            </Card> 
                        </Grid>
                        <Grid item={1} xs={12} sm={6} md={4} sx={{  display: 'flex', flexDirection: 'column'}} >
                            <Card
                            sx={{  display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", boxShadow: 12}} 
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                    // 16:9
                                        pt: '10%',
                                        width: '44%',
                                    }}
                                    image={facilities_booking_img}
                                    alt="random"
                                    name="Stats"
                                />
                                <CardContent sx={{ flexGrow: 1 }}> 
                                    <Typography gutterBottom variant="h5" component="h2">
                                    Facilities Booking
                                    </Typography>
                                    {/* <Typography>
                                    Click here to check Facilites Bookings made
                                    </Typography> */}
                                </CardContent>
                            <CardActions sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
                                <Button sx={{alignItems: "center", justifyContent: "center", marginBottom: "21%"}} name="facilities_booking_card" size="small" onClick={this.onClick} variant="outlined">View</Button>
                                {/* <Button size="small">Edit</Button> */}
                            </CardActions>
                            </Card> 
                        </Grid>
                        <Grid item={1} xs={12} sm={6} md={4} sx={{  display: 'flex', flexDirection: 'column'}} >
                            <Card
                            sx={{  display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", boxShadow: 12}} 
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                    // 16:9
                                        pt: '10%',
                                        width: '44%',
                                    }}
                                    image={event_img}
                                    alt="random"
                                    name="Stats"
                                />
                                <CardContent name={"event_card"} sx={{ flexGrow: 1 }}  > 
                                    <Typography gutterBottom variant="h5" component="h2">
                                    Event
                                    </Typography>
                                    {/* <Typography>
                                    Click here to create Events
                                    </Typography> */}
                                </CardContent>
                            <CardActions sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
                                <Button sx={{alignItems: "center", justifyContent: "center", marginBottom: "21%"}} name="event_card" size="small" onClick={this.onClick} variant="outlined">View</Button>
                                {/* <Button size="small">Edit</Button> */}
                            </CardActions>
                            </Card> 
                        </Grid>
                    </Grid>
                </Container>
            </div>   
        );
    }

};


const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default withRouter(connect(mapStateToProps, {})(AdminHome));