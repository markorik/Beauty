import AuthForm from "../components/LoginForm";
import { useAuth } from '../contexts/authContext';

export default function LoginPage() {
    const { login } = useAuth();

    return (
        <AuthForm onLogin={login} />
    );
}