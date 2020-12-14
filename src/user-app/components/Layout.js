import React, {Component} from 'react';
import {Navbar} from './Navbar';
import {Footer} from './Footer';


export class Layout extends Component {

    render() {
        return (
            <div>
                <Navbar/>
                {this.props.children}
                <Footer />
            </div>
        );
    }
}
