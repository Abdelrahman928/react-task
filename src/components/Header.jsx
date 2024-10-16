

function Header({text, className}){
    return (
        <header>
            <h2 className= {className}>{text}</h2>
        </header>
    );
}

export default Header