import React, { createContext, useContext, useState } from 'react';
import type { Funcionario } from '../types';
import { api } from '../services/api'; 
import { message } from 'antd'; 

interface AuthContextType {
    user: Funcionario | null;
    login: (usuario: string, senha: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Funcionario | null>(null);

    const login = async (usuario: string, senha: string): Promise<boolean> => {
        try {
            // Chamada real para a API
            const response = await api.post('/login', { usuario, senha });
            
            if (response.data.success) {
                setUser(response.data.user);
                message.success('Login realizado com sucesso!');
                return true;
            }
        } catch (error) {
            console.error(error);
            message.error('Usuário ou senha inválidos.');
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        message.info('Você saiu do sistema.');
    };

    const value = { user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}