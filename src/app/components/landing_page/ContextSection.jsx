import ContextCard from "./ContextCard";

const ContextSection = () => (
  <section className="bg-gray-50 py-4 px-2 md:px-0 mt-0" id="context">
    <div className="max-w-7xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-900">
        Experience Intelligent Card Management
      </h2>
      <p className="text-base md:text-lg text-gray-600 text-center mb-6 max-w-2xl">
        See how CardSmart adapts to different contexts throughout your day.
      </p>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full">
        {/* Morning Card */}
        <ContextCard
          time="8:15 AM • Monday"
          label="Morning"
          greeting="Good Morning, Alex"
          icon="☀️"
          description="Your morning commute cards are ready"
          priorityCards={[
            <div
              key="metro"
              className="bg-blue-700 text-white rounded-xl p-4 flex flex-col gap-1 shadow">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="bg-blue-900/30 px-2 py-0.5 rounded text-white">
                  Transit Card
                </span>
                <span className="text-lg">🚉</span>
              </div>
              <div className="font-bold text-lg">Metro Pass</div>
              <div className="text-xs">Balance: $24.50</div>
            </div>,
            <div
              key="brew"
              className="bg-green-700 text-white rounded-xl p-4 flex flex-col gap-1 shadow">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="bg-green-900/30 px-2 py-0.5 rounded text-white">
                  Coffee Shop
                </span>
                <span className="text-lg">☕</span>
              </div>
              <div className="font-bold text-lg">Morning Brew</div>
              <div className="text-xs">Points: 340</div>
            </div>,
          ]}
          actions={[
            <span
              key="home"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              🏠
            </span>,
            <span
              key="card"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              💳
            </span>,
            <span
              key="plus"
              className="bg-sky-500 rounded-full p-2 text-xl text-white shadow-lg">
              ＋
            </span>,
            <span
              key="chart"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              📊
            </span>,
            <span
              key="cog"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              ⚙️
            </span>,
          ]}
        />
        {/* Afternoon Card */}
        <ContextCard
          time="12:30 PM • Monday"
          label="Afternoon"
          greeting="Lunch Time, Alex"
          icon="🍽️"
          description="Near Downtown Food Court"
          priorityCards={[
            <div
              key="foodcourt"
              className="bg-purple-700 text-white rounded-xl p-4 flex flex-col gap-1 shadow">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="bg-purple-900/30 px-2 py-0.5 rounded text-white">
                  Rewards Card
                </span>
                <span className="text-lg">🍰</span>
              </div>
              <div className="font-bold text-lg">Food Court Points</div>
              <div className="text-xs">Points: 1,240</div>
            </div>,
            <div
              key="dining"
              className="bg-yellow-700 text-white rounded-xl p-4 flex flex-col gap-1 shadow">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="bg-yellow-900/30 px-2 py-0.5 rounded text-white">
                  Cashback Card
                </span>
                <span className="text-lg">💳</span>
              </div>
              <div className="font-bold text-lg">Dining 5% Back</div>
              <div className="text-xs">**** 7890</div>
            </div>,
          ]}
          actions={[
            <span
              key="home"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              🏠
            </span>,
            <span
              key="card"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              💳
            </span>,
            <span
              key="plus"
              className="bg-sky-500 rounded-full p-2 text-xl text-white shadow-lg">
              ＋
            </span>,
            <span
              key="chart"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              📊
            </span>,
            <span
              key="cog"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              ⚙️
            </span>,
          ]}
        />
        {/* Evening Card */}
        <ContextCard
          time="7:45 PM • Monday"
          label="Evening"
          greeting="Good Evening, Alex"
          icon="🌙"
          description="Near City Center Mall"
          priorityCards={[
            <div
              key="mall"
              className="bg-indigo-700 text-white rounded-xl p-4 flex flex-col gap-1 shadow">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="bg-indigo-900/30 px-2 py-0.5 rounded text-white">
                  Loyalty Card
                </span>
                <span className="text-lg">🔒</span>
              </div>
              <div className="font-bold text-lg">City Center Mall</div>
              <div className="text-xs">Points: 780</div>
            </div>,
            <div
              key="movie"
              className="bg-pink-700 text-white rounded-xl p-4 flex flex-col gap-1 shadow">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="bg-pink-900/30 px-2 py-0.5 rounded text-white">
                  Entertainment
                </span>
                <span className="text-lg">🎟️</span>
              </div>
              <div className="font-bold text-lg">Movie Discount</div>
              <div className="text-xs">15% Off Today</div>
            </div>,
          ]}
          actions={[
            <span
              key="home"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              🏠
            </span>,
            <span
              key="card"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              💳
            </span>,
            <span
              key="plus"
              className="bg-sky-500 rounded-full p-2 text-xl text-white shadow-lg">
              ＋
            </span>,
            <span
              key="chart"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              📊
            </span>,
            <span
              key="cog"
              className="bg-gray-100 rounded-full p-2 text-xl text-gray-400">
              ⚙️
            </span>,
          ]}
        />
      </div>
    </div>
  </section>
);

export default ContextSection;
