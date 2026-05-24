import { BudgetPage, BudgetProvider } from './modules/budget';

export default function App() {
  return (
    <BudgetProvider>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <BudgetPage />
      </main>
    </BudgetProvider>
  );
}
