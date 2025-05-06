import { useState } from 'react';

export const useEMICalculator = () => {
  const [emi, setEmi] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const calculateEMI = (principal, annualRate, termInMonths) => {
    const P = parseFloat(principal);
    const R = parseFloat(annualRate) / 12 / 100; // Monthly rate in decimal
    const N = parseInt(termInMonths);

    if (!P || !R || !N) {
      setEmi(null);
      setSchedule([]);
      return;
    }

    // EMI formula
    const emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);

    // Fix EMI precision and update state
    const roundedEMI = parseFloat(emiValue.toFixed(2));
    setEmi(roundedEMI);

    // Build amortization schedule
    let balance = P;
    const newSchedule = [];

    for (let month = 1; month <= N; month++) {
      const interest = balance * R;
      const principalPart = roundedEMI - interest;
      balance -= principalPart;

      newSchedule.push({
        month,
        emi: roundedEMI.toFixed(2),
        principal: principalPart.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance > 0 ? balance.toFixed(2) : '0.00',
      });
    }

    setSchedule(newSchedule);
  };

  return { emi, schedule, calculateEMI };
};
