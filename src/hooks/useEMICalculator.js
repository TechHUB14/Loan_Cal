
import { useState } from 'react';

export const useEMICalculator = () => {
  const [emi, setEmi] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const calculateEMI = (principal, rate, term) => {
    const P = parseFloat(principal);
    const R = parseFloat(rate) / 12 / 100;
    const N = parseInt(term);

    if (!P || !R || !N) {
      setEmi(null);
      setSchedule([]);
      return;
    }

    const emiVal = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    setEmi(emiVal.toFixed(2));

    const amortization = [];
    let balance = P;
    for (let i = 1; i <= N; i++) {
      const interest = balance * R;
      const principalPayment = emiVal - interest;
      balance -= principalPayment;

      amortization.push({
        month: i,
        emi: emiVal.toFixed(2),
        principal: principalPayment.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance > 0 ? balance.toFixed(2) : '0.00',
      });
    }

    setSchedule(amortization);
  };

  return { emi, schedule, calculateEMI };
};
