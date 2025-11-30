import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Aeronave, Funcionario } from '../types';
import { api } from '../services/api';
import { message } from 'antd';

interface DataContextType {
    aeronaves: Aeronave[];
    funcionarios: Funcionario[];
    refreshData: () => Promise<void>;
    addAeronave: (data: any) => Promise<void>;
    addFuncionario: (data: any) => Promise<void>;
    addPeca: (aeronaveId: string, data: any) => Promise<void>;
    updatePecaStatus: (pecaId: string, status: string) => Promise<void>;
    addEtapa: (aeronaveId: string, data: any) => Promise<void>;
    updateEtapa: (etapaId: string, data: any) => Promise<void>;
    addTeste: (aeronaveId: string, data: any) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

    const refreshData = async () => {
        try {
            const resAero = await api.get('/aeronaves');
            const resFunc = await api.get('/funcionarios');
            setAeronaves(resAero.data);
            setFuncionarios(resFunc.data);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            message.error("Erro ao conectar com o servidor.");
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const addAeronave = async (data: any) => {
        try {
            await api.post('/aeronaves', data);
            await refreshData(); 
            message.success('Aeronave criada!');
        } catch (error) {
            message.error('Erro ao criar aeronave.');
        }
    };

    const addPeca = async (aeronaveId: string, data: any) => {
        try {
            await api.post('/pecas', { ...data, aeronaveId });
            await refreshData();
            message.success('Peça adicionada!');
        } catch (error) {
            message.error('Erro ao adicionar peça.');
        }
    };

    const updatePecaStatus = async (pecaId: string, status: string) => {
        try {
            await api.patch(`/pecas/${pecaId}`, { status });
            await refreshData();
            message.success('Status da peça atualizado!');
        } catch (error) {
            message.error('Erro ao atualizar peça.');
        }
    };

    const addEtapa = async (aeronaveId: string, data: any) => {
        try {
            const payload = {
                ...data,
                aeronaveId,
                funcionariosIds: data.funcionarios 
            };
            await api.post('/etapas', payload);
            await refreshData();
            message.success('Etapa criada!');
        } catch (error) {
            message.error('Erro ao criar etapa.');
        }
    };

    const updateEtapa = async (etapaId: string, data: any) => {
        try {
            const payload = { ...data };
            if (data.funcionarios) {
                payload.funcionariosIds = data.funcionarios;
                delete payload.funcionarios;
            }
            
            await api.patch(`/etapas/${etapaId}`, payload);
            await refreshData();
            message.success('Etapa atualizada!');
        } catch (error) {
            message.error('Erro ao atualizar etapa.');
        }
    };

    const addTeste = async (aeronaveId: string, data: any) => {
        try {
            await api.post('/testes', { ...data, aeronaveId });
            await refreshData();
            message.success('Teste registrado!');
        } catch (error) {
            message.error('Erro ao registrar teste.');
        }
    };

    const addFuncionario = async (data: any) => {
        try {
            await api.post('/funcionarios', data);
            await refreshData();
            message.success('Funcionário cadastrado!');
        } catch (error) {
            message.error('Erro ao criar funcionário.');
        }
    };

    const value = {
        aeronaves,
        funcionarios,
        refreshData,
        addAeronave,
        addFuncionario,
        addPeca,
        updatePecaStatus,
        addEtapa,
        updateEtapa,
        addTeste
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData deve ser usado dentro de um DataProvider');
    }
    return context;
}