import { PureComponent } from "react";
import Button from '@mui/material/Button';
import {withRouter} from './common/withRouter';
import { userNameChange } from '../actions/actions';
import { connect } from 'react-redux'

export class Login extends PureComponent{

    constructor(props){
      super(props);
    }

    navigateToUser = () => {
      this.props.navigate('/userHome');
    };
  
    navigateToAdmin = () => {
      this.props.navigate('/adminHome');
    };

    render(){
        const { user, userNameChange } = this.props;
        return(
            <div className="main-content">
                <Button onClick={() => userNameChange("chinmay")}>Add My Name</Button>
                <Button onClick={this.navigateToUser}>User Screen</Button>
                <Button onClick={this.navigateToAdmin}>Admin Screen</Button>
                <p>{user}</p>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
  return {
     user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userNameChange: (name) => dispatch(userNameChange(name))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));