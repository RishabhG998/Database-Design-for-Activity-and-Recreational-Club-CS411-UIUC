import { PureComponent } from "react";
import { withRouter } from './common/withRouter';
import { connect } from 'react-redux';
import { Container } from "@mui/system";
import { CssBaseline, Paper, Box, Typography, TextField, Link, FormControl, InputLabel, Select, MenuItem, Alert, Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getUserInfo, fetchingProgress, deleteUser, updateUserInfo, resetUserInfo } from '../actions/actions';
import "./edit-user.css";

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


export class EditUser extends PureComponent{

    constructor(props){
      super(props);
      this.state = {
        enteredNetId: "",
        updatedName: "",
        updatedEmail: "",
        updatedContactNo: "",
        updatedDoB: "",
        updatedRole: "",
        actionSuccess: false
      };
    }

    getAllRolesOption = () => {
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

    handleNetIdChange = (event) => {
        this.setState({enteredNetId: event.target.value})
    }

    handleNameChange = (event) => {
        this.setState({updatedName: event.target.value})
    }

    handleOnGetInfoClick = async () => {
        const { getUserInfo } = this.props;
        const { enteredNetId } = this.state;
        await getUserInfo(enteredNetId).then( () => {
            const { userInfo } = this.props;
            this.setState({updatedName: userInfo.name, 
                updatedEmail: userInfo.emailID, 
                updatedContactNo: userInfo.contactNumber, 
                updatedDoB: userInfo.dob,
                updatedRole: userInfo.roleID
            });
        });  
    }

    onChangeInputField = (e, inputType) => {
        switch(inputType){
            case "name":
                this.setState({updatedName: e.target.value});
                break;
            case "email":
                this.setState({updatedEmail: e.target.value});
                break;
            case "contactNo":
                this.setState({updatedContactNo: e.target.value});
                break;
            case "dob":
                this.setState({updatedDoB: e.target.value});
                break;
            case "role":
                this.setState({updatedRole: e.target.value});
                break;    
            default:
                break;
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
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
        updateUserInfo(requestBody).then(() => {
            this.setState({enteredNetId: "", actionSuccess: true});
            resetUserInfo();
        });
    };

    handleDeleteUser = (e) => {
        e.preventDefault();
        const { userInfo, resetUserInfo, deleteUser } = this.props;
        deleteUser(userInfo.netId).then(() => {
            this.setState({enteredNetId: "", actionSuccess: true});
            resetUserInfo();
        });
    };

    onAlertClose = () =>{
        this.setState({actionSuccess: false});
    };

    render(){
        const { userInfo } = this.props;
        const { enteredNetId, updatedName, updatedEmail, updatedContactNo, updatedDoB, actionSuccess } = this.state;
        return(
            <div>
                <ThemeProvider theme={theme}>
                    <Container id="edit-user-container" component="main" maxWidth="xs">
                        <CssBaseline/>
                        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                            <Paper elevation={10} style={paperStyle}>
                                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <Typography component="h1" variant="h5">Edit User</Typography>
                                    <Box component="form" sx={{ mt: 1 }}>
                                        <TextField id="netdid-textfield" label="NetId" variant="outlined" value={enteredNetId} onChange={this.handleNetIdChange}/>
                                        <Button id="getUserInfo" onClick={this.handleOnGetInfoClick} variant="contained">Get User Info</Button>
                                    </Box>
                                    { 
                                        userInfo && 
                                        <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }}>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="name"
                                                label="Name"
                                                name="name"
                                                autoComplete="name"
                                                autoFocus
                                                value={updatedName}
                                                onChange={(e) => this.onChangeInputField(e, "name")}
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="email"
                                                label="Email Id"
                                                type="email"
                                                id="email"
                                                autoComplete="Email Id"
                                                value={updatedEmail}
                                                onChange={(e) => this.onChangeInputField(e, "email")}
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="contact"
                                                label="Contact No."
                                                type="number"
                                                id="contact"
                                                autoComplete="Contact No."
                                                value={updatedContactNo}
                                                onChange={(e) => this.onChangeInputField(e, "contactNo")}
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="dob"
                                                label="Date of Birth"
                                                type="date"
                                                id="dob"
                                                autoComplete="dd-mm-yyyy"
                                                value={updatedDoB}
                                                onChange={(e) => this.onChangeInputField(e, "dob")}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                            {this.getAllRolesOption()}
                                            <Button
                                                id="updateUserInfoBtn"
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2, marginBottom: 5 }}>Update Info</Button>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="error"
                                                sx={{ mt: 3, mb: 2, marginBottom: 5 }} onClick={this.handleDeleteUser}>Delete User</Button>
                                            </Box>
                                    }
                                    {
                                        actionSuccess &&
                                        <Alert onClose={this.onAlertClose} id="user-info-action-alert" severity="success">User Information Updated/Deleted</Alert>
                                    }
                                    
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
        allRoles: state.allRoles
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUserInfo: async (netId) => dispatch(await getUserInfo(netId)),
        fetchingProgress: (isFetchingProgress) => dispatch(fetchingProgress(isFetchingProgress)),
        deleteUser: async (netId) => dispatch(await deleteUser(netId)),
        updateUserInfo: async (userInfo) => dispatch(await updateUserInfo(userInfo)),
        resetUserInfo: () => dispatch(resetUserInfo())
    };
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditUser));