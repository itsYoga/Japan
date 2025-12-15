import React, { useState, useEffect } from 'react';
import { RetroCard } from './RetroCard';
import { Expense, Member } from '../types';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

// Mock Members for Splitting
const MEMBERS = [
    { id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }, { id: '3', name: 'Charlie' },
    { id: '4', name: 'Dave' }, { id: '5', name: 'Eve' }, { id: '6', name: 'Frank' }, { id: '7', name: 'Grace' }
];

export const ExpenseView: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [inputMode, setInputMode] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [payer, setPayer] = useState('1'); // Default Alice
  const [splitWith, setSplitWith] = useState<string[]>(MEMBERS.map(m => m.id)); // Default All

  // Effect to load expenses (Real Firestore or Mock Fallback)
  useEffect(() => {
    try {
        const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loaded: Expense[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
            setExpenses(loaded);
        }, (err) => {
            // Fallback for demo if permission denied/no config
            console.log("Using local state for expenses demo");
             setExpenses([
                { id: '1', item: 'HARUKA Ticket', amount: 8300, amountJpy: 37680, paidBy: '1', splitWith: ['1','2','3','4','5','6','7'], category: 'transport', date: 'Day 1' },
                { id: '2', item: 'Yuzu Hotpot', amount: 12800, amountJpy: 58000, paidBy: '2', splitWith: ['1','2','3','4','5','6','7'], category: 'food', date: 'Day 1' },
            ]);
        });
        return () => unsubscribe();
    } catch (e) {
        console.warn("Firestore not ready");
    }
  }, []);

  const handleAddExpense = async () => {
    if(!newAmount || !newItemName) return;
    
    const expenseData = {
        item: newItemName,
        amount: parseInt(newAmount),
        amountJpy: parseInt(newAmount) * 4.54,
        paidBy: payer,
        splitWith: splitWith,
        category: 'food' as const, // Simplified for demo
        date: new Date().toLocaleDateString(),
        createdAt: new Date()
    };

    try {
        await addDoc(collection(db, "expenses"), expenseData);
    } catch (e) {
        // Fallback
        setExpenses([ { id: Date.now().toString(), ...expenseData } as any, ...expenses]);
    }
    
    setInputMode(false);
    setNewAmount('');
    setNewItemName('');
  };

  const toggleSplitMember = (id: string) => {
      if(splitWith.includes(id)) {
          setSplitWith(splitWith.filter(uid => uid !== id));
      } else {
          setSplitWith([...splitWith, id]);
      }
  };

  // Calculate Balances (Simplified: Who paid what vs what they should have paid)
  // Total cost per person
  const balances: Record<string, number> = {};
  MEMBERS.forEach(m => balances[m.id] = 0);

  expenses.forEach(exp => {
      // Creditor (Payer)
      balances[exp.paidBy] += exp.amount;
      // Debtor (Splitters)
      const splitAmount = exp.amount / (exp.splitWith.length || 1);
      exp.splitWith.forEach(uid => {
          balances[uid] -= splitAmount;
      });
  });

  return (
    <div className="pb-24 px-4 pt-6">
      <h1 className="text-2xl font-bold mb-4 text-stone-800">記帳 & 分帳</h1>
      
      {/* Balances Dashboard */}
      <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
          {MEMBERS.map(m => (
              <div key={m.id} className={`flex-shrink-0 w-24 p-2 rounded-xl border-2 text-center ${balances[m.id] >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="text-xs font-bold text-stone-500 mb-1">{m.name}</div>
                  <div className={`font-bold ${balances[m.id] >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {balances[m.id] >= 0 ? '+' : ''}{Math.round(balances[m.id])}
                  </div>
              </div>
          ))}
      </div>

      {/* Add Button */}
      <button 
        onClick={() => setInputMode(!inputMode)}
        className="w-full py-4 bg-stone-800 text-white font-bold rounded-xl shadow-retro active:shadow-retro-active active:translate-y-[4px] active:translate-x-[4px] transition-all mb-6 flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-plus"></i> 新增支出
      </button>

      {inputMode && (
         <RetroCard className="mb-6 animate-fade-in-down border-dashed">
            <h3 className="font-bold text-stone-800 mb-3">新增一筆</h3>
            <input 
                type="text" 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded mb-2"
                placeholder="項目名稱 (e.g. 晚餐)"
            />
            <input 
                type="number" 
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded mb-4"
                placeholder="金額 (TWD)"
            />
            
            <div className="mb-4">
                <label className="text-xs font-bold text-stone-500 block mb-1">誰付的?</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {MEMBERS.map(m => (
                        <button 
                            key={m.id} 
                            onClick={() => setPayer(m.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${payer === m.id ? 'bg-stone-800 text-white' : 'bg-white text-stone-600'}`}
                        >
                            {m.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="text-xs font-bold text-stone-500 block mb-1">分給誰? (全選: {splitWith.length})</label>
                <div className="flex flex-wrap gap-2">
                    {MEMBERS.map(m => (
                        <button 
                            key={m.id} 
                            onClick={() => toggleSplitMember(m.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${splitWith.includes(m.id) ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                        >
                            {m.name.charAt(0)}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                onClick={handleAddExpense}
                className="w-full mt-2 bg-emerald-500 text-white font-bold py-2 rounded-lg border-2 border-stone-800 shadow-[2px_2px_0px_0px_#44403c]"
            >
                確認儲存
            </button>
         </RetroCard>
      )}

      {/* List */}
      <div className="space-y-3">
        {expenses.map((exp) => (
          <RetroCard key={exp.id} className="py-3 px-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-stone-800 flex items-center justify-center text-stone-700">
                        <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div>
                        <p className="font-bold text-stone-800">{exp.item}</p>
                        <p className="text-xs text-stone-500">
                            {MEMBERS.find(m => m.id === exp.paidBy)?.name} 付款 • {exp.splitWith.length} 人分
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-stone-800">NT$ {exp.amount.toLocaleString()}</p>
                    {exp.amountJpy && <p className="text-xs text-stone-400">¥ {Math.round(exp.amountJpy).toLocaleString()}</p>}
                </div>
            </div>
          </RetroCard>
        ))}
      </div>
    </div>
  );
};
