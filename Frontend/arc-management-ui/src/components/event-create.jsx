import { PureComponent } from "react";
import { withRouter } from './common/withRouter';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import { Container } from "@mui/system";
import { CssBaseline, Paper, Box, Typography, TextField, Link, FormControl, InputLabel, Select, MenuItem, Alert, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getUserInfo, fetchingProgress, deleteUser, updateUserInfo, resetUserInfo, getAllSportsInfo } from '../actions/actions';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import "./event-create.css";

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
        eventEndTime: new Date(1667989248204),
        sportId: "",
        facilityId: "",
        fetchedSportsInfo: [],
        fetchedFacilityInfo: [],
        actionSuccess: false
      };
    }

    handleOnClickSportsInfo = async () => {
        const { getAllSportsInfo } = this.props;
        await getAllSportsInfo().then( () => {
            const { allSportsInfo } = this.props;
            console.log(allSportsInfo);
            this.setState({
                fetchedSportsInfo: allSportsInfo
            }); 
        });  
    }

    getAllSportsOption = () => {
        const { allRoles } = this.props;
        const { updatedRole } = this.state;
        return (
            <FormControl fullWidth>
                <InputLabel id="roles-label">Role</InputLabel>
                <Select
                    labelId="roles-label"
                    id="user-role"
                    value={updatedRole}
                    label="Role"
                    onChange={(e) => this.onChangeInputField(e, "role")}
                >
                    {
                        Object.keys(allRoles).map((role, i) => {
                            return (<MenuItem value={allRoles[role]} key={i}>{role}</MenuItem>);
                        })
                    }                    
                </Select>
            </FormControl>
        )
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

    handleSubmit = async () => {
        const { updateUserInfo, resetUserInfo, userInfo } = this.props;
        const { updatedName, updatedEmail, updatedContactNo, updatedDoB, updatedRole } = this.state;
        const requestBody = {
            netId: userInfo.netId,
            name: updatedName,
            roleID: updatedRole,
            contactNumber: updatedContactNo,
            emailID: updatedEmail,
            dob: updatedDoB
        };
        await updateUserInfo(requestBody).then(() => {
            this.setState({enteredNetId: "", actionSuccess: true});
            resetUserInfo();

        });
    };

    handleDeleteUser = async () => {
        const { userInfo, resetUserInfo, deleteUser } = this.props;
        await deleteUser(userInfo.netId).then(() => {
            this.setState({enteredNetId: "", actionSuccess: true});
            resetUserInfo();
        });
    };

    onAlertClose = () =>{
        this.setState({actionSuccess: false});
    };

    render(){
        const { eventName, eventDescription, eventCapacity, ticketCost, eventDate, eventStartTime, eventEndTime, sportId, facilityId, fetchedSportsInfo, fetchedFacilityInfo, actionSuccess } = this.state;
        console.log("eventStartTime-"+eventStartTime);
        console.log("eventEndTime-"+eventEndTime);
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
        allSportsInfo: state.allSportsInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAllSportsInfo: async () => dispatch(await getAllSportsInfo()),
        fetchingProgress: (isFetchingProgress) => dispatch(fetchingProgress(isFetchingProgress)),
        deleteUser: async (netId) => dispatch(deleteUser(netId)),
        updateUserInfo: async (userInfo) => dispatch(updateUserInfo(userInfo)),
        resetUserInfo: () => dispatch(resetUserInfo())
    };
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEvent));