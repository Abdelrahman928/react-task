
function Button({id, text, className, onClick}){
    const handleClick = onClick;
    return (
        <button id={id} onClick={onClick} className={className}>{text}</button>
    );
}

export default Button