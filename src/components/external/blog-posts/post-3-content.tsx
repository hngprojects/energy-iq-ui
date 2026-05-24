"use client";

import { motion } from "motion/react";

const h2 = "mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl";
const h3 = "mb-3 text-lg font-semibold text-slate-100";
const p = "text-md text-slate-80 leading-relaxed md:text-lg";
const ul = "text-md text-slate-80 list-disc space-y-1 pl-6 leading-relaxed md:text-lg";
const divider = "border-slate-30 my-10 border-t";
const section = "scroll-mt-32 space-y-4";

export default function Post3Content() {
  return (
    <div className="space-y-20">

      {/* ── Intro ── */}
      <section id="intro" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>Introduction</h2>
          <p className="text-md text-slate-70 italic leading-relaxed md:text-lg">
            The future of smarter, cheaper and more efficient energy operation
          </p>
          <p className={p}>
            Artificial Intelligence (AI) is no longer just a buzzword in tech
            circles. Across industries, AI is transforming how businesses
            operate, and one of the biggest areas experiencing rapid innovation
            is energy management.
          </p>
          <p className={p}>
            From reducing electricity waste in commercial buildings to
            optimising renewable energy usage in factories and smart homes,
            AI-powered energy management systems are helping businesses cut
            costs, improve efficiency and reduce carbon emissions.
          </p>
          <p className={p}>
            As energy prices continue to rise globally and sustainability
            becomes a business priority, organisations are turning to AI-driven
            systems to gain real-time control over how energy is consumed,
            stored and distributed.
          </p>
          <blockquote className="border-primary bg-amber-10 text-slate-80 rounded-r-lg border-l-4 px-5 py-4 text-base italic md:text-lg">
            According to the International Energy Agency (IEA), AI has the
            potential to significantly optimise energy systems by improving
            efficiency, forecasting demand and managing power usage in real
            time.{" "}
            <a
              href="https://www.iea.org/news/ai-is-set-to-drive-surging-electricity-demand-from-data-centres-while-offering-the-potential-to-transform-how-the-energy-sector-works"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors not-italic"
            >
              (IEA)
            </a>
          </blockquote>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── What is EMS ── */}
      <section id="what-is-ems" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>What is an Energy Management System (EMS)?</h2>
          <p className={p}>
            An Energy Management System (EMS) is a digital platform that
            monitors, controls, and optimises energy consumption within a
            building, factory or infrastructure system.
          </p>
          <h3 className={h3}>Traditional EMS platforms typically:</h3>
          <ul className={ul}>
            <li>Track electricity usage</li>
            <li>Monitor power equipment</li>
            <li>Generate reports</li>
            <li>Alert operators about faults</li>
          </ul>
          <p className={p}>
            However, traditional systems are often reactive rather than
            proactive. AI changes that completely.
          </p>
          <h3 className={h3}>AI-powered EMS platforms can:</h3>
          <ul className={ul}>
            <li>Predict energy demand</li>
            <li>Automatically optimise power usage</li>
            <li>Detect abnormalities before failures happen</li>
            <li>Learn usage patterns over time</li>
            <li>Reduce operational costs automatically</li>
          </ul>
          <p className={p}>
            This creates a smarter and more adaptive energy ecosystem.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── Why AI Matters ── */}
      <section id="why-ai-matters" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>Why AI Matters in Energy Management</h2>
          <p className={p}>
            Energy systems generate enormous amounts of data every second,
            including:
          </p>
          <ul className={ul}>
            <li>Voltage levels</li>
            <li>Generator usage</li>
            <li>Solar production</li>
            <li>Battery performance</li>
            <li>Grid consumption</li>
            <li>HVAC operations</li>
            <li>Occupancy behavior</li>
            <li>Weather conditions</li>
          </ul>
          <p className={p}>
            Humans cannot efficiently analyse this volume of information in real
            time. AI thrives in data-heavy environments. Machine learning
            algorithms can process thousands of energy variables instantly and
            make intelligent decisions faster than human operators.
          </p>
          <h3 className={h3}>This leads to:</h3>
          <ul className={ul}>
            <li>Lower energy waste</li>
            <li>Faster fault detection</li>
            <li>Improved power reliability</li>
            <li>Better renewable energy integration</li>
            <li>Lower operational expenses</li>
          </ul>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 1 ── */}
      <section id="reduce-consumption" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>1. AI Helps Reduce Energy Consumption</h2>
          <p className={p}>
            One of the biggest advantages of AI in energy management is energy
            optimisation.
          </p>
          <h3 className={h3}>AI systems continuously analyse:</h3>
          <ul className={ul}>
            <li>Historic consumption</li>
            <li>Real-time power usage</li>
            <li>Occupancy patterns</li>
            <li>Weather forecasts</li>
            <li>Peak demand periods</li>
          </ul>
          <p className={p}>
            Using this information, the system automatically adjusts operations
            to reduce unnecessary energy usage.
          </p>
          <h3 className={h3}>For example:</h3>
          <ul className={ul}>
            <li>Smart HVAC systems can reduce cooling when rooms are empty</li>
            <li>Lighting systems can dim automatically during daylight</li>
            <li>
              Industrial equipment can run during off-peak electricity hours
            </li>
          </ul>
          <blockquote className="border-primary bg-amber-10 text-slate-80 rounded-r-lg border-l-4 px-5 py-4 text-base italic md:text-lg">
            The European Commission&apos;s BUILD UP initiative states that AI
            enables real-time optimisation of heating, cooling, lighting and
            load management systems in buildings.{" "}
            <a
              href="https://build-up.ec.europa.eu/en/resources-and-tools/publications/ai-transforms-energy-management-buildings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors not-italic"
            >
              (BUILD UP)
            </a>
          </blockquote>
          <p className={p}>
            Studies on AI-assisted building control systems also show
            significant improvements in balancing thermal comfort and energy
            efficiency.{" "}
            <a
              href="https://arxiv.org/abs/2104.02214"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors"
            >
              (arXiv)
            </a>
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 2 ── */}
      <section id="predict-demand" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>2. AI Predicts Energy Demand Accurately</h2>
          <p className={p}>
            Traditional systems often struggle with energy forecasting. AI
            solves this by using predictive analytics.
          </p>
          <h3 className={h3}>AI can forecast:</h3>
          <ul className={ul}>
            <li>Hourly electricity demand</li>
            <li>Seasonal consumption trends</li>
            <li>Renewable energy availability</li>
            <li>Generator load requirements</li>
            <li>Battery charging cycles</li>
          </ul>
          <h3 className={h3}>This improves planning and prevents:</h3>
          <ul className={ul}>
            <li>Power overloads</li>
            <li>Unnecessary generator usage</li>
            <li>Energy shortages</li>
            <li>Excess utility costs</li>
          </ul>
          <blockquote className="border-primary bg-amber-10 text-slate-80 rounded-r-lg border-l-4 px-5 py-4 text-base italic md:text-lg">
            The IEA reports that electricity demand from data centres and
            digital infrastructure has grown rapidly, making accurate
            forecasting increasingly important for energy operators.{" "}
            <a
              href="https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors not-italic"
            >
              (IEA)
            </a>
          </blockquote>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 3 ── */}
      <section id="renewable-integration" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>3. AI Improves Renewable Energy Integration</h2>
          <p className={p}>
            Renewable energy sources like solar and wind are highly variable.
            Solar output changes with weather, cloud cover, and time of day. AI
            helps balance these fluctuations intelligently.
          </p>
          <h3 className={h3}>An AI-powered EMS can:</h3>
          <ul className={ul}>
            <li>Predict solar generation levels</li>
            <li>Decide when to store battery power</li>
            <li>Switch between grid and solar automatically</li>
            <li>Optimise battery discharge timing</li>
          </ul>
          <p className={p}>
            This improves renewable energy reliability and reduces dependence on
            diesel generators or unstable grids.
          </p>
          <blockquote className="border-primary bg-amber-10 text-slate-80 rounded-r-lg border-l-4 px-5 py-4 text-base italic md:text-lg">
            Research on renewable-colocated AI data centres found that
            AI-driven energy management systems significantly reduced electricity
            costs through optimised renewable usage and workload scheduling.{" "}
            <a
              href="https://arxiv.org/abs/2507.08011"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors not-italic"
            >
              (arXiv)
            </a>
          </blockquote>
          <blockquote className="border-primary bg-amber-10 text-slate-80 rounded-r-lg border-l-4 px-5 py-4 text-base italic md:text-lg">
            The global AI renewable energy management market is projected to
            grow from approximately $1.68 billion in 2025 to over $8.15 billion
            by 2033.{" "}
            <a
              href="https://www.grandviewresearch.com/horizon/statistics/ai-in-energy-market/application/renewable-energy-management/global"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors not-italic"
            >
              (Grand View Research)
            </a>
          </blockquote>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 4 ── */}
      <section id="predictive-maintenance" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>4. AI Enables Predictive Maintenance</h2>
          <p className={p}>
            Energy equipment failures are expensive. A damaged inverter,
            generator failure or faulty transformer can disrupt operations,
            increase downtime, raise repair costs, and waste energy.
          </p>
          <p className={p}>
            AI systems detect anomalies early by analysing equipment behaviour
            patterns.
          </p>
          <h3 className={h3}>For example, AI can identify:</h3>
          <ul className={ul}>
            <li>Voltage irregularities</li>
            <li>Abnormal temperature spikes</li>
            <li>Battery degradation</li>
            <li>Generator inefficiencies</li>
          </ul>
          <p className={p}>
            before a failure happens. This is called{" "}
            <strong className="font-semibold text-slate-100">
              predictive maintenance
            </strong>
            . Instead of waiting for breakdowns, businesses can fix issues
            proactively.
          </p>
          <h3 className={h3}>The result:</h3>
          <ul className={ul}>
            <li>Reduced downtime</li>
            <li>Longer equipment lifespan</li>
            <li>Lower maintenance costs</li>
          </ul>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 5 ── */}
      <section id="reduce-costs" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>5. AI Reduces Operational Costs</h2>
          <p className={p}>
            Energy is one of the highest operating expenses for many businesses.
          </p>
          <h3 className={h3}>AI helps reduce costs through:</h3>
          <ul className={ul}>
            <li>Smart automation</li>
            <li>Load balancing</li>
            <li>Peak shaving</li>
            <li>Demand forecasting</li>
            <li>Real-time optimization</li>
          </ul>
          <blockquote className="border-primary bg-amber-10 text-slate-80 rounded-r-lg border-l-4 px-5 py-4 text-base italic md:text-lg">
            According to{" "}
            <a
              href="https://www.grandviewresearch.com/industry-analysis/ai-energy-market-report"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors not-italic"
            >
              Grand View Research
            </a>
            , the global AI-in-energy market was
            valued at approximately $5.1 billion in 2025 and is projected to
            reach $22.2 billion by 2033, growing at a CAGR of 20.4%.
            This rapid growth is largely driven by
            companies seeking lower operational costs and more efficient energy
            infrastructure.{" "}
            <a
              href="https://www.grandviewresearch.com/industry-analysis/ai-energy-market-report"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors not-italic"
            >
              (Grand View Research)
            </a>
          </blockquote>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 6 ── */}
      <section id="smart-grids" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>6. AI Helps Stabilise Smart Grids</h2>
          <p className={p}>
            Modern energy systems are becoming decentralised. Instead of relying
            solely on national grids, businesses now use solar systems, battery
            storage, generators, EV charging systems, and microgrids. Managing
            these interconnected systems manually is extremely complex.
          </p>
          <p className={p}>
            AI acts as the &ldquo;brain&rdquo; of the energy ecosystem.
          </p>
          <h3 className={h3}>It automatically:</h3>
          <ul className={ul}>
            <li>Balances loads</li>
            <li>Prioritises energy sources</li>
            <li>Detects faults</li>
            <li>Responds to demand spikes</li>
          </ul>
          <p className={p}>
            This creates more resilient and reliable power systems.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 7 ── */}
      <section id="sustainability" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>7. AI Supports Sustainability Goals</h2>
          <p className={p}>
            Companies worldwide are under pressure to reduce carbon emissions.
          </p>
          <h3 className={h3}>AI helps organisations:</h3>
          <ul className={ul}>
            <li>Minimise energy waste</li>
            <li>Improve efficiency</li>
            <li>Increase renewable usage</li>
            <li>Reduce fossil fuel dependence</li>
          </ul>
          <blockquote className="border-primary bg-amber-10 text-slate-80 rounded-r-lg border-l-4 px-5 py-4 text-base italic md:text-lg">
            The IEA notes that AI could help accelerate emissions reduction by
            enabling smarter energy optimisation and grid management.{" "}
            <a
              href="https://www.iea.org/reports/energy-and-ai/ai-and-climate-change"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors not-italic"
            >
              (IEA)
            </a>
          </blockquote>
          <p className={p}>
            For businesses pursuing ESG (Environmental, Social, and Governance)
            goals, AI-powered EMS platforms are becoming essential.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── Real-World Applications ── */}
      <section id="real-world" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className={h2}>Real-World Applications of AI in Energy Management</h2>
          <p className={p}>
            AI-powered energy systems are already being used across multiple
            sectors:
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              {
                title: "Smart Buildings",
                items: ["HVAC systems", "Lighting", "Ventilation", "Occupancy-based energy usage"],
              },
              {
                title: "Manufacturing Plants",
                items: ["Machine energy loads", "Production scheduling", "Power-intensive operations"],
              },
              {
                title: "Data Centres",
                items: ["Cooling systems", "Server workloads", "Power distribution"],
                note: "The IEA estimates data centres consumed approximately 415 terawatt-hours (TWh) of electricity in 2024 and about 1.5% of global electricity consumption.",
                noteLink: "https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai",
              },
              {
                title: "Renewable Energy Farms",
                items: ["Solar forecasting", "Wind generation prediction", "Battery storage optimisation"],
              },
              {
                title: "Smart Homes",
                items: ["Thermostats", "Appliances", "Smart plugs", "Energy scheduling"],
              },
            ].map(({ title, items, note, noteLink }) => (
              <div
                key={title}
                className="border-border bg-card ring-border rounded-xl border p-5 shadow-sm ring-1"
              >
                <h3 className="text-slate-100 mb-3 font-bold">{title}</h3>
                <p className="text-slate-70 mb-2 text-sm">AI controls / optimises / manages:</p>
                <ul className="text-slate-80 list-disc space-y-1 pl-5 text-sm">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {note && (
                  <p className="text-slate-70 mt-3 text-xs italic">
                    {note}{" "}
                    {noteLink && (
                      <a
                        href={noteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors"
                      >
                        (IEA)
                      </a>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── Challenges ── */}
      <section id="challenges" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>Challenges of AI in Energy Management</h2>
          <p className={p}>
            Despite its advantages, AI adoption still faces challenges.
          </p>
          <div className="space-y-4">
            {[
              {
                title: "High initial investment",
                desc: "Deploying AI infrastructure can be expensive initially.",
              },
              {
                title: "Data quality",
                desc: "AI systems depend heavily on accurate energy data.",
              },
              {
                title: "Cybersecurity risks",
                desc: "Connected energy systems require strong digital protection.",
              },
              {
                title: "Skills gap",
                desc: "Many organisations lack AI and energy analytics expertise.",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="border-slate-30 flex items-start gap-4 border-b pb-4 last:border-0">
                <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
                <div>
                  <p className="text-slate-100 font-semibold">{title}</p>
                  <p className="text-slate-80 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={p}>
            However, as AI tools become more affordable and accessible, adoption
            continues to accelerate globally.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── Future ── */}
      <section id="future" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>The Future of AI in Energy Management</h2>
          <p className={p}>
            The future of energy management will be automated, predictive,
            intelligent, decentralised, and sustainable.
          </p>
          <p className={p}>AI is expected to play a major role in:</p>
          <ul className={ul}>
            <li>Smart grids</li>
            <li>Electric vehicle ecosystems</li>
            <li>Renewable integration</li>
            <li>Carbon tracking</li>
            <li>Industrial automation</li>
          </ul>
          <blockquote className="border-primary bg-amber-10 text-slate-80 rounded-r-lg border-l-4 px-5 py-4 text-base italic md:text-lg">
            The International Energy Agency describes AI as a potentially
            transformative force for the energy sector, similar in significance
            to electricity itself.{" "}
            <a
              href="https://www.iea.org/reports/energy-and-ai/executive-summary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-amber-60 font-medium underline underline-offset-2 transition-colors not-italic"
            >
              (IEA)
            </a>
          </blockquote>
          <p className={p}>
            For businesses operating hybrid energy systems, especially in
            regions with unstable grids like many African markets, AI-powered
            energy management may become a necessity rather than a luxury.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── Key Takeaways ── */}
      <section id="key-takeaways" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>Key Takeaways</h2>
          <p className={p}>
            AI is revolutionising energy management systems by turning static
            infrastructure into intelligent adaptive ecosystems.
          </p>
          <p className={p}>
            Instead of simply monitoring electricity usage, AI-powered systems
            can now:
          </p>
          <ul className={ul}>
            <li>Predict demand</li>
            <li>Optimize consumption</li>
            <li>Reduce waste</li>
            <li>Prevent equipment failure</li>
            <li>Improve sustainability</li>
            <li>Lower operational costs</li>
          </ul>
          <p className={p}>
            As energy challenges continue to grow globally, businesses that
            adopt AI-driven energy solutions early will gain a significant
            operational and financial advantage.
          </p>
          <p className="text-slate-100 text-lg font-bold italic md:text-xl">
            The future of energy is not just digital, it is intelligent.
          </p>
        </motion.div>
      </section>

    </div>
  );
}
