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
            actionSuccess: false
        };
    }

    handleNetIdChange = (event) => {
        this.setState({enteredNetId: event.target.value})
    }

    handleOnGetInfoClick = async () => {
        const { getUserKundali } = this.props;
        const { enteredNetId } = this.state;
        await getUserKundali(enteredNetId); 
    }

    render() {
        const { enteredNetId } = this.state;
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
                            { userKundali && userKundali.length>0 &&
                                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <Paper elevation={10} style={paperStyle}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                            <Typography sx= {{ marginBottom: 3 }} component="h1" variant="h6">User Info</Typography>
                                            <TableContainer component={Paper}>
                                                <Table sx={{ minWidth: 500 }} aria-label="customized table">
                                                    <TableBody>
                                                        <StyledTableRow key="Net Id">
                                                            <StyledTableCell align="center">Net Id</StyledTableCell>
                                                            <StyledTableCell align="center" component="th" scope="row">
                                                                {userKundali[0].netId}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                        <StyledTableRow key="Name">
                                                            <StyledTableCell align="center">Name</StyledTableCell>
                                                            <StyledTableCell align="center" component="th" scope="row">
                                                                {userKundali[0].name}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                        <StyledTableRow key="Contact Number">
                                                            <StyledTableCell align="center">Contact Number</StyledTableCell>
                                                            <StyledTableCell align="center" component="th" scope="row">
                                                                {userKundali[0].contactNumber}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                        <StyledTableRow key="Email Id">
                                                            <StyledTableCell align="center">Email Id</StyledTableCell>
                                                            <StyledTableCell align="center" component="th" scope="row">
                                                                {userKundali[0].emailID}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                        <StyledTableRow key="Date of Birth">
                                                            <StyledTableCell align="center">Date of Birth</StyledTableCell>
                                                            <StyledTableCell align="center" component="th" scope="row">
                                                                {userKundali[0].dob}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                        <StyledTableRow key="Role">
                                                            <StyledTableCell align="center">Role</StyledTableCell>
                                                            <StyledTableCell align="center" component="th" scope="row">
                                                                {userKundali[0].roleName}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Paper>
                                </Box>
                            }
                            { userKundali && userKundali.length>0 &&
                                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <Paper elevation={10} style={paperStyle}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                            <Typography sx= {{ marginBottom: 3 }} component="h1" variant="h6">User Slot Booking History</Typography>
                                            <TableContainer component={Paper}>
                                                <Table sx={{ minWidth: 500 }} aria-label="customized table">
                                                    <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell align="center">Facility Name</StyledTableCell>
                                                        <StyledTableCell align="center">Slot Date</StyledTableCell>
                                                        <StyledTableCell align="center">Start Time</StyledTableCell>
                                                        <StyledTableCell align="center">End Time</StyledTableCell>
                                                    </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {userKundali.filter(row => row && row.facilityName && (row.facilityName !== "None")).map((row, i) => (
                                                            <StyledTableRow key={i}>
                                                                <StyledTableCell align="center" component="th" scope="row"> {row.facilityName}</StyledTableCell>
                                                                <StyledTableCell align="center">{row.slotDate}</StyledTableCell>
                                                                <StyledTableCell align="center">{row.startTime}</StyledTableCell>
                                                                <StyledTableCell align="center">{row.endTime}</StyledTableCell>
                                                            </StyledTableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Paper>
                                </Box>
                            }
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