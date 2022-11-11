import { PureComponent } from "react";
import { withRouter } from './common/withRouter';
import { connect } from 'react-redux';
import { Container } from "@mui/system";
import { CssBaseline, Paper, Box, Typography, TextField, Link, FormControl, InputLabel, Select, MenuItem, Alert, Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAllSports, getEquipmentsForSport, resetEquipmentsForSport, getSlotsForEquipment, resetslotsForEquipment, bookEquipmentSlot } from '../actions/actions';
import "./equipment-bookings.css";

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

export class EquipmentBooking extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
          actionSuccess: false,
          selectedSport: 0,
          selectedEquipment: 0,
          selectedDate: (new Date()).toJSON().substring(0,10),
          selectedSlot: 0,
          enteredNetId: props.loggedInUserRole && props.loggedInUserRole==="Administrator" ? "" : props.netid,
          selectedEquipmentCount: 1
        };
    };

    async componentDidMount () {
        const { getAllSports } = this.props;
        await getAllSports();
    };

    handleNetIdChange = (e) => {
        this.setState({enteredNetId: e.target.value}); 
    };

    getAllSportsOption = () => {
        const { allSports } = this.props;
        const { selectedSport } = this.state;
        return (
            <FormControl id ="sports-form" fullWidth>
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
        const { getEquipmentsForSport, resetEquipmentsForSport, resetslotsForEquipment } = this.props;
        const selectedSport = e.target.value;
        this.setState({selectedSport: selectedSport, selectedEquipment: 0, selectedSlot: 0, selectedEquipmentCount: 0});
        if(selectedSport > 0){
            await getEquipmentsForSport(selectedSport);
        }
        else{
            resetslotsForEquipment();
            resetEquipmentsForSport();
            this.setState({});
        }
    };

    getEquipmentsForSportOption = () => {
        const { equipmentsForSport } = this.props;
        const { selectedEquipment } = this.state;
        return (
            <FormControl id ="equipments-form" fullWidth>
                <InputLabel id="equipments-label">Equipment</InputLabel>
                <Select
                    labelId="equipments-label"
                    id="equipments-of-sport-select"
                    value={selectedEquipment}
                    label="Equipment"
                    onChange={(e) => this.onChangeEquipment(e)}
                >
                    <MenuItem value={0} key={0}>Select Equipment</MenuItem>
                    {
                        equipmentsForSport && equipmentsForSport.length>0 && equipmentsForSport.map((equipment, i) => {
                            return (<MenuItem value={equipment["equipmentId"]} key={i+1}>{equipment["equipmentName"]}</MenuItem>);
                        })
                    }                   
                </Select>
            </FormControl>
        )
    };

    onChangeEquipment = async (e) => {
        const { getSlotsForEquipment, resetslotsForEquipment } = this.props;
        const { selectedDate } = this.state
        const selectedEquipment = e.target.value;
        this.setState({selectedEquipment: selectedEquipment,  selectedSlot: 0, selectedEquipmentCount: 0});
        if(selectedEquipment > 0 && !!selectedDate){
            await getSlotsForEquipment(selectedDate);
        }
        else{
            resetslotsForEquipment();
        }
    };

    getSlotsForEquipmentOption = () => {
        const { slotsForEquipment } = this.props;
        const { selectedSlot, selectedEquipmentCount } = this.state;
        return (
            <FormControl id ="slots-form" fullWidth>
                <InputLabel id="slots-label">Slots</InputLabel>
                <Select
                    labelId="slots-label"
                    id="slots-of-equipment-select"
                    value={selectedSlot}
                    label="Slots"
                    onChange={(e) => this.onChangeSlot(e)}
                >
                    <MenuItem value={0} key={0}>Select Slot</MenuItem>
                    {
                        slotsForEquipment && slotsForEquipment.length>0 && slotsForEquipment.map((slot, i) => {
                            return (<MenuItem value={slot["slotId"]} key={i+1}>{slot["slot"]}</MenuItem>);
                        })
                    }                   
                </Select>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="equipmentCount"
                    label="Equipment Count"
                    type="number"
                    id="equipment-equipment-count"
                    autoComplete="Equipment Count"
                    value={selectedEquipmentCount}
                    onChange={(e) => this.onCountChange(e)}
                    InputLabelProps={{ shrink: true }}
                />
            </FormControl>
        )
    };

    onChangeSlot = (e) => {
        this.setState({selectedSlot: e.target.value});
    };

    onCountChange = (e) => {
        this.setState({selectedEquipmentCount: e.target.value});
    }

    onDateChange = (e) => {
        this.setState({selectedDate: e.target.value});
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { bookEquipmentSlot, netid, resetslotsForEquipment, resetEquipmentsForSport, loggedInUserRole } = this.props;
        const { selectedEquipment, selectedSlot, enteredNetId, selectedEquipmentCount } = this.state;
        const userNetId = loggedInUserRole!=="Administrator" ? netid : enteredNetId;
        const requestBody = {
            netId: userNetId,
            equipmentId: selectedEquipment,
            slotId: selectedSlot,
            bookingDate: new Date(),
            equipmentCount: selectedEquipmentCount
        };
        await bookEquipmentSlot(requestBody).then(() => {
            this.setState({selectedSport: 0, selectedEquipment: 0, selectedSlot: 0, selectedEquipmentCount: 0, actionSuccess: true, enteredNetId: ""});
            resetslotsForEquipment();
            resetEquipmentsForSport();
        });
    };

    onAlertClose = () =>{
        this.setState({actionSuccess: false});
    };

    enableSubmitButton = () => {
        const { selectedEquipment, selectedDate, selectedSlot, selectedEquipmentCount, enteredNetId } = this.state;
        return selectedEquipment>0 && selectedDate && selectedSlot>0 && selectedEquipmentCount>0 && enteredNetId;
    };

    render(){
        const { allSports, equipmentsForSport, slotsForEquipment, loggedInUserRole } = this.props;
        const { selectedDate, actionSuccess, enteredNetId } = this.state;
        return (
            <div>
                <ThemeProvider theme={theme}>
                    <Container id="equipment-booking-container" component="main" maxWidth="xs">
                        <CssBaseline/>
                        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                            <Paper elevation={10} style={paperStyle}>
                                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <Typography component="h1" variant="h5">Book Equipment</Typography>
                                    <Box onSubmit={this.handleSubmit} component="form" sx={{ mt: 1 }}>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="bookingDate"
                                            label="Booking Date"
                                            type="date"
                                            id="equipment-booking-date"
                                            autoComplete="Booking Date"
                                            value={selectedDate}
                                            onChange={(e) => this.onDateChange(e)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        {loggedInUserRole && loggedInUserRole==="Administrator" && <TextField fullWidth id="netdid-equipment-booking" label="NetId" variant="outlined" value={enteredNetId} onChange={this.handleNetIdChange}/>}
                                        {allSports && allSports.length>0 && this.getAllSportsOption()}
                                        {equipmentsForSport && equipmentsForSport.length>0 && this.getEquipmentsForSportOption()}
                                        {slotsForEquipment && slotsForEquipment.length>0 && this.getSlotsForEquipmentOption()}
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
                                        <Alert onClose={this.onAlertClose} id="equipment-booking-success-alert" severity="success">Equipment Booking Successful</Alert>
                                    }
                                </Box>
                            </Paper>
                        </Box>
                        <Copyright sx={{ mt: 8, mb: 4 }} />
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
        equipmentsForSport: state.equipmentsForSport,
        slotsForEquipment: state.slotsForEquipment
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAllSports: async () => dispatch(await getAllSports()),
        getEquipmentsForSport: async (sportId) => dispatch(await getEquipmentsForSport(sportId)),
        resetEquipmentsForSport: () => dispatch(resetEquipmentsForSport()),
        getSlotsForEquipment: async (date) => dispatch(await getSlotsForEquipment(date)),
        resetslotsForEquipment: () => dispatch(resetslotsForEquipment()),
        bookEquipmentSlot: async (requestBody) => dispatch(await bookEquipmentSlot(requestBody))
    };
};
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EquipmentBooking));