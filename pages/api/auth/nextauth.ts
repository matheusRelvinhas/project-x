// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,  // Sua chave de cliente do Google
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,  // Seu segredo do cliente do Google
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Defina a chave secreta para segurança
  pages: {
    signIn: '/login', // Definindo uma página personalizada de login (opcional)
  },
  callbacks: {
    // O callback de redirecionamento após a autenticação bem-sucedida
    async redirect({ url, baseUrl }) {
      return baseUrl; // Redireciona para a página principal após o login
    },
  },
});
