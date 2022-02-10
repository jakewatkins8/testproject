import React from "react";
import "./errorScreen.css";
import { REACT_APP_PUBLIC_URL, REACT_APP_SERVER_PATH } from "./environment.js";

class ErrorBoundary extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: {}
        };
        }




    static getDerivedStateFromError(error) {
        // updates the state so that when the error boundary catches the error, 
        // the error boundary will show its UI
        // * called during render phase
        console.log('caught error, deriving state:');
        console.log(`error: ${error}`);
        return { hasError: true, error: error }

    }

    componentDidCatch(error, info) {
        // Log the error somewhere in this method, if desired:
        console.log(error);

    
    }


    
    render() {
        // conditionally return the error UI if an error is caught:
        if (this.state.hasError) {
            return (
                <div className="errorScreen">
                        <div className="errDialogueBox">
                            <h3>Error</h3>
                            <p>A problem has been detected and this application 
                                has been shut down.</p>
                            <p className="error">{`${this.state.error.name}: ${this.state.error.message}`}</p>
                            <p>If this is the first time you've seen this error screen, it probably won't be the last.</p>
                            <p>If this screen appears again, odds are it was always going to after the first time it did.</p>
                            <p>The user may consider when the computer was last turned off.</p>
                            <p>When the computer is off, the error cannot occur.</p>
                            <p style={{fontSize: '0.6em'}}>If that does not lead to a solution, it is possible that the React app had a render error.</p>
                            <p>Technical Information:</p>
                            <p>*** STOP: 0x00000BAD (0xb0ad0b0a, 0xba0d0b0a, 0x00000000, 0x00000000)</p>
                        </div>
                        <div className="errDialogueBox">
                            <p className='linkBack'>Try real sticky notes. <br/> You will likely find them more fulfilling than these 
                            <span> </span><a href={REACT_APP_SERVER_PATH}>virtual trivial sticky notes</a>.</p>
                            <br/>
                            {/* TODO remove dev home link below */}
                            <a href={REACT_APP_PUBLIC_URL}>virtual *developing* trivial sticky notes</a>
                            <p>(follow the link above to reload the app)</p>
                        </div>
               </div>
            );
        }

    // otherwise, the error boundary just returns its children: 
    // i.e., the rest of the App and its components
    return this.props.children;
}
    
}

export default ErrorBoundary;