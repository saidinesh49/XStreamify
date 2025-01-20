function LoginToAccess(){
    return <div className='flex flex-col justify-center items-center text-lg text-yellow-300'>You don't have access to this resource! 
        <a href='/login' className='pl-1 underline text-md font-semibold decoration-2 decoration-sky-800 hover:decoration-2 hover:decoration-sky-300 text-white'>
         Please  Login
        </a>
    </div>
}

export { LoginToAccess };