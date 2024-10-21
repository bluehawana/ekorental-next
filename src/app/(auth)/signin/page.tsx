// src/app/(auth)/signin/page.tsx
import { redirect } from 'next/navigation';

export default function SignIn() {
    redirect('/login'); // Redirect to the login page
}