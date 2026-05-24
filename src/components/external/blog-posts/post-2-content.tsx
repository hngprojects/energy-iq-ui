"use client";

import { motion } from "motion/react";

const h2 = "mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl";
const h3 = "mb-3 text-lg font-semibold text-slate-100";
const p = "text-md text-slate-80 leading-relaxed md:text-lg";
const ul = "text-md text-slate-80 list-disc space-y-1 pl-6 leading-relaxed md:text-lg";
const divider = "border-slate-30 my-10 border-t";
const section = "scroll-mt-32 space-y-4";

export default function Post2Content() {
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
          <p className={p}>
            Imagine that you buy a new appliance, plug it in, and suddenly your
            electricity bill jumps higher than expected. Or maybe your inverter
            backup no longer lasts as long as it used to.
          </p>
          <p className={p}>
            In many homes, the problem is not just electricity supply — it is
            poor understanding of how much power everyday appliances actually
            consume.
          </p>
          <p className={p}>
            Understanding power consumption helps you make smarter energy
            decisions. It allows you to reduce waste, lower electricity costs,
            improve inverter performance, and manage your home energy usage more
            efficiently.
          </p>
          <h2 className={h2}>
            Here is what you need to know about power consumption in homes:
          </h2>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 1 ── */}
      <section id="what-power-means" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>1. What Power Consumption Actually Means</h2>
          <p className={p}>
            Power consumption simply refers to the amount of electricity an
            appliance uses to operate.
          </p>
          <p className={p}>This is usually measured in:</p>
          <ul className={ul}>
            <li>Watts (W)</li>
            <li>Kilowatts (kW)</li>
          </ul>
          <p className={p}>
            The higher the wattage, the more electricity the appliance consumes.
          </p>
          <h3 className={h3}>For example:</h3>

          {/* Table */}
          <div className="border-slate-30 overflow-hidden rounded-lg border">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead className="bg-secondary text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Appliance</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Power Consumption</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["LED bulb", "5W to 15W"],
                  ["Television", "30W to 150W"],
                  ["Standing fan", "45W to 75W"],
                  ["Refrigerator", "100W to 400W"],
                  ["Air conditioner", "1000W and above"],
                ].map(([appliance, power], i) => (
                  <tr key={appliance} className={i % 2 === 1 ? "bg-surface-50" : ""}>
                    <td className="border-slate-30 text-slate-80 border-t px-4 py-3">{appliance}</td>
                    <td className="border-slate-30 text-slate-80 border-t px-4 py-3">{power}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={p}>
            Understanding these numbers helps you know which appliances consume
            the most energy in your home.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 2 ── */}
      <section id="high-power-appliances" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>2. High Power Appliances Consume Energy Faster</h2>
          <p className={p}>
            Not all appliances use electricity at the same rate. Heating and
            cooling appliances are usually the biggest energy consumers in most
            homes.
          </p>
          <h3 className={h3}>Examples include:</h3>
          <ul className={ul}>
            <li>Air conditioners</li>
            <li>Electric irons</li>
            <li>Water heaters</li>
            <li>Electric cookers</li>
            <li>Microwaves</li>
          </ul>
          <p className={p}>
            These appliances consume large amounts of power within short periods.
          </p>
          <h3 className={h3}>
            Using multiple high power appliances at the same time can:
          </h3>
          <ul className={ul}>
            <li>Increase electricity bills</li>
            <li>Drain inverter batteries faster</li>
            <li>Overload smaller solar systems</li>
          </ul>
          <p className={p}>
            Being mindful of how often and how long these appliances are used can
            significantly reduce energy costs.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 3 ── */}
      <section id="usage-time" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>3. Usage Time Matters</h2>
          <p className={p}>
            Power consumption is not only about appliance wattage — how long the
            appliance runs also matters.
          </p>
          <h3 className={h3}>For example:</h3>
          <p className={p}>
            A <strong className="font-semibold text-slate-100">2000W pressing iron</strong> used
            for 15 minutes may consume less energy than a{" "}
            <strong className="font-semibold text-slate-100">100W television</strong> running for
            10 hours.
          </p>
          <p className={p}>
            This is why some appliances quietly increase electricity bills over
            time simply because they stay on for long periods.
          </p>
          <h3 className={h3}>To reduce unnecessary energy usage:</h3>
          <ul className={ul}>
            <li>Turn off appliances when not in use</li>
            <li>Avoid leaving devices on standby</li>
            <li>Reduce overnight appliance usage where possible</li>
          </ul>
          <p className={p}>
            Small habits can make a noticeable difference in overall energy
            consumption and electricity costs.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 4 ── */}
      <section id="energy-efficient" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>4. Energy Efficient Appliances Reduce Consumption</h2>
          <p className={p}>
            Modern energy efficient appliances are designed to deliver better
            performance while consuming less electricity.
          </p>
          <h3 className={h3}>Examples include:</h3>
          <ul className={ul}>
            <li>LED bulbs</li>
            <li>Inverter air conditioners</li>
            <li>Inverter refrigerators</li>
            <li>Energy saving televisions</li>
            <li>Front load washing machines</li>
          </ul>
          <p className={p}>
            Although these appliances may cost more initially, they often reduce
            long term electricity expenses while improving the overall energy
            efficiency in the home.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 5 ── */}
      <section id="kilowatt-hours" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>5. Understanding Kilowatt Hours</h2>
          <p className={p}>
            Electricity providers usually bill homes using kilowatt hours (kWh).
            A kilowatt hour simply means using{" "}
            <strong className="font-semibold text-slate-100">
              1000 watts of electricity for one hour.
            </strong>
          </p>
          <h3 className={h3}>For example:</h3>
          <ul className={ul}>
            <li>
              A <strong className="font-semibold text-slate-100">100W bulb</strong> running for
              10 hours equals <strong className="font-semibold text-slate-100">1 kWh</strong>
            </li>
            <li>
              A <strong className="font-semibold text-slate-100">2000W appliance</strong> running
              for 30 minutes also equals{" "}
              <strong className="font-semibold text-slate-100">1 kWh</strong>
            </li>
          </ul>
          <h3 className={h3}>
            Understanding how kilowatt hours work helps homeowners:
          </h3>
          <ul className={ul}>
            <li>Identify which appliances consume the most energy</li>
            <li>Understand how electricity bills increase</li>
            <li>Make better decisions about daily energy usage</li>
          </ul>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 6 ── */}
      <section id="phantom-power" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>6. Phantom Power Is Real</h2>
          <p className={p}>
            Some appliances continue consuming electricity even when they are
            turned off. This is known as:
          </p>
          <ul className={ul}>
            <li>Phantom power</li>
            <li>Standby power</li>
          </ul>
          <h3 className={h3}>Examples include:</h3>
          <ul className={ul}>
            <li>Televisions</li>
            <li>Microwaves</li>
            <li>Decoders</li>
            <li>Game consoles</li>
            <li>Chargers left plugged in</li>
          </ul>
          <p className={p}>
            The amount of electricity used may seem small at first, but it builds
            up over time and can increase your energy bill.
          </p>
          <p className={p}>
            Unplugging devices when they are not in use is a simple way to reduce
            unnecessary energy waste and improve overall power efficiency.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 7 ── */}
      <section id="monitoring" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>7. Monitoring Consumption Helps You Save</h2>
          <p className={p}>
            One of the most effective ways to reduce electricity waste is by
            paying closer attention to how energy is used in your home.
          </p>
          <h3 className={h3}>When you monitor your energy usage, it helps you to:</h3>
          <ul className={ul}>
            <li>Identify which appliances consume the most electricity</li>
            <li>Reduce unnecessary appliance usage</li>
            <li>Use appliances during off peak periods where applicable</li>
            <li>
              Replace old, inefficient appliances with more energy efficient
              options
            </li>
          </ul>
          <p className={p}>
            The more aware you are of your home&apos;s energy consumption habits,
            the easier it becomes to manage electricity usage, reduce waste, and
            lower overall energy costs.
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
            Understanding power consumption is one of the first steps toward
            building an energy efficient home.
          </p>
          <p className={p}>
            When you understand how electricity is used in your home, you can:
          </p>
          <ul className={ul}>
            <li>Reduce electricity bills</li>
            <li>Improve inverter performance</li>
            <li>Extend battery backup time</li>
            <li>Reduce energy waste</li>
            <li>Make smarter appliance decisions</li>
          </ul>
          <p className={p}>
            Every appliance in your home contributes to your overall energy
            usage. The better you understand that consumption, the better control
            you have over your energy costs and power efficiency.
          </p>
        </motion.div>
      </section>

    </div>
  );
}
