
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, TrendingUp, Menu, Bell, Wallet, 
  ArrowUpRight, ArrowDownLeft, X, 
  MapPin, Calendar, Share, Loader2, ShoppingBag, CheckCircle, 
  Home, Activity, DollarSign, Lock, Unlock, Eye, EyeOff, 
  ChevronRight, Search, Filter, User, Zap, Landmark, BarChart3, Heart, Building, GraduationCap, Car, Scan, Plus, ChevronLeft, Shield, FileCheck, Plane, Coffee, Fuel, Utensils, RefreshCw
} from 'lucide-react';
import { Transaction, GlobalCartItem } from '../../types';
import { generateReceipt } from '../../services/geminiService';

interface CharityBankAppProps {
  onClose: () => void;
  transactions?: Transaction[];
  onAddToCart?: (item: GlobalCartItem) => void;
}

// Data Interfaces
interface Account {
    id: string;
    name: string;
    type: 'Checking' | 'Savings' | 'Credit';
    balance: number;
    accountNum: string;
    color: string;
}

interface Loan {
    id: string;
    name: string;
    type: 'Mortgage' | 'Auto' | 'Personal';
    balance: number;
    originalAmount: number;
    rate: string;
    nextPayment: string;
    progress: number;
}

export const CharityBankApp: React.FC<CharityBankAppProps> = ({ onClose, transactions = [], onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'BANKING' | 'LENDING' | 'INVESTING'>('BANKING');
  const [viewState, setViewState] = useState<'DASHBOARD' | 'ACCOUNT_DETAIL'>('DASHBOARD');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [currentAccountTransactions, setCurrentAccountTransactions] = useState<Transaction[]>([]);
  
  // Modals State
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null); // For Receipts (Shopping/Groceries)
  const [selectedTransfer, setSelectedTransfer] = useState<Transaction | null>(null); // For Confirmations (Everything else)
  
  const [receiptItems, setReceiptItems] = useState<{name: string, price: string}[]>([]);
  const [loadingReceipt, setLoadingReceipt] = useState(false);
  const [toastMsg, setToastMsg] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // --- DATA ---
  
  const bankingAccounts: Account[] = [
      { id: 'chk', name: 'Charity Checking', type: 'Checking', balance: 24342.50, accountNum: '...8821', color: 'bg-black text-white' },
      { id: 'sav', name: 'High Yield Savings', type: 'Savings', balance: 145000.00, accountNum: '...9901', color: 'bg-blue-600 text-white' },
  ];

  const creditCards: Account[] = [
      { id: 'cc1', name: 'Platinum Reserve', type: 'Credit', balance: 4120.50, accountNum: '...4242', color: 'bg-gradient-to-br from-pink-600 to-purple-800 text-white' },
      { id: 'cc2', name: 'Everyday Cash', type: 'Credit', balance: 850.25, accountNum: '...1102', color: 'bg-gray-800 text-white' },
  ];

  const loans: Loan[] = [
      { id: 'l1', name: 'Home Mortgage', type: 'Mortgage', balance: 452000.00, originalAmount: 500000, rate: '3.2%', nextPayment: 'Nov 1', progress: 15 },
      { id: 'l2', name: 'Tesla Auto Loan', type: 'Auto', balance: 18420.00, originalAmount: 45000, rate: '4.5%', nextPayment: 'Oct 15', progress: 60 },
  ];

  const portfolio = {
      totalValue: 128450.25,
      dayChange: 2450.10,
      dayChangePercent: 1.94,
      holdings: [
          { symbol: 'AAPL', name: 'Apple Inc.', shares: 150, price: 182.50, change: 1.2 },
          { symbol: 'TSLA', name: 'Tesla Inc.', shares: 40, price: 240.10, change: -0.5 },
          { symbol: 'NVDA', name: 'NVIDIA Corp', shares: 10, price: 460.15, change: 2.4 },
          { symbol: 'AMZN', name: 'Amazon.com', shares: 55, price: 130.20, change: 0.8 },
          { symbol: 'VTI', name: 'Vanguard Total Stock', shares: 200, price: 220.40, change: 0.1 },
      ]
  };

  // --- MOCK DATA GENERATORS ---

  const getTransactionsForAccount = (accountId: string): Transaction[] => {
      if (accountId === 'sav') {
          // SAVINGS: Mostly deposits
          return [
              { id: 'sav-1', merchant: 'Interest Payment', category: 'Interest', amount: '+$450.22', date: 'Oct 31', type: 'credit', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
              { id: 'sav-2', merchant: 'Mobile Deposit', category: 'Deposit', amount: '+$5,000.00', date: 'Oct 15', type: 'credit', icon: ArrowDownLeft, color: 'bg-blue-100 text-blue-700' },
              { id: 'sav-3', merchant: 'Transfer from Checking', category: 'Transfer', amount: '+$1,200.00', date: 'Oct 01', type: 'credit', icon: RefreshCw, color: 'bg-gray-100 text-gray-700' },
              { id: 'sav-4', merchant: 'Wire Transfer', category: 'Wire Transfer', amount: '+$25,000.00', date: 'Sep 20', type: 'credit', icon: Shield, color: 'bg-purple-100 text-purple-700' },
              { id: 'sav-5', merchant: 'Interest Payment', category: 'Interest', amount: '+$430.10', date: 'Sep 30', type: 'credit', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
              { id: 'sav-6', merchant: 'Transfer to Checking', category: 'Transfer', amount: '-$500.00', date: 'Sep 12', type: 'debit', icon: ArrowUpRight, color: 'bg-gray-100 text-gray-700' }, // Rare withdrawal
          ];
      } else if (accountId === 'chk') {
          // CHECKING: High volume, mixed
          return [
              { id: 'chk-1', merchant: 'Whole Foods Market', category: 'Groceries', amount: '-$142.18', date: 'Today', type: 'debit', icon: ShoppingBag, color: 'bg-green-100 text-green-700' },
              { id: 'chk-2', merchant: 'Juno Store', category: 'Shopping', amount: '-$64.99', date: 'Yesterday', type: 'debit', icon: ShoppingBag, color: 'bg-black text-white' },
              { id: 'chk-3', merchant: 'PGE Utilities', category: 'Bills', amount: '-$185.40', date: 'Yesterday', type: 'debit', icon: Zap, color: 'bg-orange-100 text-orange-700' },
              { id: 'chk-4', merchant: 'Payroll Deposit', category: 'Income', amount: '+$4,250.00', date: 'Oct 30', type: 'credit', icon: Building, color: 'bg-blue-100 text-blue-700' },
              { id: 'chk-5', merchant: 'Venmo: Sarah', category: 'Transfer', amount: '-$45.00', date: 'Oct 29', type: 'debit', icon: ArrowUpRight, color: 'bg-blue-50 text-blue-500' },
              { id: 'chk-6', merchant: 'CVS Pharmacy', category: 'Health', amount: '-$22.50', date: 'Oct 28', type: 'debit', icon: ShoppingBag, color: 'bg-red-100 text-red-700' },
              { id: 'chk-7', merchant: 'Wire Transfer Out', category: 'Wire Transfer', amount: '-$2,500.00', date: 'Oct 25', type: 'debit', icon: Shield, color: 'bg-gray-200 text-gray-700' },
              { id: 'chk-8', merchant: 'Target', category: 'Shopping', amount: '-$89.12', date: 'Oct 24', type: 'debit', icon: ShoppingBag, color: 'bg-red-100 text-red-700' },
          ];
      } else if (accountId === 'cc1') {
          // CREDIT CARD 1: Luxury/Travel/Dining
          return [
              { id: 'cc1-1', merchant: 'Nobu Palo Alto', category: 'Dining', amount: '-$320.00', date: 'Yesterday', type: 'debit', icon: Utensils, color: 'bg-black text-white' },
              { id: 'cc1-2', merchant: 'Lifetime FLIGHTS', category: 'Travel', amount: '-$450.00', date: 'Oct 28', type: 'debit', icon: Plane, color: 'bg-sky-100 text-sky-700' },
              { id: 'cc1-3', merchant: 'Equinox Membership', category: 'Health', amount: '-$280.00', date: 'Oct 25', type: 'debit', icon: Activity, color: 'bg-black text-white' },
              { id: 'cc1-4', merchant: 'Uber', category: 'Transport', amount: '-$42.15', date: 'Oct 22', type: 'debit', icon: Car, color: 'bg-gray-100 text-gray-700' },
              { id: 'cc1-5', merchant: 'The Ritz-Carlton', category: 'Travel', amount: '-$850.00', date: 'Oct 15', type: 'debit', icon: Home, color: 'bg-blue-100 text-blue-700' },
          ];
      } else {
          // CREDIT CARD 2: Everyday/Gas/Subs
          return [
              { id: 'cc2-1', merchant: 'Shell Station', category: 'Gas', amount: '-$54.20', date: 'Today', type: 'debit', icon: Fuel, color: 'bg-yellow-100 text-yellow-700' },
              { id: 'cc2-2', merchant: 'Starbucks', category: 'Dining', amount: '-$8.45', date: 'Today', type: 'debit', icon: Coffee, color: 'bg-green-100 text-green-700' },
              { id: 'cc2-3', merchant: 'Netflix', category: 'Subscription', amount: '-$22.99', date: 'Oct 29', type: 'debit', icon: Zap, color: 'bg-red-100 text-red-700' },
              { id: 'cc2-4', merchant: 'Spotify', category: 'Subscription', amount: '-$14.99', date: 'Oct 28', type: 'debit', icon: Zap, color: 'bg-green-100 text-green-700' },
              { id: 'cc2-5', merchant: 'Trader Joes', category: 'Groceries', amount: '-$62.30', date: 'Oct 25', type: 'debit', icon: ShoppingBag, color: 'bg-red-100 text-red-700' },
          ];
      }
  };

  // --- ACTIONS ---

  const handleAccountClick = (acc: Account) => {
      setSelectedAccount(acc);
      setCurrentAccountTransactions(getTransactionsForAccount(acc.id));
      setViewState('ACCOUNT_DETAIL');
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
      setToastMsg({ msg, type });
      setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTransactionClick = async (t: Transaction) => {
      // Allowed Categories for Receipts (Shoppable)
      const receiptCategories = ['Groceries', 'Shopping'];

      if (receiptCategories.includes(t.category)) {
          // Show Receipt Modal (Can add to Silas Shop)
          setSelectedTransaction(t);
          setLoadingReceipt(true);
          setReceiptItems([]);
          try {
              let items = await generateReceipt(t.merchant, t.amount, t.category);
              if (!items || items.length === 0) {
                  const total = parseFloat(t.amount.replace(/[^0-9.]/g, ''));
                  items = [
                      { name: `${t.category} Item`, price: `$${(total * 0.7).toFixed(2)}` },
                      { name: `Tax`, price: `$${(total * 0.3).toFixed(2)}` }
                  ];
              }
              setReceiptItems(items);
          } catch (e) { 
              setReceiptItems([{ name: "Receipt Unavailable", price: t.amount }]);
          } 
          finally { setLoadingReceipt(false); }
      } else {
          // Show Confirmation Modal (ReadOnly, Non-Shoppable)
          // Includes: Health, Dining, Bills, Transport, Travel, Subscription, Gas, Transfers, etc.
          setSelectedTransfer(t);
      }
  };

  const handleAddToCart = (e: React.MouseEvent, itemName: string, priceStr: string) => {
      e.stopPropagation();
      
      const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
      if (onAddToCart && selectedTransaction) {
          onAddToCart({
              id: `rcpt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              name: itemName,
              price: isNaN(price) ? 0 : price,
              store: selectedTransaction.merchant,
              category: selectedTransaction.category,
              addedAt: new Date(),
              deliveryMethod: 'HOME'
          });
          showToast("Added to Silas Shop", 'success');
      }
  };

  // Calculate Total Net Worth for Header
  const totalBalance = bankingAccounts.reduce((sum, acc) => sum + acc.balance, 0) 
                     - creditCards.reduce((sum, acc) => sum + acc.balance, 0)
                     + portfolio.totalValue;

  // --- RENDERERS ---

  const renderBanking = () => (
      <div className="space-y-6 pb-24">
          {/* Header Card */}
          <div className="bg-black text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-medium uppercase tracking-wider">
                          <Wallet size={16} /> Total Net Worth
                      </div>
                      <Bell size={20} className="text-gray-400" />
                  </div>
                  <div className="text-4xl font-bold mb-6">${totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                  <div className="flex gap-4">
                      <button className="flex-1 bg-white/20 hover:bg-white/30 transition-colors py-3 rounded-xl flex flex-col items-center gap-1">
                          <ArrowUpRight size={20} />
                          <span className="text-[10px] font-bold uppercase">Send</span>
                      </button>
                      <button className="flex-1 bg-white/20 hover:bg-white/30 transition-colors py-3 rounded-xl flex flex-col items-center gap-1">
                          <ArrowDownLeft size={20} />
                          <span className="text-[10px] font-bold uppercase">Request</span>
                      </button>
                      <button className="flex-1 bg-white/20 hover:bg-white/30 transition-colors py-3 rounded-xl flex flex-col items-center gap-1">
                          <Scan size={20} />
                          <span className="text-[10px] font-bold uppercase">Pay</span>
                      </button>
                  </div>
              </div>
              <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-pink-600 rounded-full blur-[80px] opacity-30"></div>
          </div>

          {/* Bank Accounts */}
          <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Banking Accounts</h3>
              <div className="space-y-3">
                  {bankingAccounts.map(acc => (
                      <div 
                        key={acc.id} 
                        onClick={() => handleAccountClick(acc)}
                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                          <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${acc.color}`}>
                                  <Landmark size={20} />
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900">{acc.name}</h4>
                                  <p className="text-xs text-gray-500 font-mono">{acc.accountNum}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <div className="font-bold text-slate-900">${acc.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                              <div className="text-xs text-green-600 font-bold">Available</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Credit Cards */}
          <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Credit Cards</h3>
              <div className="space-y-3">
                  {creditCards.map(cc => (
                      <div 
                        key={cc.id} 
                        onClick={() => handleAccountClick(cc)}
                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                          <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cc.color}`}>
                                  <CreditCard size={20} />
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900">{cc.name}</h4>
                                  <p className="text-xs text-gray-500 font-mono">{cc.accountNum}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <div className="font-bold text-slate-900">${cc.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                              <div className="text-xs text-gray-400">Current Balance</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderAccountDetail = () => {
      if (!selectedAccount) return null;
      return (
          <div className="flex-1 flex flex-col bg-white h-full relative">
              {/* Detail Header */}
              <div className="bg-white p-6 pb-6 border-b border-gray-100 z-20 relative shadow-sm shrink-0">
                  <button onClick={() => { setViewState('DASHBOARD'); setSelectedAccount(null); }} className="flex items-center gap-1 text-pink-600 font-bold mb-4 text-sm active:opacity-50 transition-opacity">
                      <ChevronLeft size={16} /> Back to Accounts
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedAccount.name}</h1>
                  <p className="text-gray-500 text-sm font-mono mb-4">{selectedAccount.accountNum}</p>
                  <div className="text-4xl font-bold text-black">
                      ${Math.abs(selectedAccount.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </div>
              </div>

              {/* Transactions List */}
              <div className="flex-1 overflow-y-auto bg-white relative">
                  <div className="sticky top-0 z-10 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">
                      Transaction History
                  </div>
                  
                  <div className="pb-32">
                      {currentAccountTransactions.map((t, i) => (
                          <div 
                            key={i} 
                            onClick={() => handleTransactionClick(t)}
                            className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
                          >
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.color || 'bg-gray-200'}`}>
                                      {t.icon ? <t.icon size={16} /> : <ShoppingBag size={16} />}
                                  </div>
                                  <div>
                                      <div className="font-bold text-gray-900 text-sm">{t.merchant}</div>
                                      <div className="text-xs text-gray-500">{t.date} • {t.category}</div>
                                  </div>
                              </div>
                              <span className={`font-bold text-sm ${t.type === 'credit' ? 'text-green-600' : 'text-black'}`}>
                                  {t.amount}
                              </span>
                          </div>
                      ))}
                      {currentAccountTransactions.length === 0 && (
                          <div className="p-8 text-center text-gray-400 text-sm">No recent transactions.</div>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  const renderLending = () => (
      <div className="space-y-6 pb-24">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-1">Active Loans</h2>
                  <p className="text-slate-400 text-sm mb-6">Total Outstanding: ${(452000 + 18420).toLocaleString()}</p>
                  <div className="flex gap-4">
                      <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold text-sm">Make Payment</button>
                      <button className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold text-sm">View Statements</button>
                  </div>
              </div>
          </div>
          <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Your Loans</h3>
              <div className="space-y-4">
                  {loans.map(loan => (
                      <div key={loan.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-slate-700">
                                      {loan.type === 'Mortgage' ? <Home size={18} /> : <Car size={18} />}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-slate-900">{loan.name}</h4>
                                      <p className="text-xs text-gray-500">{loan.rate} APR</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <div className="font-bold text-slate-900 text-lg">${loan.balance.toLocaleString()}</div>
                                  <div className="text-xs text-gray-500">Remaining</div>
                              </div>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                              <div className="h-full bg-slate-900 rounded-full" style={{ width: `${loan.progress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 font-medium">
                              <span>{loan.progress}% Paid Off</span>
                              <span>Due {loan.nextPayment}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderInvesting = () => (
      <div className="space-y-6 pb-24">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <div className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Portfolio</div>
                      <div className="text-3xl font-black text-slate-900">${portfolio.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <TrendingUp size={14} /> +{portfolio.dayChangePercent}%
                  </div>
              </div>
              <div className="h-32 flex items-end gap-1 mb-2">
                  {[40, 45, 42, 50, 48, 55, 60, 58, 65, 70, 68, 75, 80, 85, 82, 90, 95, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-green-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                  ))}
              </div>
          </div>
          <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Holdings</h3>
              <div className="space-y-3">
                  {portfolio.holdings.map(stock => (
                      <div key={stock.symbol} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                  {stock.symbol[0]}
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900">{stock.symbol}</h4>
                                  <p className="text-xs text-gray-500">{stock.shares} shares</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <div className="font-bold text-slate-900">${stock.price.toFixed(2)}</div>
                              <div className={`text-xs font-bold ${stock.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                  {stock.change > 0 ? '+' : ''}{stock.change}%
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute inset-0 bg-gray-50 z-50 flex flex-col font-sans text-black overflow-hidden"
    >
        {/* Header */}
        <div className="pt-12 px-6 pb-4 bg-white z-20 sticky top-0 shadow-sm flex justify-between items-center">
            {viewState === 'ACCOUNT_DETAIL' ? (
                <button onClick={() => setViewState('DASHBOARD')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <ChevronLeft size={20} className="text-gray-600" />
                </button>
            ) : (
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    <Landmark className="text-pink-600" /> Bank of Charity
                </h1>
            )}
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <X size={20} className="text-gray-600" />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 relative z-10">
            <AnimatePresence mode="wait">
                {viewState === 'DASHBOARD' && activeTab === 'BANKING' && (
                    <motion.div key="banking" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        {renderBanking()}
                    </motion.div>
                )}
                {viewState === 'DASHBOARD' && activeTab === 'LENDING' && (
                    <motion.div key="lending" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        {renderLending()}
                    </motion.div>
                )}
                {viewState === 'DASHBOARD' && activeTab === 'INVESTING' && (
                    <motion.div key="investing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        {renderInvesting()}
                    </motion.div>
                )}
                {viewState === 'ACCOUNT_DETAIL' && (
                    <motion.div key="detail" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-0 top-0 left-0 bg-white min-h-full">
                        {renderAccountDetail()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 h-[83px] bg-white border-t border-gray-200 flex justify-around items-start pt-3 z-30 pb-8">
            <button 
                onClick={() => { setActiveTab('BANKING'); setViewState('DASHBOARD'); }}
                className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'BANKING' ? 'text-pink-600' : 'text-gray-400'}`}
            >
                <Landmark size={24} />
                <span className="text-[10px] font-bold">Banking</span>
            </button>
            <button 
                onClick={() => { setActiveTab('LENDING'); setViewState('DASHBOARD'); }}
                className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'LENDING' ? 'text-pink-600' : 'text-gray-400'}`}
            >
                <DollarSign size={24} />
                <span className="text-[10px] font-bold">Lending</span>
            </button>
            <button 
                onClick={() => { setActiveTab('INVESTING'); setViewState('DASHBOARD'); }}
                className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'INVESTING' ? 'text-pink-600' : 'text-gray-400'}`}
            >
                <TrendingUp size={24} />
                <span className="text-[10px] font-bold">Investing</span>
            </button>
        </div>

        {/* Home Indicator */}
        <div 
            className="absolute bottom-0 left-0 right-0 h-10 z-[100] flex items-end justify-center pb-2 cursor-pointer pointer-events-auto"
            onClick={onClose}
        >
            <div className="w-32 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* --- WIRE TRANSFER / PAYMENT CONFIRMATION MODAL --- */}
        <AnimatePresence>
            {selectedTransfer && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={() => setSelectedTransfer(null)}
                >
                    <motion.div 
                        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {(() => {
                            const isTransferType = ['Transfer', 'Wire Transfer', 'Deposit', 'Income', 'Interest'].includes(selectedTransfer.category);
                            const title = isTransferType ? "Transfer Confirmed" : "Payment Confirmed";
                            const Icon = isTransferType ? FileCheck : CheckCircle;
                            
                            return (
                                <>
                                    <div className="bg-slate-900 p-6 text-white text-center">
                                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                                            <Icon size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold">{title}</h3>
                                        <p className="text-slate-400 text-sm mt-1">Transaction Successful</p>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between py-3 border-b border-gray-100">
                                            <span className="text-gray-500 text-sm">Amount</span>
                                            <span className="text-slate-900 font-bold">{selectedTransfer.amount}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-100">
                                            <span className="text-gray-500 text-sm">Date</span>
                                            <span className="text-slate-900 font-medium">{selectedTransfer.date}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-100">
                                            <span className="text-gray-500 text-sm">Type</span>
                                            <span className="text-slate-900 font-medium">{selectedTransfer.category}</span>
                                        </div>
                                        <div className="flex justify-between py-3 mb-6">
                                            <span className="text-gray-500 text-sm">Reference</span>
                                            <span className="text-slate-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded">TRX-{Math.floor(Math.random()*100000)}</span>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedTransfer(null)}
                                            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl active:scale-95 transition-transform"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </>
                            );
                        })()}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- RECEIPT MODAL (Shopping Only) --- */}
        <AnimatePresence>
            {selectedTransaction && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={() => setSelectedTransaction(null)}
                >
                    <motion.div 
                        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                        className="bg-white w-full max-w-xs sm:max-w-sm shadow-2xl relative flex flex-col max-h-[85%] overflow-hidden"
                        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 10px), 95% 100%, 90% calc(100% - 10px), 85% 100%, 80% calc(100% - 10px), 75% 100%, 70% calc(100% - 10px), 65% 100%, 60% calc(100% - 10px), 55% 100%, 50% calc(100% - 10px), 45% 100%, 40% calc(100% - 10px), 35% 100%, 30% calc(100% - 10px), 25% 100%, 20% calc(100% - 10px), 15% 100%, 10% calc(100% - 10px), 5% 100%, 0% calc(100% - 10px))' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4 bg-gray-50 border-b border-dashed border-gray-300 flex justify-between items-center shrink-0">
                            <h3 className="font-bold text-gray-900 font-mono tracking-widest uppercase">Receipt</h3>
                            <button onClick={() => setSelectedTransaction(null)}><X size={20} className="text-gray-500" /></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto bg-white font-mono">
                            <div className="text-center mb-6">
                                <div className="text-2xl font-bold uppercase mb-1">{selectedTransaction.merchant}</div>
                                <div className="text-xs text-gray-500">{selectedTransaction.date} • {selectedTransaction.category}</div>
                                <div className="text-3xl font-black mt-3 border-b-2 border-black pb-2 inline-block">{selectedTransaction.amount}</div>
                            </div>

                            {loadingReceipt ? (
                                <div className="flex flex-col items-center justify-center py-4 text-gray-400 gap-2">
                                    <Loader2 className="animate-spin" />
                                    <span className="text-xs">Printing details...</span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {receiptItems.length > 0 ? receiptItems.map((item, i) => (
                                        <div key={i} className="flex justify-between text-xs group cursor-pointer hover:bg-yellow-50 p-1 rounded" onClick={(e) => handleAddToCart(e, item.name, item.price)}>
                                            <span className="text-gray-800 uppercase">{item.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{item.price}</span>
                                                <Plus size={12} className="text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center text-xs text-gray-400 italic">Itemization unavailable.</div>
                                    )}
                                </div>
                            )}
                            
                            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300 text-center">
                                <div className="text-[10px] text-gray-400 mb-2">AUTH CODE: 882190-X</div>
                                <div className="w-full h-8 bg-black/10 rounded flex items-center justify-center">
                                    <span className="font-mono text-xs tracking-widest">||| || ||| | ||</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">
                            Tap Item to Add to Global Cart
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {toastMsg && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 50, x: '-50%' }}
                    className={`absolute bottom-24 left-1/2 px-4 py-2 rounded-full shadow-lg z-[80] flex items-center gap-2 whitespace-nowrap ${toastMsg.type === 'error' ? 'bg-red-600 text-white' : 'bg-black text-white'}`}
                >
                    {toastMsg.type === 'success' ? <CheckCircle size={16} className="text-green-400" /> : <X size={16} className="text-white" />}
                    <span className="text-sm font-bold">{toastMsg.msg}</span>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};