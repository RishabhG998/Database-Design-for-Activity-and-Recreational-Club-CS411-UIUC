import { PureComponent } from "react";
import Button from '@mui/material/Button';
import {withRouter} from './common/withRouter';
import { userNameChange, loginCreds } from '../actions/actions';
import { connect } from 'react-redux'
import React from "react";
import { CssBaseline, Grid, Paper, Box, Avatar, Typography, TextField, FormControlLabel, Checkbox, Link } from "@mui/material";
import { Container } from "@mui/system";
import AccountBoxTwoTone from '@mui/icons-material/AccountBoxTwoTone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      "Gill Sans", "sans-serif",
    ].join(','),
  },
});

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

export class Login extends PureComponent{

    constructor(props){
      super(props);
      this.state = {
        stateNid: "",
        statePass: ""
    };
    }

    navigateToUser = () => {
      this.props.navigate('/userHome');
    };
  
    navigateToAdmin = () => {
      this.props.navigate('/adminHome');
    };

    handleSubmit = e => {
      e.preventDefault();
      console.log("NetID- "+this.state.stateNid);
      console.log("Password- "+this.state.statePass);
      // this.setState({netid: "", password: ""});
      this.props.loginCreds(this.state.stateNid, this.state.statePass);
      console.log("netid- "+this.props.netid);
  }

  onChange = e => {
      // console.log(e.target.value);
      if (e.target.name === 'netid')
        this.setState({ stateNid: e.target.value });
      else if (e.target.name === 'password') 
        this.setState({ statePass: e.target.value });
  }
    
    render(){
        const { user, userNameChange, netid, password, loginCreds } = this.props;

        const paperStyle = {padding : 20, alignItems: 'center',};

        return(
            <div className="main-content">
                {/* <Button onClick={() => userNameChange("chinmay")}>Add My Name</Button> */}
                <Button onClick={this.navigateToUser}>User Screen</Button>
                <Button onClick={this.navigateToAdmin}>Admin Screen</Button>
                <p>{user}</p>
                <p>{netid}</p>
                <div>
                <ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline/>
                        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                            <Paper elevation={10} style={paperStyle}>
                                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <Typography variant="h4" align="center" color="textPrimary" gutterBottom>Welcome to ARC-MS</Typography>
                                      {/* <FaceIcon sx={{ m: 1, bgcolor: 'orange' }}></FaceIcon> */}
                                    <Avatar sx={{ m: 1, bgcolor: 'orange' }}>
                                      <AccountBoxTwoTone/>
                                    </Avatar>
                                    <Typography component="h1" variant="h5">
                                        Sign in
                                    </Typography>
                                    <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }}>
                                    {/* <Box component="form" onSubmit={() => loginCreds("bwanye", "123")} noValidate sx={{ mt: 1 }}> */}
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="NetID"
                                            name="netid"
                                            autoComplete="netid"
                                            autoFocus
                                            value={this.state.stateNid}
                                            onChange={this.onChange}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="current-password"
                                            value={this.state.statePass}
                                            onChange={this.onChange}
                                        />
                                        {/* <FormControlLabel
                                            control={<Checkbox value="remember" color="primary" />}
                                            label="Remember me"
                                        /> */}
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2, marginBottom: 5 }}
                                        >
                                            Sign In
                                        </Button>
                                    </Box>
                                    
                                </Box>
                            </Paper>
                        </Box>
                        <Copyright sx={{ mt: 8, mb: 4 }} />
                    </Container>
                </ThemeProvider>
            </div>
            </div>
            
        );
    }
};

const mapStateToProps = (state) => {
  return {
     user: state.user,
     netid: state.netid,
     password: state.password
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userNameChange: (name) => dispatch(userNameChange(name)),
    loginCreds: (netid, password) => dispatch(loginCreds(netid, password))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));