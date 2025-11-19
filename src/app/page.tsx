'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TransactionForm } from '@/components/custom/transaction-form';
import { VoiceTransactionModal } from '@/components/custom/voice-transaction-modal';
import { ExpensePieChart, MonthlyBarChart } from '@/components/custom/charts';
import { AccountsSection } from '@/components/custom/accounts-section';
import { CompaniesSection } from '@/components/custom/companies-section';
import { GoalsSection } from '@/components/custom/goals-section';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  LayoutDashboard,
  Receipt,
  Target,
  FileText,
  Settings,
  Building2,
  Lightbulb,
  Mic,
} from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      category: 'salary',
      amount: 5000,
      description: 'Salário mensal',
      date: '2024-01-05',
      createdAt: '2024-01-05T10:00:00.000Z',
    },
    {
      id: '2',
      type: 'expense',
      category: 'food',
      amount: 450,
      description: 'Supermercado',
      date: '2024-01-10',
      createdAt: '2024-01-10T14:30:00.000Z',
    },
    {
      id: '3',
      type: 'expense',
      category: 'transport',
      amount: 200,
      description: 'Combustível',
      date: '2024-01-12',
      createdAt: '2024-01-12T09:15:00.000Z',
    },
    {
      id: '4',
      type: 'expense',
      category: 'housing',
      amount: 1200,
      description: 'Aluguel',
      date: '2024-01-15',
      createdAt: '2024-01-15T08:00:00.000Z',
    },
  ]);

  const currentMonth = new Date().toISOString().substring(0, 7);

  const monthSummary = useMemo(() => {
    const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
    
    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transactions, currentMonth]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions([...transactions, transaction]);
  };

  const handleMenuClick = (section: string) => {
    setActiveSection(section);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    // Parse the date string as UTC to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  // Renderiza o conteúdo baseado na seção ativa
  const renderContent = () => {
    switch (activeSection) {
      case 'contas':
        return <AccountsSection />;
      case 'empresas':
        return <CompaniesSection />;
      case 'metas':
        return <GoalsSection />;
      case 'transacoes':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Transações</h2>
                <p className="text-gray-400">Gerencie todas as suas transações</p>
              </div>
              <Button
                onClick={() => setIsVoiceModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                <Mic className="w-4 h-4 mr-2" />
                Registrar por Voz
              </Button>
            </div>
            <Card className="shadow-xl bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  Todas as Transações
                </CardTitle>
                <CardDescription className="text-gray-400">Histórico completo de movimentações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          transaction.type === 'income'
                            ? 'bg-emerald-900'
                            : 'bg-red-900'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                          ) : (
                            <ArrowDownRight className="w-6 h-6 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {transaction.description || CATEGORY_LABELS[transaction.category]}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              {CATEGORY_LABELS[transaction.category]}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {formatDate(transaction.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        transaction.type === 'income'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'planilhas':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Planilhas</h2>
              <p className="text-gray-400">Organize suas finanças em planilhas</p>
            </div>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Funcionalidade em desenvolvimento</p>
                <p className="text-sm text-gray-500">Em breve você poderá criar e gerenciar planilhas personalizadas</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'relatorios':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Relatórios</h2>
              <p className="text-gray-400">Análises detalhadas das suas finanças</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-white" />
                    </div>
                    Despesas por Categoria
                  </CardTitle>
                  <CardDescription className="text-gray-400">Distribuição dos seus gastos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpensePieChart transactions={transactions} />
                </CardContent>
              </Card>

              <Card className="shadow-xl bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    Evolução Mensal
                  </CardTitle>
                  <CardDescription className="text-gray-400">Receitas vs Despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyBarChart transactions={transactions} />
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'sugestoes':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Sugestões Inteligentes</h2>
              <p className="text-gray-400">Dicas personalizadas para suas finanças</p>
            </div>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-12 text-center">
                <Lightbulb className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Funcionalidade em desenvolvimento</p>
                <p className="text-sm text-gray-500">Em breve você receberá sugestões inteligentes baseadas em IA</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'config':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Configurações</h2>
              <p className="text-gray-400">Personalize seu aplicativo</p>
            </div>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-12 text-center">
                <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Funcionalidade em desenvolvimento</p>
                <p className="text-sm text-gray-500">Em breve você poderá personalizar suas preferências</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        // Dashboard padrão
        return (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardDescription className="text-emerald-100">Receitas do Mês</CardDescription>
                  <CardTitle className="text-3xl font-bold flex items-center gap-2">
                    <ArrowUpRight className="w-6 h-6" />
                    {formatCurrency(monthSummary.totalIncome)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-emerald-100">
                    <TrendingUp className="w-4 h-4" />
                    <span>Entradas</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white border-0 shadow-2xl">
                <CardHeader className="pb-3">
                  <CardDescription className="text-red-100">Despesas do Mês</CardDescription>
                  <CardTitle className="text-3xl font-bold flex items-center gap-2">
                    <ArrowDownRight className="w-6 h-6" />
                    {formatCurrency(monthSummary.totalExpense)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-red-100">
                    <TrendingDown className="w-4 h-4" />
                    <span>Saídas</span>
                  </div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${monthSummary.balance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'} text-white border-0 shadow-2xl`}>
                <CardHeader className="pb-3">
                  <CardDescription className="text-blue-100">Saldo Atual</CardDescription>
                  <CardTitle className="text-3xl font-bold flex items-center gap-2">
                    <Wallet className="w-6 h-6" />
                    {formatCurrency(monthSummary.balance)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <Calendar className="w-4 h-4" />
                    <span suppressHydrationWarning>
                      {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-xl bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-white" />
                    </div>
                    Despesas por Categoria
                  </CardTitle>
                  <CardDescription className="text-gray-400">Distribuição dos seus gastos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpensePieChart transactions={transactions} />
                </CardContent>
              </Card>

              <Card className="shadow-xl bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    Evolução Mensal
                  </CardTitle>
                  <CardDescription className="text-gray-400">Receitas vs Despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyBarChart transactions={transactions} />
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="shadow-xl bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  Transações Recentes
                </CardTitle>
                <CardDescription className="text-gray-400">Últimas movimentações financeiras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          transaction.type === 'income'
                            ? 'bg-emerald-900'
                            : 'bg-red-900'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                          ) : (
                            <ArrowDownRight className="w-6 h-6 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {transaction.description || CATEGORY_LABELS[transaction.category]}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              {CATEGORY_LABELS[transaction.category]}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {formatDate(transaction.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${
                        transaction.type === 'income'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  FinanceApp
                </h1>
                <p className="text-sm text-gray-400">Gestão Financeira Inteligente</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsVoiceModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg"
              >
                <Mic className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Registrar por Voz</span>
                <span className="sm:hidden">Voz</span>
              </Button>
              <TransactionForm onAddTransaction={handleAddTransaction} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Menu */}
        <nav className="mb-8">
          <div className="bg-gray-900 rounded-2xl shadow-lg p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('dashboard')}
                className={`flex flex-col items-center gap-2 h-auto py-3 ${
                  activeSection === 'dashboard' 
                    ? 'bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-800' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <LayoutDashboard className={`w-5 h-5 ${activeSection === 'dashboard' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-white">Dashboard</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('contas')}
                className={`flex flex-col items-center gap-2 h-auto py-3 ${
                  activeSection === 'contas' 
                    ? 'bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-800' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <Wallet className={`w-5 h-5 ${activeSection === 'contas' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-white">Contas</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('transacoes')}
                className={`flex flex-col items-center gap-2 h-auto py-3 ${
                  activeSection === 'transacoes' 
                    ? 'bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-800' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <Receipt className={`w-5 h-5 ${activeSection === 'transacoes' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-white">Transações</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('planilhas')}
                className={`flex flex-col items-center gap-2 h-auto py-3 ${
                  activeSection === 'planilhas' 
                    ? 'bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-800' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <FileText className={`w-5 h-5 ${activeSection === 'planilhas' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-white">Planilhas</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('relatorios')}
                className={`flex flex-col items-center gap-2 h-auto py-3 ${
                  activeSection === 'relatorios' 
                    ? 'bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-800' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <FileText className={`w-5 h-5 ${activeSection === 'relatorios' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-white">Relatórios</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('metas')}
                className={`flex flex-col items-center gap-2 h-auto py-3 ${
                  activeSection === 'metas' 
                    ? 'bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-800' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <Target className={`w-5 h-5 ${activeSection === 'metas' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-white">Metas</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('sugestoes')}
                className={`flex flex-col items-center gap-2 h-auto py-3 ${
                  activeSection === 'sugestoes' 
                    ? 'bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-800' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <Lightbulb className={`w-5 h-5 ${activeSection === 'sugestoes' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-white">Sugestões</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('empresas')}
                className={`flex flex-col items-center gap-2 h-auto py-3 ${
                  activeSection === 'empresas' 
                    ? 'bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-800' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <Building2 className={`w-5 h-5 ${activeSection === 'empresas' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-white">Empresas</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleMenuClick('config')}
                className={`flex flex-col items-center gap-2 h-auto py-3 ${
                  activeSection === 'config' 
                    ? 'bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-800' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <Settings className={`w-5 h-5 ${activeSection === 'config' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="text-xs font-medium text-white">Config</span>
              </Button>
            </div>
          </div>
        </nav>

        {/* Conteúdo dinâmico baseado na seção ativa */}
        {renderContent()}
      </div>

      {/* Voice Transaction Modal */}
      <VoiceTransactionModal
        open={isVoiceModalOpen}
        onOpenChange={setIsVoiceModalOpen}
        onConfirm={handleAddTransaction}
      />
    </div>
  );
}
