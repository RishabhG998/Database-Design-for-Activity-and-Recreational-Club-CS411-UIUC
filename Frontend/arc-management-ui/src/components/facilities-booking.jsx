import { PureComponent } from "react";
import { withRouter } from './common/withRouter';
import { connect } from 'react-redux';
import { Container } from "@mui/system";
import { CssBaseline, Paper, Box, Typography, TextField, Link, FormControl, InputLabel, Select, MenuItem, Alert, Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAllSports, getFacilitiesForSport, resetFacilitiesForSport, getSlotsForFacility, resetslotsForFacility, bookFacilitySlot } from '../actions/actions';
import "./facilities-bookings.css";

const theme = createTheme({
    typography: {
      fontFamily: [
        "Gill Sans", "sans-serif",
      ].join(','),
    }
});
const paperStyle = {padding : 20, alignItems: 'center'};

function Copyright(props) {
return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
    {'Copyright © '}
    <Link color="inherit" href="https://github.com/cs411-alawini/fa22-cs411-Q-team028-SRKC">
        SRKC-dev.com
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
    </Typography>
);
}


export class FacilitiesBooking extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
          actionSuccess: false,
          selectedSport: 0,
          selectedFacility: 0,
          selectedDate: (new Date()).toJSON().substring(0,10),
          selectedSlot: 0
        };
    }

    async componentDidMount () {
        const { getAllSports } = this.props;
        await getAllSports();
    };

    getAllSportsOption = () => {
        const { allSports } = this.props;
        const { selectedSport } = this.state;
        return (
            <FormControl fullWidth>
                <InputLabel id="sports-label">Sport</InputLabel>
                <Select
                    labelId="sports-label"
                    id="all-sports-select"
                    value={selectedSport}
                    label="Sport"
                    onChange={(e) => this.onChangeSport(e)}
                >
                    <MenuItem value={0} key={0}>Select Sport</MenuItem>
                    {
                        allSports && allSports.length>0 && allSports.map((sport, i) => {
                            return (<MenuItem value={sport["sportId"]} key={i+1}>{sport["sportName"]}</MenuItem>);
                        })
                    }                    
                </Select>
            </FormControl>
        )
    };

    onChangeSport = async (e) => {
        const { getFacilitiesForSport, resetslotsForFacility, resetFacilitiesForSport } = this.props;
        const selectedSport = e.target.value;
        this.setState({selectedSport: selectedSport});
        if(selectedSport > 0){
            await getFacilitiesForSport(selectedSport);
        }
        else{
            resetslotsForFacility();
            resetFacilitiesForSport();
        }
    }

    getFacilitiesForSportOption = () => {
        const { facilitiesForSport } = this.props;
        const { selectedFacility } = this.state;
        return (
            <FormControl id ="facilities-form" fullWidth>
                <InputLabel id="facilities-label">Facility</InputLabel>
                <Select
                    labelId="facility-label"
                    id="facilitis-of-sport-select"
                    value={selectedFacility}
                    label="Facility"
                    onChange={(e) => this.onChangeFacility(e)}
                >
                    <MenuItem value={0} key={0}>Select Facility</MenuItem>
                    {
                        facilitiesForSport && facilitiesForSport.length>0 && facilitiesForSport.map((facility, i) => {
                            return (<MenuItem value={facility["facilityId"]} key={i+1}>{facility["facilityName"]}</MenuItem>);
                        })
                    }                   
                </Select>
            </FormControl>
        )
    };

    onChangeFacility = async (e) => {
        const { getSlotsForFacility, resetslotsForFacility } = this.props;
        const { selectedDate } = this.state
        const selectedFacility = e.target.value;
        this.setState({selectedFacility: selectedFacility});
        if(selectedFacility > 0 && !!selectedDate){
            await getSlotsForFacility(selectedFacility, selectedDate);
        }
        else{
            resetslotsForFacility();
        }
    };

    getSlotsForFacilityOption = () => {
        const { slotsForFacility } = this.props;
        const { selectedSlot } = this.state;
        return (
            <FormControl id ="slots-form" fullWidth>
                <InputLabel id="slots-label">Slots</InputLabel>
                <Select
                    labelId="slots-label"
                    id="slots-of-facility-select"
                    value={selectedSlot}
                    label="Slots"
                    onChange={(e) => this.onChangeSlot(e)}
                >
                    <MenuItem value={0} key={0}>Select Slot</MenuItem>
                    {
                        slotsForFacility && slotsForFacility.length>0 && slotsForFacility.map((slot, i) => {
                            return (<MenuItem value={slot["slotId"]} key={i+1}>{slot["slot"]}</MenuItem>);
                        })
                    }                   
                </Select>
            </FormControl>
        )
    };

    onChangeSlot = (e) => {
        this.setState({selectedSlot: e.target.value});
    };

    onDateChange = (e) => {
        this.setState({selectedDate: e.target.value});
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { bookFacilitySlot, netid, resetslotsForFacility, resetFacilitiesForSport } = this.props;
        const { selectedFacility, selectedDate, selectedSlot } = this.state;
        const requestBody = {
            netId: netid,
            facilityId: selectedFacility,
            slotId: selectedSlot,
            bookingDate: new Date()
        };
        await bookFacilitySlot(requestBody).then(() => {
            this.setState({selectedSport: 0, actionSuccess: true});
            resetslotsForFacility();
            resetFacilitiesForSport();
        });
    };

    onAlertClose = () =>{
        this.setState({actionSuccess: false});
    };

    enableSubmitButton = () => {
        const { selectedFacility, selectedDate, selectedSlot } = this.state;
        return selectedFacility>0 && selectedDate && selectedSlot>0;
    };

    render(){
        const { allSports, facilitiesForSport, slotsForFacility } = this.props;
        const { selectedDate, actionSuccess } = this.state;
        return (
            <div>
                <ThemeProvider theme={theme}>
                    <Container id="facility-booking-container" component="main" maxWidth="xs">
                        <CssBaseline/>
                        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                            <Paper elevation={10} style={paperStyle}>
                                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <Typography component="h1" variant="h5">Book Facility</Typography>
                                    <Box onSubmit={this.handleSubmit} component="form" sx={{ mt: 1 }}>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="dob"
                                            label="Booking Date"
                                            type="date"
                                            id="facility-booking-date"
                                            autoComplete="Booking Date"
                                            value={selectedDate}
                                            onChange={(e) => this.onDateChange(e)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        {allSports && allSports.length>0 && this.getAllSportsOption()}
                                        {facilitiesForSport && facilitiesForSport.length>0 && this.getFacilitiesForSportOption()}
                                        {slotsForFacility && slotsForFacility.length>0 && this.getSlotsForFacilityOption()}
                                        {<Button
                                            id="submitSlotBookingBtn"
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            disabled = {!this.enableSubmitButton()}
                                            sx={{ mt: 3, mb: 2, marginBottom: 5 }}>Submit Request</Button>}
                                    </Box>
                                    {
                                        actionSuccess &&
                                        <Alert onClose={this.onAlertClose} id="slot-booking-success-alert" severity="success">Slot Booking Successful</Alert>
                                    }
                                </Box>
                            </Paper>
                        </Box>
                    </Container>
                </ThemeProvider>
            </div>
        );
    };

};


const mapStateToProps = (state) => {
    return {
        netid: state.netid,
        loggedInUserRole: state.loggedInUserRole,
        allSports: state.allSports,
        facilitiesForSport: state.facilitiesForSport,
        slotsForFacility: state.slotsForFacility
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAllSports: async () => dispatch(await getAllSports()),
        getFacilitiesForSport: async (sportId) => dispatch(await getFacilitiesForSport(sportId)),
        resetFacilitiesForSport: () => dispatch(resetFacilitiesForSport()),
        getSlotsForFacility: async (facilityId, date) => dispatch(await getSlotsForFacility(facilityId, date)),
        resetslotsForFacility: () => dispatch(resetslotsForFacility()),
        bookFacilitySlot: async (requestBody) => dispatch(await bookFacilitySlot(requestBody))
    };
};
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FacilitiesBooking));