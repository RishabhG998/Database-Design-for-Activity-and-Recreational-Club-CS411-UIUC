import { PureComponent } from "react";
import { withRouter } from './common/withRouter';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import { Container } from "@mui/system";
import { CssBaseline, Paper, Box, Typography, TextField, Link, FormControl, InputLabel, Select, MenuItem, Alert, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getUserInfo, fetchingProgress, deleteUser, updateUserInfo, resetUserInfo, getAllSports, getFacilitiesForSport, getSlotsForFacility, resetslotsForFacility, createEvent } from '../actions/actions';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import "./event-create.css";
import { type } from "@testing-library/user-event/dist/type";

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


export class CreateEvent extends PureComponent{

    constructor(props){
      super(props);
      this.state = {
        eventName: "",
        eventDescription: "",
        eventCapacity: "",
        ticketCost: "",
        eventDate: new Date(),
        eventStartTime: new Date(),
        eventEndTime: new Date(),
        selectedSport: 0,
        facilityId: "",
        fetchedSportsInfo: [],
        fetchedFacilityInfo: [],
        selectedFacility: 0,
        // allSports: null,
        actionSuccess: false
      };
    }

    async componentDidMount () {
        const { getAllSports } = this.props;
        await getAllSports();
    };

    getAllSportsOption = () => {
        const { allSports } = this.props;
        const { selectedSport } = this.state;
        // console.log(selectedSport);
        return (
            <FormControl fullWidth id="sports-form">
                <InputLabel id="sports-label">Sport</InputLabel>
                <Select
                    labelId="sports-label"
                    id="all-sports-select"
                    value={selectedSport}
                    label="Sport"
                    onChange={(e) => this.onChangeSport(e)}
                >
                    <MenuItem className="select-sport-dropdown" value={0} key={0}>Select Sport</MenuItem>
                    {
                        allSports && allSports.length>0 && allSports.map((sport, i) => {
                            // console.log(sport);
                            return (<MenuItem value={sport["sportId"]} key={i+1}>{sport["sportName"]}</MenuItem>);
                        })
                    }                    
                </Select>
            </FormControl>
        )
    };

    handleOnClickSportsInfo = async () => {
        const { getAllSports } = this.props;
        await getAllSports().then( () => {
            const { allSports } = this.props;
            // console.log(allSports);
            this.setState({
                fetchedSportsInfo: allSports
            }); 
        });  
    }

