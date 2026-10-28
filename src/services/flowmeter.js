export function bacaFlowmeter(pompaNyala) {
  if (!pompaNyala) return { debit: 0, tekanan: 0.2 };
  return {
    debit: 9 + Math.random() * 2, // m³/jam
    tekanan: 3.5 + Math.random() * 0.6, // bar
  };
}
