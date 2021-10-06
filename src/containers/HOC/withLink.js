import React  from "react";
import { Link } from "react-router-dom";

export default (path) => {
    return (children) => {
        if (path) {
            return <Link to={path}>{children}</Link>;
        }
        return children;
    };
};
