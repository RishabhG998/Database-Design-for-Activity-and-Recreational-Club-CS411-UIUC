import Button from '@mui/material/Button';
import './App.css';
import { connect } from 'react-redux'
import { userNameChange } from './actions/actions';
import { PureComponent } from "react";

class App extends PureComponent{

  constructor(props){
    super(props);
  }

  render(){
    const { user, userNameChange } = this.props;
    return (
      <div className="App">
         <Button onClick={userNameChange}>Add My Name</Button>
         <p>{user}</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
     user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userNameChange: () => dispatch(userNameChange())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
