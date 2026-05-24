"use client";

import { motion } from "motion/react";

const h2 = "mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl";
const h3 = "mb-3 text-lg font-semibold text-slate-100";
const p = "text-md text-slate-80 leading-relaxed md:text-lg";
const ul = "text-md text-slate-80 list-disc space-y-1 pl-6 leading-relaxed md:text-lg";
const divider = "border-slate-30 my-10 border-t";
const section = "scroll-mt-32 space-y-4";

export default function Post1Content() {
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
            You finally make the decision and invest in that solar setup, but
            you still find your solar is draining faster than expected. A solar
            setup marketed to last for 8 hours is only lasting for 5 hours, and
            it has only been a month.
          </p>
          <p className={p}>
            In most cases, the problem might not be the solar setup, the
            appliances connected to it are the real issue.
          </p>
          <p className={p}>
            Choosing energy efficient appliances is one of the smartest ways to
            improve the performance of your solar system. The right appliances
            help your inverter last longer, preserve your battery life, and give
            you more hours of power during outages.
          </p>
          <h2 className={h2}>
            Here is how to choose the right appliances for your solar inverter:
          </h2>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 1 ── */}
      <section id="inverter-capacity" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>1. You Need To Understand Your Inverter Capacity</h2>
          <p className={p}>
            Before buying any appliance, know the capacity of your inverter
            system. Every inverter has a limit to how much load it can carry at
            once.
          </p>
          <h3 className={h3}>For example:</h3>
          <ul className={ul}>
            <li>
              A <strong className="font-semibold text-slate-100">1.5kVA inverter</strong> cannot
              comfortably power heavy appliances like:
              <ul className="mt-1 list-disc space-y-1 pl-6">
                <li>Air conditioners</li>
                <li>Electric cookers</li>
                <li>Large freezers simultaneously</li>
              </ul>
            </li>
            <li>
              A <strong className="font-semibold text-slate-100">5kVA inverter</strong> can handle:
              <ul className="mt-1 list-disc space-y-1 pl-6">
                <li>More appliances</li>
                <li>Larger loads</li>
              </ul>
            </li>
          </ul>
          <h3 className={h3}>
            If your appliances consume more power than your inverter can supply,
            you may experience:
          </h3>
          <ul className={ul}>
            <li>Frequent shutdowns</li>
            <li>Faster battery drainage</li>
            <li>Reduced battery lifespan</li>
            <li>System overload</li>
          </ul>
          <p className={p}>
            Always make sure you match appliance usage to your inverter capacity.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 2 ── */}
      <section id="power-rating" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>2. Check the Power Rating</h2>
          <p className={p}>
            Every appliance comes with a wattage rating, usually written on a
            label or sticker. This tells you how much electricity the appliance
            consumes.
          </p>
          <h3 className={h3}>Examples:</h3>

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
                  ["LED TV", "30W to 100W"],
                  ["Standing Fan", "45W to 75W"],
                  ["Refrigerator", "100W to 400W"],
                  ["Electric Iron", "1000W to 2000W"],
                ].map(([appliance, power], i) => (
                  <tr key={appliance} className={i % 2 === 1 ? "bg-surface-50" : ""}>
                    <td className="border-slate-30 text-slate-80 border-t px-4 py-3">{appliance}</td>
                    <td className="border-slate-30 text-slate-80 border-t px-4 py-3">{power}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={p}>Lower wattage generally means lower energy consumption.</p>
          <h3 className={h3}>
            When choosing appliances for a solar inverter system, make sure you:
          </h3>
          <ul className={ul}>
            <li>Compare wattages before buying</li>
            <li>Choose the lower energy option where possible</li>
            <li>Avoid unnecessarily high power appliances</li>
          </ul>
          <p className={p}>
            A small reduction in wattage can make a major difference over time.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 3 ── */}
      <section id="energy-efficient" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>3. Prioritize Energy Efficient Appliances</h2>
          <p className={p}>
            Not all appliances are built the same. Some are designed
            specifically to consume less electricity while delivering the same
            performance.
          </p>
          <h3 className={h3}>You should always look out for:</h3>
          <ul className={ul}>
            <li>Inverter refrigerators</li>
            <li>LED televisions</li>
            <li>LED bulbs</li>
            <li>Energy saving fans</li>
            <li>Front load washing machines</li>
            <li>Appliances with energy efficiency ratings</li>
          </ul>
          <p className={p}>
            These appliances reduce the pressure on your solar system and
            improve overall efficiency.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 4 ── */}
      <section id="heating-appliances" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>4. Avoid High Heating Appliances</h2>
          <p className={p}>
            Heating appliances consume massive amounts of power and can quickly
            overwhelm small or medium inverter systems.
          </p>
          <h3 className={h3}>Examples include:</h3>
          <ul className={ul}>
            <li>Electric kettles</li>
            <li>Water heaters</li>
            <li>Electric cookers</li>
            <li>Microwaves</li>
            <li>Pressing irons</li>
          </ul>
          <p className={p}>
            These appliances are usually not ideal for inverter use unless you
            have a large capacity solar setup.
          </p>
          <h3 className={h3}>Instead, you could:</h3>
          <ul className={ul}>
            <li>Use gas cookers where possible</li>
            <li>Heat water with gas or alternative methods</li>
            <li>Limit heavy heating appliances on battery power</li>
          </ul>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 5 ── */}
      <section id="startup-power" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>5. Consider Startup Power</h2>
          <p className={p}>
            Some appliances use more power when they first start than during
            normal operation. This is called surge power or startup load.
          </p>
          <h3 className={h3}>Appliances like:</h3>
          <ul className={ul}>
            <li>Refrigerators</li>
            <li>Freezers</li>
            <li>Air conditioners</li>
            <li>Pumps</li>
          </ul>
          <p className={p}>
            may briefly consume two to three times their normal running wattage
            during startup.
          </p>
          <p className={p}>
            If your inverter cannot handle this surge, the system may trip or
            fail to power the appliance properly.
          </p>
          <h3 className={h3}>Always check:</h3>
          <ul className={ul}>
            <li>Running wattage</li>
            <li>Startup wattage</li>
          </ul>
          <p className={p}>before connecting appliances to your inverter.</p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 6 ── */}
      <section id="led-lighting" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>6. Switch to LED Lighting</h2>
          <p className={p}>
            Lighting is one of the easiest ways to reduce energy use. Traditional
            bulbs consume more electricity and produce more heat, while LED bulbs
            use far less power and last significantly longer.
          </p>
          <h3 className={h3}>For example:</h3>
          <ul className={ul}>
            <li>
              A <strong className="font-semibold text-slate-100">60W incandescent bulb</strong> can
              often be replaced with a{" "}
              <strong className="font-semibold text-slate-100">9W LED bulb</strong>
            </li>
          </ul>
          <p className={p}>
            That single switch can greatly improve battery runtime across your
            entire home.
          </p>
        </motion.div>
      </section>

      <div className={divider} />

      {/* ── 7 ── */}
      <section id="long-term" className={section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className={h2}>7. Think Long Term, Not Just Purchase Price</h2>
          <p className={p}>
            Cheaper appliances are not always cheaper in the long run, especially
            when energy consumption is taken into account.
          </p>
          <h3 className={h3}>
            An appliance with low upfront cost but high power consumption may:
          </h3>
          <ul className={ul}>
            <li>Increase battery strain</li>
            <li>Reduce backup time</li>
            <li>Raise electricity costs</li>
            <li>Force earlier battery replacement</li>
          </ul>
          <p className={p}>
            In many cases, what looks like a &ldquo;budget-friendly&rdquo;
            purchase initially can become more expensive over several months or
            years of use.
          </p>
          <p className={p}>
            Energy efficient appliances, on the other hand, may require a higher
            initial investment, but they are designed to optimize power usage and
            reduce waste.
          </p>
          <h3 className={h3}>This often results in:</h3>
          <ul className={ul}>
            <li>Lower electricity consumption over time</li>
            <li>Better performance in solar and inverter systems</li>
            <li>Reduced pressure on household energy storage systems</li>
            <li>Long term savings that outweigh the initial purchase cost</li>
          </ul>
          <p className={p}>
            Thinking long term helps homeowners make smarter energy decisions that
            balance both cost and efficiency, rather than focusing only on what is
            cheaper at the point of purchase.
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
            Your solar inverter is only as efficient as the appliances connected
            to it. That&apos;s why every appliance choice should be made with
            your system&apos;s capacity and energy efficiency in mind, not just
            convenience or cost.
          </p>
          <h3 className={h3}>Choosing energy efficient appliances helps you:</h3>
          <ul className={ul}>
            <li>Maximize backup time</li>
            <li>Protect your batteries</li>
            <li>Reduce energy waste</li>
            <li>Improve overall system performance</li>
          </ul>
          <h3 className={h3}>Before buying that appliance, always ask:</h3>
          <blockquote className="border-primary bg-amber-10 text-slate-80 rounded-r-lg border-l-4 px-5 py-4 text-base italic md:text-lg">
            &ldquo;How much power does this consume?&rdquo;
            <br />
            &ldquo;Is it suitable for my inverter setup?&rdquo;
          </blockquote>
          <p className={p}>
            These simple questions can save you money, frustration, and
            unnecessary power problems in the future.
          </p>
        </motion.div>
      </section>

    </div>
  );
}
