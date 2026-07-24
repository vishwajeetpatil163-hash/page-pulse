import MetricCard from "./MetricCard";
import { buildMetricCards } from "../services/reportMetrics";

export default function ReportGrid({ report }) {
  const cards = buildMetricCards(report);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
      {cards.map((card, i) => (
        <MetricCard key={card.key} {...card} style={{ animationDelay: `${i * 45}ms` }} />
      ))}
    </div>
  );
}
