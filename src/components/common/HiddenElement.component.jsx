const HiddenElement = ({children, hidden, ifHidden}) => {
    if(hidden) {
        return ifHidden
    } else {
        return children
    }
}

export default HiddenElement