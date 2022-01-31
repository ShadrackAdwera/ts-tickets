import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';


export default NextAuth({
    session: {
        jwt: true
    },providers : [
        CredentialsProvider({
            async authorize(credentials) {
                const { email, password } = credentials;
                const response = await axios.post('http://192.168.49.2:31925/api/auth/login', {
                email, password
                });
                console.log(response.data);
                return {
                    email: JSON.stringify(response.data.user)
                }
            }
        })
    
    ]
});
