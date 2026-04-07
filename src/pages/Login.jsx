import React, { useState } from "react";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    // this is basic function for now -> i will use it to store theu user email and pass in the firebase 
    const handleLogin = (e) => {
        e.preventDefault(); // prevert the defautl behavior -> send data to the server and reload it 
        console.log("Logging in with:", email, password);
        // Future home of your Firebase auth logic!
    };

    return (
        <div>

            <header >
                placehilder navbar
            </header>
            <main>
                {/* this is the div the hold the main screen - i will use it to center the card  */}
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray- to-Blue-700 p-6">
                    {/* this is the div the hold all the card */}
                    <div className="flex flex-col items-center justify-center bg-silverMist-200 h-fit border-2 border-deepCharcoal-200 max-w-md p-12  shadow-xl rounded-3xl" >

                        {/* this is the div the hold the top section of the card (header) */}
                        <div>
                            <p className="text-sm text-electricBlue-400"> Voltix Authentication </p>
                            <p className="text-l text-deepCharcoal"> Log in to Voltix</p>
                            <p className="text-sm text-deepCharcoal"> power your future  </p>

                        </div>
                        {/* the first input that have the email  */}
                        <Input label="Email" placeholder="Enter your email" type="email" name="email" />
                        <Input label="Password" placeholder="••••••••" type="password" name="password" />

                        <Button type="submit">Log In</Button>

                        {/* this div that will hold the other option (sign up)*/}
                        <div>
                            <p> Don't have an account ? <a>Sign Up </a></p>

                        </div>

                    </div>
                </div>
            </main>
            <footer>
                placeholder footer
            </footer>
        </div>
    )
}

export default Login

