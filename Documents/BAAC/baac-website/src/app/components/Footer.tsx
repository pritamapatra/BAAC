import Link from "next/link";

export default function Footer({ id }: { id?: string }) {
  return (
    <footer id={id} className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg md:text-xl font-semibold mb-2">Contact Us</h3>
          <p className="text-sm md:text-base">Email: info@baac.org</p>
          <p className="text-sm md:text-base">Phone: +1234567890</p>
        </div>
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg md:text-xl font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <Link href="#" className="text-white hover:text-blue-400"><i className="fab fa-facebook-f"></i></Link>
            <Link href="#" className="text-white hover:text-blue-400"><i className="fab fa-twitter"></i></Link>
            <Link href="#" className="text-white hover:text-blue-400"><i className="fab fa-instagram"></i></Link>
            <Link href="#" className="text-white hover:text-blue-400"><i className="fab fa-youtube"></i></Link>
          </div>
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">Location</h3>
          <p className="text-sm md:text-base">Bhakti Vedanta Academy,</p>
          <p className="text-sm md:text-base">Spiritual Lane, Holy Town,</p>
          <p className="text-sm md:text-base">Country XYZ</p>
        </div>
      </div>
      <div className="text-center mt-8">
        <p className="text-sm md:text-base">&copy; 2023 BAAC. All rights reserved.</p>
      </div>
    </footer>
  );
}