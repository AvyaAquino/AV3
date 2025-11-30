import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../data/DataContext';
import type { Peca, Etapa, Funcionario, Teste } from '../types';
import { StatusPeca, TipoPeca, StatusEtapa, TipoTeste, ResultadoTeste } from '../enums';
import {
    Tabs, Typography, Descriptions, Table, Button, Modal, Form,
    Input, Select, Space, message
} from 'antd';
import type { TabsProps, TableProps } from 'antd';
import { PlusOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export function AeronaveDetailPage() {
    const { codigo } = useParams<{ codigo: string }>();
    
    const { 
        aeronaves, funcionarios, 
        addPeca, updatePecaStatus, 
        addEtapa, updateEtapa, 
        addTeste 
    } = useData();

    const aeronave = aeronaves.find(a => a.codigo === codigo);

    const [isPecaModalOpen, setIsPecaModalOpen] = useState(false);
    const [isEtapaModalOpen, setIsEtapaModalOpen] = useState(false);
    const [isTesteModalOpen, setIsTesteModalOpen] = useState(false);
    const [isRelatorioModalOpen, setIsRelatorioModalOpen] = useState(false);
    const [isPecaStatusModalOpen, setIsPecaStatusModalOpen] = useState(false);
    const [isEtapaFuncModalOpen, setIsEtapaFuncModalOpen] = useState(false);
    
    const [selectedPeca, setSelectedPeca] = useState<Peca | null>(null);
    const [selectedEtapa, setSelectedEtapa] = useState<Etapa | null>(null);
    const [relatorioConteudo, setRelatorioConteudo] = useState("");

    const [formPeca] = Form.useForm();
    const [formEtapa] = Form.useForm();
    const [formTeste] = Form.useForm();
    const [formRelatorio] = Form.useForm();
    const [formPecaStatus] = Form.useForm();
    const [formEtapaFunc] = Form.useForm();

    useEffect(() => {
        if (selectedEtapa) {
            formEtapaFunc.setFieldsValue({
                funcionarios: selectedEtapa.funcionarios.map(f => f.id)
            });
        }
    }, [selectedEtapa, formEtapaFunc]);

    if (!aeronave) return <div>Carregando ou não encontrada...</div>;

    const handleAdicionarPeca = async (values: any) => {
        await addPeca(aeronave.id, values); 
        setIsPecaModalOpen(false);
        formPeca.resetFields();
    };

    const handleAdicionarEtapa = async (values: any) => {
        await addEtapa(aeronave.id, values);
        setIsEtapaModalOpen(false);
        formEtapa.resetFields();
    };

    const handleAdicionarTeste = async (values: any) => {
        await addTeste(aeronave.id, values);
        setIsTesteModalOpen(false);
        formTeste.resetFields();
    };

    const handleUpdatePecaStatus = async (values: any) => {
        if (selectedPeca) {
            await updatePecaStatus(selectedPeca.id, values.status);
            setIsPecaStatusModalOpen(false);
        }
    };

    const handleUpdateEtapaFuncs = async (values: any) => {
        if (selectedEtapa) {
            await updateEtapa(selectedEtapa.id, { funcionarios: values.funcionarios });
            setIsEtapaFuncModalOpen(false);
        }
    };

    const handleAvancarEtapa = async (etapaId: string) => {
        const index = aeronave.etapas.findIndex(e => e.id === etapaId);
        const etapaAtual = aeronave.etapas[index];
        let novoStatus = etapaAtual.status;

        if (etapaAtual.status === StatusEtapa.PENDENTE) {
            if (index > 0) {
                const anterior = aeronave.etapas[index - 1];
                if (anterior.status !== StatusEtapa.CONCLUIDA) {
                    message.warning('Etapa anterior não concluída!');
                    return;
                }
            }
            novoStatus = StatusEtapa.EM_ANDAMENTO;
        } else if (etapaAtual.status === StatusEtapa.EM_ANDAMENTO) {
            novoStatus = StatusEtapa.CONCLUIDA;
        }

        await updateEtapa(etapaId, { status: novoStatus });
    };

    const handleGerarRelatorio = (values: any) => {
        let conteudo = `RELATÓRIO - ${aeronave.codigo}\nClient: ${values.cliente}\nData: ${values.data}\n\n`;
        conteudo += `MODELO: ${aeronave.modelo}\n\nPEÇAS:\n`;
        aeronave.pecas.forEach(p => conteudo += `- ${p.nome} (${p.status})\n`);
        conteudo += `\nETAPAS:\n`;
        aeronave.etapas.forEach(e => conteudo += `- ${e.nome}: ${e.status}\n`);
        conteudo += `\nTESTES:\n`;
        aeronave.testes.forEach(t => conteudo += `- ${t.tipo}: ${t.resultado}\n`);
        
        setRelatorioConteudo(conteudo);
        setIsRelatorioModalOpen(true);
    };

    const colunasPecas: TableProps<Peca>['columns'] = [
        { title: 'Nome', dataIndex: 'nome', key: 'nome' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Ação',
            key: 'acao',
            render: (_, peca) => (
                <Button type="link" size="small" onClick={() => { setSelectedPeca(peca); formPecaStatus.setFieldsValue({status: peca.status}); setIsPecaStatusModalOpen(true); }}>
                    Status
                </Button>
            )
        }
    ];

    const colunasEtapas: TableProps<Etapa>['columns'] = [
        { title: 'Nome', dataIndex: 'nome', key: 'nome' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { 
            title: 'Responsáveis', 
            dataIndex: 'funcionarios', 
            render: (funcs: Funcionario[]) => funcs ? funcs.map(f => f.nome).join(', ') : ''
        },
        {
            title: 'Ação',
            key: 'acao',
            render: (_, etapa) => (
                <Space>
                    {etapa.status !== StatusEtapa.CONCLUIDA && (
                        <Button size="small" type="primary" onClick={() => handleAvancarEtapa(etapa.id)}>
                            {etapa.status === StatusEtapa.PENDENTE ? 'Iniciar' : 'Finalizar'}
                        </Button>
                    )}
                    <Button icon={<EditOutlined />} size="small" onClick={() => { setSelectedEtapa(etapa); setIsEtapaFuncModalOpen(true); }} />
                </Space>
            )
        }
    ];

    const colunasTestes: TableProps<Teste>['columns'] = [
        { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
        { title: 'Resultado', dataIndex: 'resultado', key: 'resultado' },
    ];

    const tabItems: TabsProps['items'] = [
        { key: '1', label: 'Detalhes', children: <Descriptions bordered><Descriptions.Item label="Modelo">{aeronave.modelo}</Descriptions.Item></Descriptions> },
        { key: '2', label: 'Peças', children: <><Button onClick={() => setIsPecaModalOpen(true)} icon={<PlusOutlined />} style={{marginBottom: 10}}>Add Peça</Button><Table columns={colunasPecas} dataSource={aeronave.pecas} rowKey="id" /></> },
        { key: '3', label: 'Etapas', children: <><Button onClick={() => setIsEtapaModalOpen(true)} icon={<PlusOutlined />} style={{marginBottom: 10}}>Add Etapa</Button><Table columns={colunasEtapas} dataSource={aeronave.etapas} rowKey="id" /></> },
        { key: '4', label: 'Testes', children: <><Button onClick={() => setIsTesteModalOpen(true)} icon={<PlusOutlined />} style={{marginBottom: 10}}>Reg. Teste</Button><Table columns={colunasTestes} dataSource={aeronave.testes} rowKey="id" /></> },
        { key: '5', label: 'Relatório', children: <Form form={formRelatorio} onFinish={handleGerarRelatorio} layout="inline"><Form.Item name="cliente" label="Cliente"><Input/></Form.Item><Form.Item name="data" label="Data"><Input/></Form.Item><Button htmlType="submit">Gerar</Button></Form> }
    ];

    return (
        <div>
            <Title level={2}><Link to="/app/aeronaves">{"<"}</Link> {aeronave.modelo}</Title>
            <Tabs defaultActiveKey="1" items={tabItems} />

            <Modal title="Add Peça" open={isPecaModalOpen} onOk={formPeca.submit} onCancel={() => setIsPecaModalOpen(false)}>
                <Form form={formPeca} onFinish={handleAdicionarPeca} layout="vertical">
                    <Form.Item name="nome" label="Nome" rules={[{required: true}]}><Input/></Form.Item>
                    <Form.Item name="fornecedor" label="Fornecedor"><Input/></Form.Item>
                    <Form.Item name="tipo" label="Tipo"><Select><Option value={TipoPeca.NACIONAL}>Nacional</Option><Option value={TipoPeca.IMPORTADA}>Importada</Option></Select></Form.Item>
                </Form>
            </Modal>

            <Modal title="Add Etapa" open={isEtapaModalOpen} onOk={formEtapa.submit} onCancel={() => setIsEtapaModalOpen(false)}>
                <Form form={formEtapa} onFinish={handleAdicionarEtapa} layout="vertical">
                    <Form.Item name="nome" label="Nome" rules={[{required: true}]}><Input/></Form.Item>
                    <Form.Item name="prazo" label="Prazo"><Input/></Form.Item>
                    <Form.Item name="funcionarios" label="Funcionários"><Select mode="multiple">{funcionarios.map(f => <Option key={f.id} value={f.id}>{f.nome}</Option>)}</Select></Form.Item>
                </Form>
            </Modal>

            <Modal title="Reg. Teste" open={isTesteModalOpen} onOk={formTeste.submit} onCancel={() => setIsTesteModalOpen(false)}>
                <Form form={formTeste} onFinish={handleAdicionarTeste} layout="vertical">
                    <Form.Item name="tipo" label="Tipo"><Select><Option value={TipoTeste.ELETRICO}>Elétrico</Option><Option value={TipoTeste.HIDRAULICO}>Hidráulico</Option></Select></Form.Item>
                    <Form.Item name="resultado" label="Resultado"><Select><Option value={ResultadoTeste.APROVADO}>Aprovado</Option><Option value={ResultadoTeste.REPROVADO}>Reprovado</Option></Select></Form.Item>
                </Form>
            </Modal>

            <Modal title="Atualizar Status" open={isPecaStatusModalOpen} onOk={formPecaStatus.submit} onCancel={() => setIsPecaStatusModalOpen(false)}>
                <Form form={formPecaStatus} onFinish={handleUpdatePecaStatus}>
                    <Form.Item name="status" label="Status"><Select><Option value={StatusPeca.EM_PRODUCAO}>Em Produção</Option><Option value={StatusPeca.PRONTA}>Pronta</Option></Select></Form.Item>
                </Form>
            </Modal>

            <Modal title="Editar Responsáveis" open={isEtapaFuncModalOpen} onOk={formEtapaFunc.submit} onCancel={() => setIsEtapaFuncModalOpen(false)}>
                <Form form={formEtapaFunc} onFinish={handleUpdateEtapaFuncs}>
                    <Form.Item name="funcionarios" label="Funcionários"><Select mode="multiple">{funcionarios.map(f => <Option key={f.id} value={f.id}>{f.nome}</Option>)}</Select></Form.Item>
                </Form>
            </Modal>

            <Modal title="Relatório" open={isRelatorioModalOpen} onCancel={() => setIsRelatorioModalOpen(false)} footer={null} width={600}>
                <pre>{relatorioConteudo}</pre>
            </Modal>
        </div>
    );
}