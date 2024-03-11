import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const Navigater = (props) => {
    return (

        <Button className="fixed top-0 right-0 z-50 m-10 nav-btn"><Link to={props.to}>{props.text}</Link></Button>
    );
}

export default Navigater;
