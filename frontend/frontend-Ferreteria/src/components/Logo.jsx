import logo from '../assets/logo.png';

const Logo = () => {
return(
    <div className="w-16  h-16 ">
        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
    </div>
)
}

export default Logo;