
export default function Footer() {

    return (
        <footer className="text-center bg-black-dark py-5 text-white mt-12">
            <p>Designed &amp; Developed by <a href="https://www.linkedin.com/in/abiodun-awoyemi-1ab8b3165/" target="_blank" rel="noopener noreferrer" className="text-blue-light">Abiodun Awoyemi</a></p>
            <span className="mt-3">Copyright &copy; {new Date().getFullYear()}</span>
        </footer>
    )
}