import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[#003057]/10 bg-[#0A1E2F] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10">
              <span className="text-sm font-extrabold tracking-tight text-[#B3A369]">EP</span>
            </div>
            <span className="text-lg font-extrabold">EduPortal</span>
          </div>
          <p className="text-sm text-white/80">
            Empowering learners worldwide with quality education and expert instruction.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Platform</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/courses" className="hover:text-white">Courses</Link></li>
            <li><Link to="/instructors" className="hover:text-white">Instructors</Link></li>
            <li><Link to="/certificates" className="hover:text-white">Certificates</Link></li>
            <li><Link to="/use-case-finder" className="hover:text-white">Use Case Finder</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Company</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/about" className="hover:text-white">How to Use</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Connect</h3>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white/90 hover:bg-white/20">f</a>
            <a href="#" aria-label="Twitter" className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white/90 hover:bg-white/20">t</a>
            <a href="#" aria-label="LinkedIn" className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white/90 hover:bg-white/20">in</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-white/70 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} EduPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
