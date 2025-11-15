export default function StatsCards() {
 
  const cards = [
  {
    id: 1,
    badge: "Tests",
    badgeColor: "bg-purple-300",
    bgColor: "bg-white",
    label: "Mock Tests",
    value: "+25"
  },
  {
    id: 2,
    badge: (
      <div className="flex items-center gap-1">
        <span className="text-secondary">★★★★★</span>
        <span className="text-primary font-bold">4.9</span>
      </div>
    ),
     badgeColor: "bg-white",
    bgColor: "bg-yellow-400",
    label: "Student Reviews",
    value: "+3,500"
  },
  {
    id: 3,
    badge: "Students",
    badgeColor: "bg-yellow-400",
    bgColor: "bg-purple-400",
    label: "Active Students",
    value: "+1,200",
    textColor: "text-white"
  }
];


  return (
<div className="hidden md:block absolute md:ml-8 lg:ml-20 bottom-2 left-2 md:bottom-3 md:left-3 right-2 md:right-3 z-10">
  {/* Cards Grid */}
  <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-md lg:max-w-lg">
    {cards.map((card) => (
      <div
        key={card.id}
        className={`${card.bgColor} rounded-md p-2 md:p-2.5 lg:p-3 border border-gray-900 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
      >
        {/* Badge */}
        <div className={`${card.badgeColor} inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-gray-900 mb-1 md:mb-1.5`}>
          {card.badge}
        </div>

        {/* Label */}
        <p className={`font-kodchasan text-xs mb-0.5 ${card.textColor || 'text-gray-700'}`}>
          {card.label}
        </p>

        {/* Value */}
        <h3 className={`font-kodchasan text-xs md:text-sm lg:text-base font-black ${card.textColor || 'text-gray-900'}`}>
          {card.value}
        </h3>
      </div>
    ))}
  </div>
</div>


  );
}