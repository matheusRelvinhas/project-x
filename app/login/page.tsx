import { Suspense } from 'react';
import Login from '@/components/login';

// O componente de página agora usa Suspense
export default function LoginPage() {
    return (
        <Suspense fallback={<></>}>
            <Login />
        </Suspense>
    );
}