    onChangeSport = async (e) => {
        const { getFacilitiesForSport, resetslotsForFacility, resetFacilitiesForSport } = this.props;
        const selectedSport = e.target.value;
        // console.log("onChangeSport || ", e.target.value)
        this.setState({ selectedSport: e.target.value });

        if(selectedSport > 0){
            await getFacilitiesForSport(e.target.value);
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
                    <MenuItem className="select-facility-dropdown" value={0} key={0}>Select Facility</MenuItem>
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
        // console.log("onChangeFacility || ", e.target.value)
        if(selectedFacility > 0 && !!selectedDate){
            await getSlotsForFacility(selectedFacility, selectedDate);
        }
        else{
            resetslotsForFacility();
        }
    };

    toHHMMSS = function (time) {
        var date = new Date(time);

        var hours = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        var seconds = date.getSeconds().toString();

        return hours+':'+minutes+':'+seconds;
    }

    onChangeInputField = (e, type) => {
        // debugger;
        // console.log(e);
        // this.setState({eventStartTime: e});
        switch(type){
            case "eventName":
                this.setState({eventName: e.target.value});
                break;
            case "eventDescription":
                this.setState({eventDescription: e.target.value});
                break;
            case "eventCapacity":
                this.setState({eventCapacity: e.target.value});
                break;
            case "ticketCost":
                this.setState({ticketCost: e.target.value});
                break;
            case "eventDate":
                this.setState({eventDate: e.target.value});
                break;   
            case "eventStartTime":
                this.setState({eventStartTime: e});
                break;
            case "eventEndTime":
                this.setState({eventEndTime: e});
                break; 
            default:
                break;
        }
    };

    onAlertClose = () =>{
        this.setState({actionSuccess: false});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { createEvent } = this.props;
        const { eventName, eventDescription, eventCapacity, ticketCost, eventDate, eventStartTime, eventEndTime, selectedSport, selectedFacility, actionSuccess } = this.state;
        
        var temp_eventStartTime = this.toHHMMSS(eventStartTime);
        var temp_eventEndTime = this.toHHMMSS(eventEndTime);

        const requestBody = {
            'event_name': eventName,
            'event_description': eventDescription,
            'event_capacity': parseInt(eventCapacity),
            'ticket_cost': Number(ticketCost),
            'event_date': (new Date(eventDate).toJSON().substring(0,10)),
            'event_start_time': temp_eventStartTime,
            'event_end_time': temp_eventEndTime,
            'facility_id': selectedFacility,
            'sport_id': selectedSport,
        }; 
        createEvent(requestBody).then(() => {
            this.setState({ actionSuccess: true });
            alert("Event with the name " + eventName + " is now created!");
        });
    };

    render(){
        const { eventName, eventDescription, eventCapacity, ticketCost, eventDate, eventStartTime, eventEndTime, selectedSportId, facilityId, fetchedSportsInfo, fetchedFacilityInfo, actionSuccess } = this.state;
        const { allSports, facilitiesForSport } = this.props;
        
        return(
            <div>
                <ThemeProvider theme={theme}>
                    <Container id="edit-user-container" component="main" maxWidth="xs">
                        <CssBaseline/>
                        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                            <Paper elevation={10} style={paperStyle}>
                                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <Typography component="h1" variant="h5">Create Event</Typography>
                                    {/* <Box component="form" sx={{ mt: 1 }}> */}
                                        {/* <TextField id="netdid-textfield" label="NetId" variant="outlined" value={enteredNetId} onChange={this.handleNetIdChange}/> */}
                                        {/* <Button id="getAllSportsInfoBtn" onClick={this.handleOnClickSportsInfo} variant="contained">Get All Sports Info</Button> */}
                                    {/* </Box> */}
                                    <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }}>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="eventName"
                                            label="Event Name"
                                            name="eventName"
                                            autoComplete="Event Name"
                                            autoFocus
                                            value={this.state.eventName}
                                            onChange={(e) => this.onChangeInputField(e, "eventName")}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="eventDescription"
                                            label="Event Description"
                                            id="eventDescription"
                                            autoComplete="Event Description"
                                            value={eventDescription}
                                            onChange={(e) => this.onChangeInputField(e, "eventDescription")}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="eventCapacity"
                                            label="Event Capacity"
                                            id="eventCapacity"
                                            autoComplete="No."
                                            value={eventCapacity}
                                            onChange={(e) => this.onChangeInputField(e, "eventCapacity")}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="ticketCost"
                                            label="Ticket Cost"
                                            id="ticketCost"
                                            autoComplete="Amount"
                                            value={ticketCost}
                                            onChange={(e) => this.onChangeInputField(e, "ticketCost")}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="eventDate"
                                            label="Event Date"
                                            type="date"
                                            id="eventDate"
                                            value={this.state.eventDate}
                                            onChange={(e) => this.onChangeInputField(e, "eventDate")}
                                            // InputLabelProps={{ shrink: true }}
                                        />
                                        <Stack spacing={3} id="timePickerStack">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                name="eventStartTime"
                                                label="Event Start Time"
                                                id="eventStartTime"
                                                autoComplete="10:09 AM"
                                                format="HH:mm"
                                                value={this.state.eventStartTime}
                                                onChange={(e) => this.onChangeInputField(e, "eventStartTime")}
                                                renderInput={(params) => <TextField {...params} />}
                                                />
                                                <TimePicker 
                                                name="eventEndTime"
                                                label="Event End Time"
                                                id="eventEndTime"
                                                autoComplete="10:09 AM"
                                                value={this.state.eventEndTime}
                                                onChange={(e) => this.onChangeInputField(e, "eventEndTime")}
                                                renderInput={(params) => <TextField {...params} />}
                                                />    
                                            </LocalizationProvider>
                                        </Stack>
                                        {allSports && allSports.length>0 && this.getAllSportsOption()}
                                        {facilitiesForSport && facilitiesForSport.length>0 && this.getFacilitiesForSportOption()}
                                        <Button
                                            id="createEventBtn"
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2, marginBottom: 5 }} endIcon={ <CreateOutlinedIcon/> }>Create Event
                                        </Button>
                                    </Box>                                     
                                </Box>
                            </Paper>
                        </Box>
                        <Copyright sx={{ mt: 8, mb: 4 }} />
                    </Container>
                </ThemeProvider>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        fetchingProgressStatus: state.fetchingProgressStatus,
        userInfo: state.userInfo,
        allRoles: state.allRoles,
        allSports: state.allSports,
        facilitiesForSport: state.facilitiesForSport,
        slotsForFacility: state.slotsForFacility
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAllSports: async () => dispatch(await getAllSports()),
        getFacilitiesForSport: async (sportId) => dispatch(await getFacilitiesForSport(sportId)),
        fetchingProgress: (isFetchingProgress) => dispatch(fetchingProgress(isFetchingProgress)),
        deleteUser: async (netId) => dispatch(deleteUser(netId)),
        updateUserInfo: async (userInfo) => dispatch(updateUserInfo(userInfo)),
        getSlotsForFacility: async (facilityId, date) => dispatch(await getSlotsForFacility(facilityId, date)),
        resetslotsForFacility: () => dispatch(resetslotsForFacility()),
        createEvent: async (requestBody) => dispatch(await createEvent(requestBody)),
        resetUserInfo: () => dispatch(resetUserInfo())
    };
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEvent));