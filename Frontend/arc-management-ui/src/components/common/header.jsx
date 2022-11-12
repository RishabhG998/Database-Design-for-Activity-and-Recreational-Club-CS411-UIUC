import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import "./header.css"

export default function Header(){
    return (
        <div className="arc-app-header">
            <AppBar position="fixed">
                <Toolbar>ARC Management Application</Toolbar>
            </AppBar>
        </div>
    );
}