import { PureComponent } from "react";
import { withRouter } from './common/withRouter';
import { connect } from 'react-redux'

export class UserHome extends PureComponent{

    constructor(props){
      super(props);
    }

    render(){
        const { user } = this.props;
        return(
            <p>User Home: {user} </p>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default withRouter(connect(mapStateToProps, {})(UserHome));