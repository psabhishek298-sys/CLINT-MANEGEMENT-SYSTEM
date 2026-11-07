import { Client, BusinessCategory } from '../../types';

interface CategoryDistributionProps {
  clients: Client[];
}

export default function CategoryDistribution({ clients }: CategoryDistributionProps) {
  const total = clients.length || 1;

  // Aggregate category counts
  const categoryCounts = clients.reduce((acc, client) => {
    const cat = client.businessCategory;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort descending by count
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7); // top 7 categories

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">Business Categories</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Top industries in client portfolio</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg">
          {Object.keys(categoryCounts).length} Niches
        </span>
      </div>

      <div className="space-y-3.5">
        {sortedCategories.map(([category, count]) => {
          const pct = Math.round((count / total) * 100);
          return (
            <div key={category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700 dark:text-gray-300">{category}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {count} <span className="text-gray-400 font-normal">({pct}%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
