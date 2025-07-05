import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {

  //const [user, setUser] = useState(null);
  const [user, setUser] = useState({
  userId: '',
  remaining_balance: 0,
  total_credit_amount: 0,
  total_debit_amount: 0,
  credit_transactions: [],
  debit_transactions: []

  })
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const userId = localStorage.getItem('userId'); // ✅ Always fetch from localStorage
  const userName = localStorage.getItem('userName'); 
  //const name = localStorage.getItem('name'); 
  // ✅ Fetch user data
  const fetchUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/dashboard/${userId}`);
      console.log('Fetched user data:', res.data);
/*
      if (res.data.success) {
        const user = res.data.user;
        if (!user.userId) user.userId = user.id; // fallback fix
        setUser(user);
      }
    } 
      */
    const data = res.data.userDetails;
      console.log(data.credit_transactions, data.debit_transactions);
    // Calculate totals
    const totalCredit = data.credit_transactions.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalDebit = data.debit_transactions.reduce((sum, item) => sum + Number(item.amount), 0);
    const remaining = totalCredit - totalDebit;

    // Update state
    setUser({
      ...data,
      total_credit_amount: totalCredit,
      total_debit_amount: totalDebit,
      remaining_balance: remaining,
    });

  } 
    catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
  };

  // ✅ Initial data load
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // ✅ Submit transaction form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3000/add-transaction/${userId}`, {
        title: text,
        amount: parseFloat(amount),
      });

      if (response.data.success) {
        setText('');
        setAmount('');
        fetchUserData(); // 🔁 Refresh
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
      alert('Failed to add transaction');
    }
  };
  const handleDelete = async (type, index) => {
  try {
    const res = await axios.post(`http://localhost:3000/delete-transaction/${userId}`, {
      type,
      index,
    });

    if (res.data.success) {
      fetchUserData(); // Reload data
    } else {
      alert(res.data.message || 'Delete failed');
    }
  } catch (err) {
    console.error(err);
    alert('Error deleting transaction');
  }
};


  // ✅ While loading
  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <div>
      <h2 className="dashboard-heading">Dashboard</h2>
      <p className="dashboard-subheading">Welcome, {userName || 'Xyz...'}!</p>
      {/*logout button*/}
      <button className="logout-button" onClick={() => {
        localStorage.removeItem('userId'); // Clear userId from localStorage
        window.location.href = '/'; // Redirect to login page
      }}>LogOut</button>
      </div>
      <div className="user-info">
        
         <h3>Balance: ₹{user.remaining_balance}</h3>
<p><strong>Total Credit:</strong> ₹{user.total_credit_amount}</p>
<p><strong>Total Expense:</strong> ₹{user.total_debit_amount}</p>

      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text">Expense Detail</label>
          <input
            type="text"
            id="text"
            name="text"
            placeholder="Enter your Expense Detail..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            placeholder="Enter your Amount..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button type="submit">Add Expense</button>
      </form>

      <div className="transactions">
        <h4>Credit Transactions</h4>
        <div className="expense-list">
          {user.credit_transactions.map((credit, index) => (
  <div className="expense-item" key={`credit${index}`}>
    <button className="delete-button" onClick={() => handleDelete('credit', index)}>X</button>
    <div className="expense-description">{credit.title}</div>
    <div className="expense-amount" style={{ color: 'rgb(39, 174, 96)' }}>
      ₹{credit.amount}
    </div>
  </div>
))}
        </div>
      </div>

      <div className="transactions">
        <h4>Expense Transactions</h4>
        <div className="expense-list">
          {user.debit_transactions.map((debit, index) => (
  <div className="expense-item" key={`debit${index}`}>
    <button className="delete-button" onClick={() => handleDelete('debit', index)}>X</button>
    <div className="expense-description">{debit.title}</div>
    <div className="expense-amount" style={{ color: 'rgb(192, 57, 43)' }}>
      ₹-{debit.amount}
    </div>
  </div>
))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
