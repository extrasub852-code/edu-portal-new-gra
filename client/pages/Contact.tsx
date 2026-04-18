import { useState } from "react";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

/** Official Scheller IT — https://www.scheller.gatech.edu/directory/offices/itservices/index.html */
const SCHELLER_IT = {
  name: "IT Services Office",
  college: "Scheller College of Business",
  institute: "Georgia Institute of Technology",
  email: "helpdesk@scheller.gatech.edu",
  phone: "404-385-5188",
  phoneTel: "tel:+14043855188",
  suite: "Suite 204",
  addressLines: ["800 W. Peachtree St. NW", "Atlanta, GA 30308"],
  itPage: "https://www.scheller.gatech.edu/directory/offices/itservices/index.html",
  classroomSupport:
    "https://www.scheller.gatech.edu/directory/offices/oit-classroom-support/index.html",
  /** Typical institute business hours; confirm with the help desk for holidays and breaks. */
  officeHoursSummary:
    "Monday–Friday, business hours (Eastern Time). Support is typically available when classes are in session; hours may change during breaks and holidays.",
  social: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/school/georgia-tech-scheller-college-of-business/",
      icon: Linkedin,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/schellercollege/",
      icon: Instagram,
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/schellercollege/",
      icon: Facebook,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/user/SchellerCollege",
      icon: Youtube,
    },
  ],
};

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 800);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#B3A369]">
          {SCHELLER_IT.college}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#003057]">Contact Us</h1>
        <p className="mt-2 text-base text-[#003057]/80">
          Technology support for Scheller students, faculty, and staff — plus a message form for general
          EduPortal feedback.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#003057]">{SCHELLER_IT.name}</h2>
            <p className="mt-1 text-sm text-[#003057]/75">
              For classroom technology issues, see{" "}
              <a
                href={SCHELLER_IT.classroomSupport}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#003057] underline underline-offset-2 hover:text-[#003057]/90"
              >
                OIT classroom support
              </a>
              .
            </p>
          </div>

          <div className="space-y-4 rounded-xl border border-[#003057]/10 bg-white p-5 shadow-sm">
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#B3A369]" aria-hidden />
              <div>
                <div className="text-sm font-semibold text-[#003057]">Email</div>
                <a
                  href={`mailto:${SCHELLER_IT.email}`}
                  className="text-sm text-[#003057]/90 underline underline-offset-2 hover:text-[#003057]"
                >
                  {SCHELLER_IT.email}
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#B3A369]" aria-hidden />
              <div>
                <div className="text-sm font-semibold text-[#003057]">Phone</div>
                <a
                  href={SCHELLER_IT.phoneTel}
                  className="text-sm text-[#003057]/90 underline underline-offset-2 hover:text-[#003057]"
                >
                  {SCHELLER_IT.phone}
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#B3A369]" aria-hidden />
              <div>
                <div className="text-sm font-semibold text-[#003057]">Location</div>
                <p className="text-sm text-[#003057]/85">
                  {SCHELLER_IT.suite}
                  <br />
                  {SCHELLER_IT.institute}
                  <br />
                  {SCHELLER_IT.addressLines[0]}
                  <br />
                  {SCHELLER_IT.addressLines[1]}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#B3A369]" aria-hidden />
              <div>
                <div className="text-sm font-semibold text-[#003057]">Office hours</div>
                <p className="text-sm text-[#003057]/85">{SCHELLER_IT.officeHoursSummary}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#003057]/70">
            Official directory:{" "}
            <a
              href={SCHELLER_IT.itPage}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#003057] underline underline-offset-2"
            >
              Scheller IT Services
            </a>
            . Institute-wide IT:{" "}
            <a
              href="https://techsupport.gatech.edu/contact-us"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#003057] underline underline-offset-2"
            >
              Georgia Tech OIT
            </a>
            .
          </p>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#003057]">
              Scheller social media
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {SCHELLER_IT.social.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-[#003057]/15 bg-white px-3 py-2 text-sm font-semibold text-[#003057] shadow-sm transition-colors hover:bg-[#003057]/5"
                >
                  <Icon className="h-4 w-4 text-[#B3A369]" aria-hidden />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-extrabold text-[#003057]">Send us a message</h2>
          <p className="mb-4 text-sm text-[#003057]/75">
            Use this form for general EduPortal feedback. For Scheller technology help, email or call the
            IT help desk above.
          </p>
          <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-[#003057]/10 bg-white p-6 shadow-sm">
            <label className="block text-sm font-semibold text-[#003057]">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-[#003057]/20 px-3 py-2 text-sm text-[#003057]"
            />

            <label className="block text-sm font-semibold text-[#003057]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[#003057]/20 px-3 py-2 text-sm text-[#003057]"
            />

            <label className="block text-sm font-semibold text-[#003057]">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full rounded-md border border-[#003057]/20 px-3 py-2 text-sm text-[#003057]"
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-[#003057]/70">
                {status === "error" && <span className="text-red-600">Please fill all fields.</span>}
                {status === "sent" && (
                  <span className="text-green-700">Thanks — this demo doesn’t send email yet.</span>
                )}
              </div>

              <button
                type="submit"
                className="rounded-md bg-[#B3A369] px-4 py-2 text-sm font-semibold text-[#003057] hover:bg-[#a4945c]"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
