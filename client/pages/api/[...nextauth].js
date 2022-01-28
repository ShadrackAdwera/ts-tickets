import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from 'axios';

export default NextAuth({
    session: {
        jwt: true
    },providers : [
        Providers.Credentials({
            async authorize(credentials) {
                const { email, password } = credentials;
                const response = await axios.post('http://104.155.158.22:5000/api/users/login', {
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
