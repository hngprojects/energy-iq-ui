import Contact from "@/components/external/contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | EnergyIQ",
  description: "Get in touch with the EnergyIQ team.",
};

export default function ContactPage() {
  return (
    <div className="flex w-full flex-col">
      <Contact />
    </div>
  );
}
