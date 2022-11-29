import { PureComponent } from "react";
import { withRouter } from './common/withRouter';
import { connect } from 'react-redux'
import React from "react";
import { Box, Button, Container, CssBaseline, Link, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { getUserKundali }  from "../actions/actions";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from "@mui/system";

const theme = createTheme({
    typography: {
      fontFamily: [
        "Gill Sans", "sans-serif",
      ].join(','),
    }
});

const paperStyle = {padding : 20, alignItems: 'center'};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

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

export class UserInfo extends PureComponent {

    constructor(props){
        super(props);
        this.state = {
            enteredNetId: "",
            actionSuccess: false,
            entered_netId: "",
            entered_name: "",
            entered_contactNumber: "",
            entered_emailID: "",
            entered_dob: "",
            entered_roleID: "",
            entered_roleName: "",
            entered_roleDescription: "",
            // entered_facilitiesUsed: "",
            // entered_slotsBooked: "",
            // entered_eventsBooked: "",
            // entered_ticketsBooked: "",
            // entered_equipmentBooked: "",
            // entered_equipmentRentCost: "",
            // entered_totalTicketCost: "",
            // entered_totalRentPaid: "",
            // entered_netId2: "",
            // entered_startTime: "",
            // entered_endTime: "",
            // entered_slotId: "",
            // entered_bookingDate: "",
            // entered_facilityId: "",
            // entered_facilityName: "",
            // entered_slotDate: "",
        };
    }

    handleNetIdChange = (event) => {
        this.setState({enteredNetId: event.target.value})
    }

    handleOnGetInfoClick = async () => {
        const { getUserKundali } = this.props;
        const { enteredNetId } = this.state;

        await getUserKundali(enteredNetId).then( () => {
            const { userKundali } = this.props;
            debugger; 
            this.setState({ 
                entered_netId: userKundali[0].netId,
                entered_name: userKundali[0].name,
                entered_contactNumber: userKundali[0].contactNumber,
                entered_emailID: userKundali[0].emailID,
                entered_dob: userKundali[0].dob,
                entered_roleID: userKundali[0].roleID,
                entered_roleName: userKundali[0].roleName,
                entered_roleDescription: userKundali[0].roleDescription,
                // entered_facilitiesUsed: userKundali.facilitiesUsed,
                // entered_slotsBooked: userKundali.slotsBooked,
                // entered_eventsBooked: userKundali.eventsBooked,
                // entered_ticketsBooked: userKundali.ticketBooked,
                // entered_equipmentBooked: userKundali.equipmentBooked,
                // entered_equipmentRentCost: userKundali.equipmentRentCost,
                // entered_totalTicketCost: userKundali.totalTicketCost,
                // entered_totalRentPaid: userKundali.totalRentPaid,
                // entered_netId2: userKundali.netId2,
                // entered_startTime: userKundali.startTime,
                // entered_endTime: userKundali.endTime,
                // entered_slotId: userKundali.slotId,
                // entered_bookingDate: userKundali.bookingDate,
                // entered_facilityId: userKundali.facilityId,
                // entered_facilityName: userKundali.facilityName,
                // entered_slotDate: userKundali.slotDate,
            });
        });  

    }

    render() {
        const { enteredNetId, entered_netId, entered_name } = this.state;
        const { userKundali } = this.props;
        
        return (

            <ThemeProvider theme={theme}>
                <Container id="user-info-container" component="main" maxWidth="xs">
                    <CssBaseline/>
                    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                        <Paper elevation={10} style={paperStyle}>
                            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                <Typography component="h1" variant="h5">User Information</Typography>
                                <Box component="form" sx={{ mt: 1, marginTop: 4 }} onSubmit={this.handleSubmit}>
                                    <TextField id="netdid-textfield" label="NetId" variant="outlined" value={enteredNetId} onChange={this.handleNetIdChange}/>
                                    <Button id="getUserInfo" onClick={this.handleOnGetInfoClick} variant="contained">Get User Info</Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Box> 
                </Container>
            </ThemeProvider>
        )
    };

};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        userKundali: state.userKundali
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUserKundali: async (netId) => dispatch(await getUserKundali(netId)),
    };
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInfo));