import { PureComponent } from "react";
import Button from '@mui/material/Button';
import {withRouter} from './common/withRouter';
import { userLogin} from '../actions/actions';
import { connect } from 'react-redux'
import React from "react";
import { CssBaseline, Paper, Box, Avatar, Typography, TextField, FormControlLabel, Checkbox, Link } from "@mui/material";
import { Container } from "@mui/system";
import AccountBoxTwoTone from '@mui/icons-material/AccountBoxTwoTone';
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
const paperStyle = {padding : 20, alignItems: 'center',};

export class Login extends PureComponent{

    constructor(props){
      super(props);
      this.state = {
        stateNid: "",
        statePass: ""
      };
    }

    handleSubmit = e => {
      const { userLogin, navigate } = this.props;
      const { stateNid, statePass } = this.state;
      e.preventDefault();
      userLogin(stateNid, statePass).then(() => {
        const { loggedInUserRole } = this.props;
        loggedInUserRole === "Administrator" ? navigate('/adminHome') : navigate('/userHome'); 
      });
  }

  onChange = e => {
      if (e.target.name === 'netid')
        this.setState({ stateNid: e.target.value });
      else if (e.target.name === 'password') 
        this.setState({ statePass: e.target.value });
  }
    
    render(){
        
        return(
            <div className="main-content">
                <ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline/>
                        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                            <Paper elevation={10} style={paperStyle}>
                                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <Typography variant="h4" align="center" color="textPrimary" gutterBottom>Welcome to ARC-MS</Typography>
                                    <Avatar sx={{ m: 1, bgcolor: 'orange' }}>
                                      <AccountBoxTwoTone/>
                                    </Avatar>
                                    <Typography component="h1" variant="h5">
                                        Sign in
                                    </Typography>
                                    <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }}>
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
        );
    }
};

const mapStateToProps = (state) => {
  return {
     netid: state.netid,
     loggedInUserRole: state.loggedInUserRole
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: async (stateNid, statePass) => dispatch(await userLogin(stateNid, statePass))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));