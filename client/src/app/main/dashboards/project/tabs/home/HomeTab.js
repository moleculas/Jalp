import { motion } from 'framer-motion';
import SummaryWidget from './widgets/SummaryWidget';
import OverdueWidget from './widgets/OverdueWidget';
import IssuesWidget from './widgets/IssuesWidget';
import FeaturesWidget from './widgets/FeaturesWidget';
import GithubIssuesWidget from './widgets/GithubIssuesWidget';
import BudgetDistributionWidget from './widgets/BudgetDistributionWidget';
import WeeklyExpensesWidget from './widgets/WeeklyExpensesWidget';
import MonthlyExpensesWidget from './widgets/MonthlyExpensesWidget';
import YearlyExpensesWidget from './widgets/YearlyExpensesWidget';
import BudgetDetailsWidget from './widgets/BudgetDetailsWidget';

function HomeTab() {
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 p-24"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <SummaryWidget />
        </motion.div>
        <motion.div variants={item}>
          <OverdueWidget />
        </motion.div>
        <motion.div variants={item}>
          <IssuesWidget />
        </motion.div>
        <motion.div variants={item}>
          <FeaturesWidget />
        </motion.div>
        <motion.div variants={item} className="sm:col-span-2 md:col-span-4">
          <GithubIssuesWidget />
        </motion.div>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-6 gap-24 w-full min-w-0 p-24 -mt-24"
        variants={container}
        initial="hidden"
        animate="show"    
      >
        <motion.div variants={item} className="sm:col-span-3 lg:col-span-4">
          <BudgetDistributionWidget />
        </motion.div>
        <div className="sm:col-span-3 lg:col-span-2 grid grid-cols-1 gap-y-24">
          <motion.div variants={item} className="sm:col-span-2">
            <WeeklyExpensesWidget />
          </motion.div>
          <motion.div variants={item} className="sm:col-span-2">
            <MonthlyExpensesWidget />
          </motion.div>
          <motion.div variants={item} className="sm:col-span-2">
            <YearlyExpensesWidget />
          </motion.div>
        </div>
        <motion.div variants={item} className="sm:col-span-6">
          <BudgetDetailsWidget />
        </motion.div>
      </motion.div>
    </>
  );
}

export default HomeTab;
